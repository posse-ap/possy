import { notFound } from "next/navigation";
import { OrganizerSurveyDetail } from "@/components/page/OrganizerSurveyDetail";
import { dummySurveys } from "@/models/survey/dummySurveys";

type PageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function OrganizerSurveyDetailPage({ params }: PageProps) {
  const { surveyId } = await params;

  // アンケートを取得（実際にはAPIから取得）
  const survey = dummySurveys.find((s) => s.id === surveyId);

  if (!survey) {
    notFound();
  }

  return <OrganizerSurveyDetail survey={survey} />;
}
