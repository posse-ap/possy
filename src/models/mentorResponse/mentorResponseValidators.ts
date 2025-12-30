import { z } from "zod";

export const mentorResponseSchema = z.object({
	mentorName: z
		.string()
		.min(1, "名前を入力してください")
		.max(50, "名前は50文字以内で入力してください"),
});

export type MentorResponseFormData = z.infer<typeof mentorResponseSchema>;

// スロットのバリデーション（将来的に実装）
export function validateNoOverlap(slots: { date: string; startTime: string; endTime: string }[]): boolean {
	// TODO: 同一日での時間重複チェック
	return true;
}
