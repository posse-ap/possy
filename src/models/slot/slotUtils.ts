import type { Slot } from "@/models/slot/slot";

// すべてのスロットを日時順にソートして、重複を除いた配列を返す
export function getAllUniqueSlotsFromResponses(
  responses: Array<{ slots: Slot[] }>,
): Slot[] {
  const allSlots: Slot[] = [];

  // すべての回答からスロットを収集
  for (const response of responses) {
    allSlots.push(...response.slots);
  }

  // 重複を除去（date + startTime + endTime で一意性判定）
  const uniqueSlotsMap = new Map<string, Slot>();
  for (const slot of allSlots) {
    const key = `${slot.date}-${slot.startTime}-${slot.endTime}`;
    if (!uniqueSlotsMap.has(key)) {
      uniqueSlotsMap.set(key, slot);
    }
  }

  // 日時順にソート
  const uniqueSlots = Array.from(uniqueSlotsMap.values()).sort((a, b) => {
    // まず日付でソート
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    // 同じ日付なら開始時刻でソート
    return a.startTime.localeCompare(b.startTime);
  });

  return uniqueSlots;
}

// スロットをGoogleフォーム用のテキストに変換（改行区切り）
export function formatSlotsForGoogleForm(slots: Slot[]): string {
  return slots
    .map((slot) => {
      const date = new Date(slot.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
      const weekday = weekdays[date.getDay()];

      return `${month}/${day}(${weekday}) ${slot.startTime}-${slot.endTime}`;
    })
    .join("\n");
}

// クリップボードにコピー
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("クリップボードへのコピーに失敗:", error);
    return false;
  }
}
