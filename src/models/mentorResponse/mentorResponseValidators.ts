import { z } from "zod";
import type { Slot } from "@/models/slot/slot";

export const mentorResponseSchema = z.object({
  mentorName: z
    .string()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  university: z
    .string()
    .min(1, "大学名を入力してください")
    .max(100, "大学名は100文字以内で入力してください"),
  posse: z.enum(["①", "②", "③"], {
    required_error: "POSSEを選択してください",
  }),
  generation: z.enum(["3期生", "4期生", "5期生", "6期生"], {
    required_error: "期生を選択してください",
  }),
  availableCapacity: z.enum(["1チームならできます", "2〜3チームならできます", "3チーム以上できます"], {
    required_error: "対応可能なチーム数を選択してください",
  }),
});

export type MentorResponseFormData = z.infer<typeof mentorResponseSchema>;

// 時間を分に変換
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// 2つのスロットが重複しているかチェック
function slotsOverlap(slot1: Slot, slot2: Slot): boolean {
  // 日付が違う場合は重複なし
  if (slot1.date !== slot2.date) return false;

  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);

  // 重複チェック: slot1の終了時刻 > slot2の開始時刻 && slot1の開始時刻 < slot2の終了時刻
  return end1 > start2 && start1 < end2;
}

// スロットのバリデーション
export function validateNoOverlap(slots: Slot[]): {
  isValid: boolean;
  message?: string;
} {
  if (slots.length === 0) {
    return {
      isValid: false,
      message: "少なくとも1つのスロットを追加してください",
    };
  }

  // すべてのスロットのペアをチェック
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (slotsOverlap(slots[i], slots[j])) {
        const slot1 = slots[i];
        const slot2 = slots[j];
        const date = new Date(slot1.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return {
          isValid: false,
          message: `${month}/${day} ${slot1.startTime}-${slot1.endTime} と ${slot2.startTime}-${slot2.endTime} が重複しています`,
        };
      }
    }
  }

  return { isValid: true };
}

// 新しいスロットが既存のスロットと重複するかチェック
export function checkNewSlotOverlap(
  newSlot: Omit<Slot, "id">,
  existingSlots: Slot[],
): { hasOverlap: boolean; message?: string } {
  for (const existingSlot of existingSlots) {
    if (existingSlot.date !== newSlot.date) continue;

    const newStart = timeToMinutes(newSlot.startTime);
    const newEnd = timeToMinutes(newSlot.endTime);
    const existStart = timeToMinutes(existingSlot.startTime);
    const existEnd = timeToMinutes(existingSlot.endTime);

    if (newEnd > existStart && newStart < existEnd) {
      const date = new Date(newSlot.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return {
        hasOverlap: true,
        message: `${month}/${day} ${existingSlot.startTime}-${existingSlot.endTime} と重複しています`,
      };
    }
  }

  return { hasOverlap: false };
}
