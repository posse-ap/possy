import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Slot } from "@/models/slot/slot";
import { listMentorResponses } from "./listMentorResponses";

vi.mock("@/libs/supabaseClient");
vi.mock("@/libs/supabaseServer");
vi.mock("@/repositories/persistence/mentorResponseRepository");
vi.mock("@/libs/supabaseClient");
vi.mock("@/libs/supabaseServer");
vi.mock("@/repositories/googleSheets/sheetsRepository");

const { mentorResponseRepository } = await import(
  "@/repositories/persistence/mentorResponseRepository"
);
const { sheetsRepository } = await import(
  "@/repositories/googleSheets/sheetsRepository"
);

describe("listMentorResponses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSlots: Slot[] = [
    {
      id: "slot-1",
      date: "2024-10-15",
      startTime: "10:00",
      endTime: "12:00",
    },
    {
      id: "slot-2",
      date: "2024-10-16",
      startTime: "14:00",
      endTime: "16:00",
    },
  ];

  it("メンター回答一覧を取得できる", async () => {
    const mockResponses = [
      {
        id: "response-1",
        survey_id: "survey-1",
        mentor_name: "山田太郎",
        email: "yamada@example.com",
        posse: "①" as const,
        university: "東京大学",
        generation: "3期生" as const,
        available_capacity: "1チームならできます" as const,
        slots: mockSlots,
        submitted_at: "2024-10-01T00:00:00Z",
      },
      {
        id: "response-2",
        survey_id: "survey-1",
        mentor_name: "鈴木花子",
        email: "suzuki@example.com",
        posse: "②" as const,
        university: "早稲田大学",
        generation: "4期生" as const,
        available_capacity: "2〜3チームならできます" as const,
        slots: mockSlots,
        submitted_at: "2024-10-02T00:00:00Z",
      },
    ];

    vi.mocked(mentorResponseRepository.findBySurveyId).mockResolvedValue(
      mockResponses,
    );

    const result = await listMentorResponses("survey-1");

    expect(result).toHaveLength(2);
    expect(result[0].mentorName).toBe("山田太郎");
    expect(result[0].slots).toEqual(mockSlots);
    expect(result[1].mentorName).toBe("鈴木花子");
    expect(mentorResponseRepository.findBySurveyId).toHaveBeenCalledWith(
      "survey-1",
    );
  });

  it("回答がない場合は空配列を返す", async () => {
    vi.mocked(mentorResponseRepository.findBySurveyId).mockResolvedValue([]);

    const result = await listMentorResponses("survey-1");

    expect(result).toEqual([]);
    expect(mentorResponseRepository.findBySurveyId).toHaveBeenCalledWith(
      "survey-1",
    );
  });

  it("Google Sheetsからのバックアップ取得（オプション）", async () => {
    const mockResponses = [
      {
        id: "response-1",
        survey_id: "survey-1",
        mentor_name: "山田太郎",
        email: "yamada@example.com",
        posse: "①" as const,
        university: "東京大学",
        generation: "3期生" as const,
        available_capacity: "1チームならできます" as const,
        slots: mockSlots,
        submitted_at: "2024-10-01T00:00:00Z",
      },
    ];

    vi.mocked(mentorResponseRepository.findBySurveyId).mockResolvedValue(
      mockResponses,
    );
    vi.mocked(sheetsRepository.getMentorResponseRows).mockResolvedValue([
      {
        mentorName: "山田太郎",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
        submittedAt: "2024-10-01T00:00:00Z",
      },
    ]);

    const result = await listMentorResponses(
      "survey-1",
      "spreadsheet-id",
      "シート1",
      "access-token",
    );

    expect(result).toHaveLength(1);
    expect(sheetsRepository.getMentorResponseRows).toHaveBeenCalledWith(
      "spreadsheet-id",
      "シート1",
      "access-token",
    );
  });

  it("Google Sheetsの取得に失敗してもDBデータは返す", async () => {
    const mockResponses = [
      {
        id: "response-1",
        survey_id: "survey-1",
        mentor_name: "山田太郎",
        email: "yamada@example.com",
        posse: "①" as const,
        university: "東京大学",
        generation: "3期生" as const,
        available_capacity: "1チームならできます" as const,
        slots: mockSlots,
        submitted_at: "2024-10-01T00:00:00Z",
      },
    ];

    vi.mocked(mentorResponseRepository.findBySurveyId).mockResolvedValue(
      mockResponses,
    );
    vi.mocked(sheetsRepository.getMentorResponseRows).mockRejectedValue(
      new Error("Sheets API Error"),
    );

    const result = await listMentorResponses(
      "survey-1",
      "spreadsheet-id",
      "シート1",
      "access-token",
    );

    expect(result).toHaveLength(1);
    expect(result[0].mentorName).toBe("山田太郎");
  });
});
