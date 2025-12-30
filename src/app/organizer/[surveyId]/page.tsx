import { notFound } from "next/navigation";
import { OrganizerSurveyDetail } from "@/components/page/OrganizerSurveyDetail";
import { getAccessTokenFromSession } from "@/libs/googleApi";
import { getServerSupabaseClient } from "@/libs/supabaseClient";
import { listMentorResponses } from "@/usecases/mentorResponse";
import { getSurvey } from "@/usecases/survey";

type PageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function OrganizerSurveyDetailPage({ params }: PageProps) {
  const { surveyId } = await params;

  const survey = await getSurvey(surveyId);

  if (!survey) {
    notFound();
  }

  // Supabaseセッションからアクセストークンを取得
  const supabase = await getServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = getAccessTokenFromSession(session);

  // スプレッドシートIDを抽出
  const spreadsheetId = extractSpreadsheetId(survey.spreadsheetUrl);

  const responses = await listMentorResponses(
    surveyId,
    spreadsheetId || undefined,
    accessToken || undefined,
  );

  return <OrganizerSurveyDetail survey={survey} responses={responses} />;
}

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
