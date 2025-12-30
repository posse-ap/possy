import { notFound } from "next/navigation";
import { MentorSurvey } from "@/components/page/MentorSurvey";
import { getSurvey } from "@/usecases/survey";

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
