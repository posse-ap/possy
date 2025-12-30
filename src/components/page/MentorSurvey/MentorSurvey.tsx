"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";
import { MentorResponseForm } from "@/components/model/mentorResponse/MentorResponseForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type MentorSurveyProps = {
	surveyId: string;
	surveyTitle?: string;
	surveyDescription?: string;
};

export function MentorSurvey({
	surveyId,
	surveyTitle = "メンター日程アンケート",
	surveyDescription = "参加可能な日時を選択してください。開始時刻から2時間単位で自動計算されます。",
}: MentorSurveyProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: MentorResponseInput) => {
		setIsSubmitting(true);
		try {
			console.log("Survey ID:", surveyId);
			console.log("Response Data:", data);

			// TODO: API呼び出しをここに実装
			// await submitMentorResponse(surveyId, data);

			// 成功時に完了画面へ遷移
			await new Promise((resolve) => setTimeout(resolve, 1000));
			router.push(`/mentor/${surveyId}/done`);
		} catch (error) {
			console.error("送信エラー:", error);
			alert("送信に失敗しました。もう一度お試しください。");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="mx-auto max-w-3xl space-y-6">
				<Card className="border-2">
					<CardHeader>
						<CardTitle className="text-3xl">{surveyTitle}</CardTitle>
						<CardDescription className="text-base">
							{surveyDescription}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
							<p>
								各スロットは2時間単位です
								<br />
								開始時刻を選択すると、終了時刻が自動で計算されます
								<br />
								複数の日時を選択できます
							</p>
						</div>
					</CardContent>
				</Card>

				<MentorResponseForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
			</div>
		</div>
	);
}
