import { notFound } from "next/navigation";
import { OrganizerSurveyDetail } from "@/components/page/OrganizerSurveyDetail";
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

  const responses = await listMentorResponses(surveyId);

  return <OrganizerSurveyDetail survey={survey} responses={responses} />;
}
