import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSurvey } from "./getSurvey";

vi.mock("@/libs/supabaseClient");
vi.mock("@/libs/supabaseServer");
vi.mock("@/repositories/persistence/surveyRepository");

const { surveyRepository } = await import(
  "@/repositories/persistence/surveyRepository"
);

describe("getSurvey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("アンケートが見つかった場合", async () => {
    const mockSurvey = {
      id: "survey-1",
      title: "テストアンケート",
      description: "説明",
      startDate: "2024-10-01",
      endDate: "2024-10-31",
      spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit",
      createdAt: "2024-10-01T00:00:00Z",
    };

    vi.mocked(surveyRepository.findById).mockResolvedValue(mockSurvey);

    const result = await getSurvey("survey-1");

    expect(result).toEqual(mockSurvey);
    expect(surveyRepository.findById).toHaveBeenCalledWith("survey-1");
  });

  it("アンケートが見つからない場合", async () => {
    vi.mocked(surveyRepository.findById).mockResolvedValue(null);

    const result = await getSurvey("non-existent-id");

    expect(result).toBeNull();
    expect(surveyRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
