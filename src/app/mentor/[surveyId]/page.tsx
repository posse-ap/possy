import { MentorSurvey } from "@/components/page/MentorSurvey";
import { getSurvey } from "@/usecases/survey";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function MentorSurveyPage({ params }: PageProps) {
  const { surveyId } = await params;

  const survey = await getSurvey(surveyId);

  if (!survey) {
    notFound();
  }

  return (
    <MentorSurvey
      surveyId={surveyId}
      surveyTitle={survey.title}
      surveyDescription={survey.description}
      startDate={survey.startDate}
      endDate={survey.endDate}
    />
  );
}
