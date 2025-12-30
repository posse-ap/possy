import type { Survey, SurveyInput } from "@/models/survey/survey";
import { surveyRepository } from "@/repositories/persistence";
import { sheetsRepository } from "@/repositories/googleSheets";

type CreateSurveyResult = {
  success: boolean;
  message?: string;
  survey?: Survey;
};

export async function createSurvey(
  input: SurveyInput,
  accessToken?: string,
): Promise<CreateSurveyResult> {
  try {
    // 1. バリデーション
    if (!input.title || !input.startDate || !input.endDate) {
      return {
        success: false,
        message: "必須項目が入力されていません",
      };
    }

    if (new Date(input.startDate) > new Date(input.endDate)) {
      return {
        success: false,
        message: "開始日は終了日より前である必要があります",
      };
    }

    // 2. DB保存
    const survey = await surveyRepository.create(input);

    if (!survey) {
      return {
        success: false,
        message: "アンケートの作成に失敗しました",
      };
    }

    // 3. Google Sheetsにシートを準備（アクセストークンがある場合のみ）
    if (accessToken) {
      const spreadsheetId = extractSpreadsheetId(input.spreadsheetUrl);
      if (spreadsheetId) {
        try {
          await sheetsRepository.ensureSheetExists(
            spreadsheetId,
            "回答データ",
            accessToken,
          );
        } catch (error) {
          console.warn("Google Sheetsの準備に失敗しました:", error);
          // シート準備失敗は警告のみ（DB作成は成功しているため）
        }
      }
    }

    return {
      success: true,
      message: "アンケートを作成しました",
      survey,
    };
  } catch (error) {
    console.error("Error creating survey:", error);
    return {
      success: false,
      message: "アンケートの作成中にエラーが発生しました",
    };
  }
}

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
