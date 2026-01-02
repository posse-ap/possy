import { OrganizerSurveyList } from "@/components/page/OrganizerSurveyList";
import { mentorResponseRepository } from "@/repositories/persistence";
import { listSurveys } from "@/usecases/survey";

export default async function OrganizerPage() {
  const surveys = await listSurveys();

  // 各アンケートの回答数を取得
  const surveysWithCounts = await Promise.all(
    surveys.map(async (survey) => {
      const responses = await mentorResponseRepository.findBySurveyId(
        survey.id,
      );
      return {
        ...survey,
        responseCount: responses.length,
      };
    }),
  );

  return <OrganizerSurveyList surveys={surveysWithCounts} />;
}
