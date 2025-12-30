import type { MentorResponse } from "@/models/mentorResponse/mentorResponse";

// ダミーのメンター回答データ
export const dummyMentorResponses: MentorResponse[] = [
  {
    id: "r1",
    surveyId: "test-survey-123",
    mentorName: "山田 太郎",
    slots: [
      {
        id: "s1",
        date: "2025-01-06",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "s2",
        date: "2025-01-07",
        startTime: "14:00",
        endTime: "16:00",
      },
      {
        id: "s3",
        date: "2025-01-08",
        startTime: "10:00",
        endTime: "12:00",
      },
    ],
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "r2",
    surveyId: "test-survey-123",
    mentorName: "佐藤 花子",
    slots: [
      {
        id: "s4",
        date: "2025-01-06",
        startTime: "14:00",
        endTime: "16:00",
      },
      {
        id: "s5",
        date: "2025-01-07",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "s6",
        date: "2025-01-09",
        startTime: "16:00",
        endTime: "18:00",
      },
    ],
    createdAt: "2025-01-01T11:30:00Z",
  },
  {
    id: "r3",
    surveyId: "test-survey-123",
    mentorName: "鈴木 次郎",
    slots: [
      {
        id: "s7",
        date: "2025-01-06",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "s8",
        date: "2025-01-08",
        startTime: "14:00",
        endTime: "16:00",
      },
      {
        id: "s9",
        date: "2025-01-10",
        startTime: "10:00",
        endTime: "12:00",
      },
    ],
    createdAt: "2025-01-02T09:00:00Z",
  },
];
