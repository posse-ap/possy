import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitMentorResponse } from "./submitMentorResponse";

vi.mock("@/libs/supabaseClient");
vi.mock("@/libs/supabaseServer");
vi.mock("@/repositories/persistence/surveyRepository");
vi.mock("@/repositories/persistence/mentorResponseRepository");
vi.mock("@/repositories/googleCalendar/calendarRepository");
vi.mock("@/repositories/googleSheets/sheetsRepository");

const { surveyRepository } = await import(
  "@/repositories/persistence/surveyRepository"
);
const { mentorResponseRepository } = await import(
  "@/repositories/persistence/mentorResponseRepository"
);
const { calendarRepository } = await import(
  "@/repositories/googleCalendar/calendarRepository"
);
const { sheetsRepository } = await import(
  "@/repositories/googleSheets/sheetsRepository"
);

describe("submitMentorResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSurvey = {
    id: "survey-1",
    title: "新歓メンター募集日程調整 1/10~1/17",
    description: "1/10~1/17の分を集めるフォームです",
    startDate: "2026-01-10",
    endDate: "2026-01-17",
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit#gid=0",
    createdAt: "2024-10-01T00:00:00Z",
  };

  const validInput: MentorResponseInput = {
    mentorName: "山田太郎",
    email: "yamada@example.com",
    posse: "①",
    university: "東京大学",
    generation: "3期生",
    availableCapacity: "1チームならできます",
    slots: [
      {
        id: "slot-1",
        date: "2026-01-12",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "slot-2",
        date: "2026-01-14",
        startTime: "14:00",
        endTime: "16:00",
      },
    ],
  };

  it("正常系: 回答が送信される（初回回答）", async () => {
    vi.mocked(surveyRepository.findById).mockResolvedValue(mockSurvey);
    vi.mocked(mentorResponseRepository.findBySurveyAndMentor).mockResolvedValue(
      null,
    );
    vi.mocked(mentorResponseRepository.upsert).mockResolvedValue({
      id: "response-1",
      survey_id: "survey-1",
      mentor_name: validInput.mentorName,
      email: validInput.email,
      posse: validInput.posse,
      university: validInput.university,
      generation: validInput.generation,
      available_capacity: validInput.availableCapacity,
      slots: validInput.slots,
      submitted_at: "2024-10-01T00:00:00Z",
    });
    vi.mocked(sheetsRepository.getSheetNameByGid).mockResolvedValue("シート1");
    vi.mocked(sheetsRepository.appendMentorResponseRows).mockResolvedValue(
      true,
    );
    vi.mocked(calendarRepository.createHoldEvent).mockResolvedValue("event-1");

    const result = await submitMentorResponse(
      "survey-1",
      validInput,
      "access-token",
    );

    expect(result.success).toBe(true);
    expect(result.message).toBe("回答を送信しました");
    expect(result.responseId).toBe("response-1");
    expect(surveyRepository.findById).toHaveBeenCalledWith("survey-1");
    expect(mentorResponseRepository.upsert).toHaveBeenCalled();
    expect(sheetsRepository.appendMentorResponseRows).toHaveBeenCalled();
    expect(calendarRepository.createHoldEvent).toHaveBeenCalledTimes(2);
  });

  it("正常系: 回答が更新される（再回答）", async () => {
    vi.mocked(surveyRepository.findById).mockResolvedValue(mockSurvey);
    vi.mocked(mentorResponseRepository.findBySurveyAndMentor).mockResolvedValue(
      {
        id: "response-1",
        survey_id: "survey-1",
        mentor_name: validInput.mentorName,
        email: validInput.email,
        posse: validInput.posse,
        university: validInput.university,
        generation: validInput.generation,
        available_capacity: validInput.availableCapacity,
        slots: [],
        submitted_at: "2024-10-01T00:00:00Z",
      },
    );
    vi.mocked(mentorResponseRepository.upsert).mockResolvedValue({
      id: "response-1",
      survey_id: "survey-1",
      mentor_name: validInput.mentorName,
      email: validInput.email,
      posse: validInput.posse,
      university: validInput.university,
      generation: validInput.generation,
      available_capacity: validInput.availableCapacity,
      slots: validInput.slots,
      submitted_at: "2024-10-01T00:00:00Z",
    });
    vi.mocked(sheetsRepository.getSheetNameByGid).mockResolvedValue("シート1");
    vi.mocked(sheetsRepository.appendMentorResponseRows).mockResolvedValue(
      true,
    );
    vi.mocked(calendarRepository.createHoldEvent).mockResolvedValue("event-1");

    const result = await submitMentorResponse(
      "survey-1",
      validInput,
      "access-token",
    );

    expect(result.success).toBe(true);
    expect(result.message).toBe("回答を更新しました");
  });

  it("バリデーションエラー: スロットが空", async () => {
    const input: MentorResponseInput = {
      ...validInput,
      slots: [],
    };

    const result = await submitMentorResponse("survey-1", input);

    expect(result.success).toBe(false);
    expect(result.message).toContain(
      "少なくとも1つのスロットを追加してください",
    );
    expect(surveyRepository.findById).not.toHaveBeenCalled();
  });

  it("バリデーションエラー: スロットが重複", async () => {
    const input: MentorResponseInput = {
      ...validInput,
      slots: [
        {
          id: "slot-1",
          date: "2024-10-15",
          startTime: "10:00",
          endTime: "12:00",
        },
        {
          id: "slot-2",
          date: "2024-10-15",
          startTime: "11:00",
          endTime: "13:00",
        },
      ],
    };

    const result = await submitMentorResponse("survey-1", input);

    expect(result.success).toBe(false);
    expect(result.message).toContain("重複しています");
  });

  it("エラー: アンケートが見つからない", async () => {
    vi.mocked(surveyRepository.findById).mockResolvedValue(null);

    const result = await submitMentorResponse("non-existent", validInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("アンケートが見つかりません");
  });

  it("エラー: DB保存失敗", async () => {
    vi.mocked(surveyRepository.findById).mockResolvedValue(mockSurvey);
    vi.mocked(mentorResponseRepository.findBySurveyAndMentor).mockResolvedValue(
      null,
    );
    vi.mocked(mentorResponseRepository.upsert).mockResolvedValue(null);

    const result = await submitMentorResponse("survey-1", validInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("回答の保存に失敗しました");
  });

  it("アクセストークンなしの場合はGoogle API連携をスキップ", async () => {
    vi.mocked(surveyRepository.findById).mockResolvedValue(mockSurvey);
    vi.mocked(mentorResponseRepository.findBySurveyAndMentor).mockResolvedValue(
      null,
    );
    vi.mocked(mentorResponseRepository.upsert).mockResolvedValue({
      id: "response-1",
      survey_id: "survey-1",
      mentor_name: validInput.mentorName,
      email: validInput.email,
      posse: validInput.posse,
      university: validInput.university,
      generation: validInput.generation,
      available_capacity: validInput.availableCapacity,
      slots: validInput.slots,
      submitted_at: "2024-10-01T00:00:00Z",
    });

    const result = await submitMentorResponse("survey-1", validInput);

    expect(result.success).toBe(true);
    expect(sheetsRepository.appendMentorResponseRows).not.toHaveBeenCalled();
    expect(calendarRepository.createHoldEvent).not.toHaveBeenCalled();
  });
});
