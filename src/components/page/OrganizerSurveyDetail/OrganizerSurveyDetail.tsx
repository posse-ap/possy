"use client";

import { ArrowLeft, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MentorResponseTable } from "@/components/model/mentorResponse/MentorResponseTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { dummyMentorResponses } from "@/models/mentorResponse/dummyResponses";
import {
  copyToClipboard,
  formatSlotsForGoogleForm,
  getAllUniqueSlotsFromResponses,
} from "@/models/slot/slotUtils";
import type { Survey } from "@/models/survey/survey";

type OrganizerSurveyDetailProps = {
  survey: Survey;
};

export function OrganizerSurveyDetail({ survey }: OrganizerSurveyDetailProps) {
  const [copied, setCopied] = useState(false);

  // このアンケートの回答を取得
  const responses = dummyMentorResponses.filter(
    (r) => r.surveyId === survey.id,
  );

  // すべてのスロットを昇順で取得
  const allSlots = getAllUniqueSlotsFromResponses(responses);
  const googleFormText = formatSlotsForGoogleForm(allSlots);

  const handleCopy = async () => {
    const success = await copyToClipboard(googleFormText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mentorUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/mentor/${survey.id}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/organizer">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              一覧に戻る
            </Button>
          </Link>
        </div>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">{survey.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {survey.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {responses.length}件の回答
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">期間</p>
                <p className="text-sm text-gray-600">
                  {new Date(survey.startDate).toLocaleDateString("ja-JP")} -{" "}
                  {new Date(survey.endDate).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  スプレッドシート
                </p>
                <a
                  href={survey.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  リンクを開く
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">メンター用URL</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mentorUrl}
                  readOnly
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(mentorUrl)}
                  className="cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                  コピー
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>参加者用日程リスト（Googleフォーム用）</CardTitle>
            <CardDescription>
              以下のテキストをコピーして、Googleフォームのチェックボックスに一括ペーストできます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {googleFormText || "まだ回答がありません"}
              </pre>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCopy}
                disabled={allSlots.length === 0}
                className="flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    コピーしました！
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    クリップボードにコピー
                  </>
                )}
              </Button>
              <Badge variant="outline">
                {allSlots.length}件のスロット（重複除外・昇順）
              </Badge>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">使い方</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>上のボタンでコピー</li>
                <li>Googleフォームのチェックボックス項目を開く</li>
                <li>「オプションを追加」の欄に貼り付け</li>
                <li>自動で改行区切りで項目が追加されます</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>メンター回答一覧</CardTitle>
            <CardDescription>
              メンター名をクリックしてソート順を変更できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MentorResponseTable responses={responses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
