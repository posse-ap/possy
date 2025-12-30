"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

type MentorSurveyDoneProps = {
	surveyId: string;
};

export function MentorSurveyDone({ surveyId }: MentorSurveyDoneProps) {
	return (
		<div className="min-h-screen bg-gray-50 py-16 px-4">
			<div className="mx-auto max-w-2xl">
				<Card className="border-2 text-center">
					<CardHeader className="space-y-4 pb-4">
						<div className="flex justify-center">
							<div className="rounded-full bg-black p-3">
								<CheckCircle2 className="h-12 w-12 text-white" />
							</div>
						</div>
						<CardTitle className="text-3xl">回答が完了しました</CardTitle>
						<CardDescription className="text-base">
							ご協力ありがとうございました
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6 pb-8">
						<div className="rounded-lg bg-gray-50 p-6 text-left">
							<h3 className="font-semibold mb-3">次のステップ</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li>✓ 入力された日時がGoogleカレンダーに仮押さえされました</li>
								<li>✓ スプレッドシートにデータが反映されました</li>
								<li>✓ 運営から正式な日程確定の連絡をお待ちください</li>
							</ul>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
							<Link href={`/mentor/${surveyId}`}>
								<Button variant="primary">回答を編集</Button>
							</Link>
							<Link href="/">
								<Button variant="outline">ホームへ戻る</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
