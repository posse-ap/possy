"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { SurveyInput } from "@/models/survey/survey";
import {
  type SurveyCreateFormData,
  surveyCreateSchema,
} from "@/models/survey/surveyValidators";

type SurveyCreateFormProps = {
  onSubmit: (data: SurveyInput) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

export function SurveyCreateForm({
  onSubmit,
  isSubmitting = false,
  onCancel,
}: SurveyCreateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SurveyCreateFormData>({
    resolver: zodResolver(surveyCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      spreadsheetUrl: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>
            アンケートの基本的な情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              type="text"
              placeholder="例: 2025年新歓メンター日程調整"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明 *</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="例: 新歓イベントのメンター参加可能日程を教えてください"
              {...register("description")}
              className={`flex w-full rounded-lg border px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>期間設定</CardTitle>
          <CardDescription>
            アンケートの募集期間を設定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">開始日 *</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">終了日 *</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>スプレッドシート連携</CardTitle>
          <CardDescription>
            回答データを保存するスプレッドシートのURLを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spreadsheetUrl">スプレッドシートURL *</Label>
            <Input
              id="spreadsheetUrl"
              type="url"
              placeholder="https://docs.google.com/spreadsheets/d/xxxxx"
              {...register("spreadsheetUrl")}
              className={errors.spreadsheetUrl ? "border-red-500" : ""}
            />
            {errors.spreadsheetUrl && (
              <p className="text-sm text-red-500">
                {errors.spreadsheetUrl.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Googleスプレッドシートの共有URLを貼り付けてください
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <p className="text-sm text-blue-800 font-medium mb-2">作成後の動作</p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>アンケートが作成され、一覧に表示されます</li>
          <li>メンター用の回答URLが自動生成されます</li>
          <li>回答データが指定したスプレッドシートに保存されます</li>
        </ul>
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="cursor-pointer"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="min-w-[200px] cursor-pointer"
        >
          {isSubmitting ? "作成中..." : "アンケートを作成"}
        </Button>
      </div>
    </form>
  );
}
