import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SurveyInput } from "@/models/survey/survey";
import { createSurvey } from "./createSurvey";

vi.mock("@/repositories/persistence/surveyRepository");

const { surveyRepository } = await import(
	"@/repositories/persistence/surveyRepository"
);

describe("createSurvey", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("正常系: アンケートが作成される", async () => {
		const input: SurveyInput = {
			title: "新歓メンター日程調整",
			description: "2024年度新歓メンター日程調整アンケート",
			startDate: "2024-10-01",
			endDate: "2024-10-31",
			spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit",
		};

		const expectedSurvey = {
			id: "survey-1",
			...input,
			createdAt: "2024-10-01T00:00:00Z",
		};

		vi.mocked(surveyRepository.create).mockResolvedValue(expectedSurvey);

		const result = await createSurvey(input);

		expect(result.success).toBe(true);
		expect(result.survey).toEqual(expectedSurvey);
		expect(result.message).toBe("アンケートを作成しました");
		expect(surveyRepository.create).toHaveBeenCalledWith(input);
	});

	it("バリデーションエラー: タイトルが空", async () => {
		const input: SurveyInput = {
			title: "",
			description: "テスト",
			startDate: "2024-10-01",
			endDate: "2024-10-31",
			spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit",
		};

		const result = await createSurvey(input);

		expect(result.success).toBe(false);
		expect(result.message).toBe("必須項目が入力されていません");
		expect(surveyRepository.create).not.toHaveBeenCalled();
	});

	it("バリデーションエラー: 開始日が終了日より後", async () => {
		const input: SurveyInput = {
			title: "テストアンケート",
			description: "テスト",
			startDate: "2024-10-31",
			endDate: "2024-10-01",
			spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit",
		};

		const result = await createSurvey(input);

		expect(result.success).toBe(false);
		expect(result.message).toBe("開始日は終了日より前である必要があります");
		expect(surveyRepository.create).not.toHaveBeenCalled();
	});

	it("DB保存失敗", async () => {
		const input: SurveyInput = {
			title: "テストアンケート",
			description: "テスト",
			startDate: "2024-10-01",
			endDate: "2024-10-31",
			spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit",
		};

		vi.mocked(surveyRepository.create).mockResolvedValue(null);

		const result = await createSurvey(input);

		expect(result.success).toBe(false);
		expect(result.message).toBe("アンケートの作成に失敗しました");
	});

	it("例外発生時のエラーハンドリング", async () => {
		const input: SurveyInput = {
			title: "テストアンケート",
			description: "テスト",
			startDate: "2024-10-01",
			endDate: "2024-10-31",
			spreadsheetUrl: "https://docs.google.com/spreadsheets/d/abc123/edit",
		};

		vi.mocked(surveyRepository.create).mockRejectedValue(new Error("DB Error"));

		const result = await createSurvey(input);

		expect(result.success).toBe(false);
		expect(result.message).toBe("アンケートの作成中にエラーが発生しました");
	});
});
