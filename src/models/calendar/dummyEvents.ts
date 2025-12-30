import type { CalendarEvent } from "@/models/calendar/calendarEvent";

// 現在の週の日付を取得する関数
function getCurrentWeekDate(dayOffset: number): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 月曜日を週の開始に
  const monday = new Date(today.setDate(diff));
  const targetDate = new Date(monday);
  targetDate.setDate(monday.getDate() + dayOffset);
  return targetDate.toISOString().split("T")[0];
}

// ダミーのGoogleカレンダーイベント（今週の日付で生成）
export const dummyGoogleEvents: CalendarEvent[] = [
  {
    id: "g1",
    title: "チーム会議",
    date: getCurrentWeekDate(0), // 月曜日
    startTime: "10:00",
    endTime: "11:00",
    color: "#4285F4",
    isGoogleEvent: true,
  },
  {
    id: "g2",
    title: "ランチミーティング",
    date: getCurrentWeekDate(0), // 月曜日
    startTime: "12:00",
    endTime: "13:00",
    color: "#4285F4",
    isGoogleEvent: true,
  },
  {
    id: "g3",
    title: "プロジェクトレビュー",
    date: getCurrentWeekDate(1), // 火曜日
    startTime: "14:00",
    endTime: "16:00",
    color: "#4285F4",
    isGoogleEvent: true,
  },
  {
    id: "g4",
    title: "1on1",
    date: getCurrentWeekDate(2), // 水曜日
    startTime: "15:00",
    endTime: "16:00",
    color: "#4285F4",
    isGoogleEvent: true,
  },
  {
    id: "g5",
    title: "技術勉強会",
    date: getCurrentWeekDate(3), // 木曜日
    startTime: "18:00",
    endTime: "20:00",
    color: "#4285F4",
    isGoogleEvent: true,
  },
  {
    id: "g6",
    title: "スプリントプランニング",
    date: getCurrentWeekDate(4), // 金曜日
    startTime: "10:00",
    endTime: "12:00",
    color: "#4285F4",
    isGoogleEvent: true,
  },
];
