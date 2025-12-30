import type { Survey } from "@/models/survey/survey";

// ダミーのアンケートデータ
export const dummySurveys: Survey[] = [
  {
    id: "test-survey-123",
    title: "2025年新歓メンター日程調整",
    description: "新歓イベントのメンター参加可能日程を教えてください",
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/xxxxx",
    createdAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "survey-456",
    title: "春季イベントメンター募集",
    description: "春季イベントのメンター参加可能日程調査",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/yyyyy",
    createdAt: "2024-12-25T15:00:00Z",
  },
];
