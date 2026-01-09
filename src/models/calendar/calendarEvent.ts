export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color?: string;
  isGoogleEvent?: boolean; // Googleカレンダーから取得したイベント
};
