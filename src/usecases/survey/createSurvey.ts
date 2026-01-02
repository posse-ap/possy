import type { Survey, SurveyInput } from "@/models/survey/survey";
import { surveyRepository } from "@/repositories/persistence";

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
