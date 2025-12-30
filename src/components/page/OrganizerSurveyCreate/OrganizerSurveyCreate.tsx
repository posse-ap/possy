"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SurveyCreateForm } from "@/components/model/survey/SurveyCreateForm";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { SurveyInput } from "@/models/survey/survey";

export function OrganizerSurveyCreate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: SurveyInput) => {
    setIsSubmitting(true);
    try {
      console.log("Creating survey:", data);

      // TODO: API呼び出しをここに実装
      // const newSurvey = await createSurvey(data);

      // 成功時に一覧画面へ遷移
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/organizer");
    } catch (error) {
      console.error("作成エラー:", error);
      alert("作成に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/organizer");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
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
            <CardTitle className="text-3xl">新規アンケート作成</CardTitle>
            <CardDescription className="text-base">
              メンター日程調整アンケートを作成します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyCreateForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
