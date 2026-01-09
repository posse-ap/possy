"use client";

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
import {
  copyToClipboard,
  formatSlotsForGoogleForm,
  getAllUniqueSlotsFromResponses,
} from "@/models/slot/slotUtils";
import type { Survey } from "@/models/survey/survey";
import type { MentorResponseWithSlots } from "@/usecases/mentorResponse";
import { ArrowLeft, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type OrganizerSurveyDetailProps = {
  survey: Survey;
  responses: MentorResponseWithSlots[];
};

export function OrganizerSurveyDetail({
  survey,
  responses,
}: OrganizerSurveyDetailProps) {
  const [copiedTarget, setCopiedTarget] = useState<"mentor" | "slots" | null>(
    null,
  );

  // すべてのスロットを昇順で取得
  const allSlots = getAllUniqueSlotsFromResponses(responses);
  const googleFormText = formatSlotsForGoogleForm(allSlots);

  const handleCopy = async (text: string, target: "mentor" | "slots") => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget(null), 2000);
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
                  variant="link"
                  size="icon"
                  className="cursor-pointer border-0"
                  onClick={() => window.open(mentorUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>参加者用日程リスト（Googleフォーム用）</CardTitle>
            <CardDescription className="flex items-center gap-2 justify-between">
              以下のテキストをコピーして、参加者募集用のGoogleフォームのチェックボックスに一括ペーストできます
              <Badge variant="outline">{allSlots.length}件の候補（昇順）</Badge>
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
                variant="outline"
                size="lg"
                onClick={() => handleCopy(googleFormText, "slots")}
                disabled={allSlots.length === 0}
                className="flex items-center gap-2 cursor-pointer border-0"
              >
                {copiedTarget === "slots" ? (
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
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex gap-2 flex-row items-center justify-between">
            <CardTitle>メンター回答一覧</CardTitle>
            <CardDescription>
              <a
                href={survey.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                該当のスプレッドシートのリンクを開く
                <ExternalLink className="h-3 w-3" />
              </a>
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
