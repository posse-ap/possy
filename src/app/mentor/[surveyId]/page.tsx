import { MentorSurvey } from "@/components/page/MentorSurvey";

type PageProps = {
	params: Promise<{
		surveyId: string;
	}>;
};

export default async function MentorSurveyPage({ params }: PageProps) {
	const { surveyId } = await params;

	return (
		<MentorSurvey
			surveyId={surveyId}
			surveyTitle="メンター日程アンケート"
			surveyDescription="参加可能な日時を選択してください。開始時刻から2時間単位で自動計算されます。"
		/>
	);
}
