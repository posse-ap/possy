import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";
import { validateNoOverlap } from "@/models/mentorResponse/mentorResponseValidators";
import { calendarRepository } from "@/repositories/googleCalendar";
import { sheetsRepository } from "@/repositories/googleSheets";
import { mentorResponseRepository } from "@/repositories/persistence/mentorResponseRepository";
import { surveyRepository } from "@/repositories/persistence/surveyRepository";

type SubmitMentorResponseResult = {
  success: boolean;
  message?: string;
  responseId?: string;
};

export async function submitMentorResponse(
  surveyId: string,
  input: MentorResponseInput,
  accessToken?: string,
): Promise<SubmitMentorResponseResult> {
  try {
    // 1. バリデーション: スロットの重複チェック
    const validation = validateNoOverlap(input.slots);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message || "スロットが重複しています",
      };
    }

    // 2. Survey存在チェック
    const survey = await surveyRepository.findById(surveyId);
    if (!survey) {
      return {
        success: false,
        message: "アンケートが見つかりません",
      };
    }

    // 3. 重複回答チェック（既に回答済みか）
    const existingResponse =
      await mentorResponseRepository.findBySurveyAndMentor(
        surveyId,
        input.mentorName,
      );

    // 4. DB保存（upsert: 既存なら更新、なければ作成）スロット情報込み
    const savedResponse = await mentorResponseRepository.upsert(
      surveyId,
      {
        mentorName: input.mentorName,
        email: input.email,
        posse: input.posse,
        university: input.university,
        generation: input.generation,
        availableCapacity: input.availableCapacity,
        slots: input.slots,
      },
    );

    if (!savedResponse) {
      return {
        success: false,
        message: "回答の保存に失敗しました",
      };
    }

    // 5. Spreadsheet反映（バックアップ用・アクセストークンがある場合のみ）
    if (accessToken) {
      const spreadsheetId = extractSpreadsheetId(survey.spreadsheetUrl);
      if (spreadsheetId) {
        try {
          await sheetsRepository.appendMentorResponseRows(
            spreadsheetId,
            input.mentorName,
            input.slots,
            input.email,
            input.posse,
            input.generation,
            input.university,
            input.availableCapacity,
            savedResponse.submitted_at,
            accessToken,
          );
        } catch (error) {
          // sheetIdも欲しいので、エラーメッセージを加工して返す
          const errorMessage = `Spreadsheetへの書き込みに失敗しました sheetId: ${spreadsheetId} error: ${error instanceof Error ? error.message : error}`;
          return {
            success: false,
            message: errorMessage,
          };
        }
      }

      // 6. Googleカレンダーに仮押さえイベント作成
      for (const slot of input.slots) {
        const eventId = await calendarRepository.createHoldEvent(
          slot.date,
          slot.startTime,
          slot.endTime,
          `[仮押さえ] ${input.mentorName} - ${survey.title}`,
          accessToken,
        );

        if (!eventId) {
          console.warn(
            `カレンダーイベントの作成に失敗: ${slot.date} ${slot.startTime}-${slot.endTime}`,
          );
        }
      }
    } else {
      console.info(
        "アクセストークンがないため、Google API連携をスキップしました",
      );
    }

    return {
      success: true,
      message: existingResponse ? "回答を更新しました" : "回答を送信しました",
      responseId: savedResponse.id,
    };
  } catch (error) {
    console.error("Error submitting mentor response:", error);
    return {
      success: false,
      message: "回答の送信中にエラーが発生しました",
    };
  }
}

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
