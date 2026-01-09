import type { Slot } from "@/models/slot/slot";
import { sheetsRepository } from "@/repositories/googleSheets";
import { mentorResponseRepository } from "@/repositories/persistence";

export type MentorResponseWithSlots = {
  id: string;
  surveyId: string;
  mentorName: string;
  slots: Slot[];
  createdAt: string;
  submittedAt: string;
};

export async function listMentorResponses(
  surveyId: string,
  spreadsheetId?: string,
  accessToken?: string,
): Promise<MentorResponseWithSlots[]> {
  const responses = await mentorResponseRepository.findBySurveyId(surveyId);

  // DBから直接スロット情報も取得（JONBカラム）
  const responsesWithSlots = responses.map((response) => ({
    id: response.id,
    surveyId: response.survey_id,
    mentorName: response.mentor_name,
    slots: response.slots,
    createdAt: response.submitted_at,
    submittedAt: response.submitted_at,
  }));

  // Google Sheetsからもデータ取得を試みる（バックアップ確認用・オプション）
  if (accessToken && spreadsheetId) {
    try {
      const sheetRows = await sheetsRepository.getMentorResponseRows(
        spreadsheetId,
        accessToken,
      );

      // Sheetsのデータがあることをログに記録（データ整合性確認用）
      if (sheetRows.length > 0) {
        console.info(
          `Google Sheetsに${sheetRows.length}行のバックアップデータがあります`,
        );
      }
    } catch (error) {
      console.warn(
        "Google Sheetsからのデータ取得に失敗（バックアップ）:",
        error,
      );
    }
  }

  return responsesWithSlots;
}
