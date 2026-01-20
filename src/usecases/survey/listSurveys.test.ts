import { describe, it, expect, vi, beforeEach } from "vitest";
import { listSurveys } from "./listSurveys";

vi.mock("@/repositories/persistence/surveyRepository");

const { surveyRepository } = await import(
	"@/repositories/persistence/surveyRepository"
);

describe("listSurveys", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("アンケート一覧を取得できる", async () => {
		const mockSurveys = [
			{
				id: "survey-1",
				title: "アンケート1",
				description: "説明1",
				startDate: "2024-10-01",
				endDate: "2024-10-31",
				spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit",
				createdAt: "2024-10-01T00:00:00Z",
			},
			{
				id: "survey-2",
				title: "アンケート2",
				description: "説明2",
				startDate: "2024-11-01",
				endDate: "2024-11-30",
				spreadsheetUrl: "https://docs.google.com/spreadsheets/d/def456/edit",
				createdAt: "2024-11-01T00:00:00Z",
			},
		];

		vi.mocked(surveyRepository.findAll).mockResolvedValue(mockSurveys);

		const result = await listSurveys();

		expect(result).toEqual(mockSurveys);
		expect(result).toHaveLength(2);
		expect(surveyRepository.findAll).toHaveBeenCalled();
	});

	it("アンケートがない場合は空配列を返す", async () => {
		vi.mocked(surveyRepository.findAll).mockResolvedValue([]);

		const result = await listSurveys();

		expect(result).toEqual([]);
		expect(surveyRepository.findAll).toHaveBeenCalled();
	});
});
