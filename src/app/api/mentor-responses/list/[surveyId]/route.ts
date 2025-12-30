import { NextResponse } from "next/server";
import { getAccessTokenFromSession } from "@/libs/googleApi";
import { getServerSupabaseClient } from "@/libs/supabaseClient";
import { listMentorResponses } from "@/usecases/mentorResponse";
import { getSurvey } from "@/usecases/survey";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surveyId: string }> },
) {
  try {
    const { surveyId } = await params;

    // Surveyを取得してスプレッドシートIDを得る
    const survey = await getSurvey(surveyId);
    const spreadsheetId = survey
      ? extractSpreadsheetId(survey.spreadsheetUrl)
      : null;

    // Supabaseセッションからアクセストークンを取得
    const supabase = await getServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = await getAccessTokenFromSession(session);

    const responses = await listMentorResponses(
      surveyId,
      spreadsheetId || undefined,
      accessToken || undefined,
    );

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching mentor responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
