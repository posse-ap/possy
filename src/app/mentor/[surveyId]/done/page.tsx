import { MentorSurveyDone } from "@/components/page/MentorSurveyDone";

type PageProps = {
	params: Promise<{
		surveyId: string;
	}>;
};

export default async function MentorSurveyDonePage({ params }: PageProps) {
	const { surveyId } = await params;

	return <MentorSurveyDone surveyId={surveyId} />;
}
