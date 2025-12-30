import { getSheetsClient } from "@/libs/googleApi";
import type { Slot } from "@/models/slot/slot";

type SpreadsheetRow = {
  mentorName: string;
  date: string;
  startTime: string;
  endTime: string;
  submittedAt: string;
};

export const sheetsRepository = {
  /**
   * メンター回答をスプレッドシートに追加
   * @param spreadsheetId - スプレッドシートID
   * @param mentorName - メンター名
   * @param slots - スロット配列
   * @param submittedAt - 送信日時
   * @param accessToken - Google OAuth2アクセストークン
   */
  async appendMentorResponseRows(
    spreadsheetId: string,
    mentorName: string,
    slots: Slot[],
    submittedAt: string,
    accessToken: string,
  ): Promise<boolean> {
    try {
      const sheets = getSheetsClient(accessToken);

      // データ行を作成
      const rows = slots.map((slot) => [
        mentorName,
        slot.date,
        slot.startTime,
        slot.endTime,
        submittedAt,
      ]);

      // スプレッドシートに追加
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `A:E`,
        valueInputOption: "RAW",
        requestBody: {
          values: rows,
        },
      });

      console.log(
        `Successfully appended ${rows.length} rows to spreadsheet ${spreadsheetId}`,
      );
      return true;
    } catch (error) {
      console.error("Error appending to spreadsheet:", error);
      return false;
    }
  },

  /**
   * スプレッドシートからメンター回答を取得
   * @param spreadsheetId - スプレッドシートID
   * @param accessToken - Google OAuth2アクセストークン
   */
  async getMentorResponseRows(
    spreadsheetId: string,
    accessToken: string,
  ): Promise<SpreadsheetRow[]> {
    try {
      const sheets = getSheetsClient(accessToken);
      const sheetName = "回答データ";

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:E`, // ヘッダー行をスキップ
      });

      const rows = response.data.values || [];

      return rows.map((row) => ({
        mentorName: row[0] || "",
        date: row[1] || "",
        startTime: row[2] || "",
        endTime: row[3] || "",
        submittedAt: row[4] || "",
      }));
    } catch (error) {
      console.error("Error reading from spreadsheet:", error);
      return [];
    }
  },

};
