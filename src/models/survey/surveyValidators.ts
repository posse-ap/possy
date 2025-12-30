import { z } from "zod";

export const surveyCreateSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルを入力してください")
      .max(100, "タイトルは100文字以内で入力してください"),
    description: z
      .string()
      .min(1, "説明を入力してください")
      .max(500, "説明は500文字以内で入力してください"),
    startDate: z.string().min(1, "開始日を入力してください"),
    endDate: z.string().min(1, "終了日を入力してください"),
    spreadsheetUrl: z
      .string()
      .url("有効なURLを入力してください")
      .min(1, "スプレッドシートURLを入力してください"),
  })
  .refine(
    (data) => {
      // 終了日が開始日より後であることを確認
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "終了日は開始日以降の日付を指定してください",
      path: ["endDate"],
    },
  );

export type SurveyCreateFormData = z.infer<typeof surveyCreateSchema>;
