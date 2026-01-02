import { getSheetsClient } from "@/libs/googleApi";
import type { Slot } from "@/models/slot/slot";
import { formatSlotsForDisplay } from "@/models/slot/slotFormat";
import type { AvailableCapacity, Generation, Posse } from "@/types/posse";

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
    sheetId: number,
    mentorName: string,
    slots: Slot[],
    email: string,
    posse: Posse,
    generation: Generation,
    university: string,
    availableCapacity: AvailableCapacity,
    submittedAt: string,
    accessToken: string,
  ): Promise<boolean> {
    try {
      const sheets = getSheetsClient(accessToken);

      // データを書き込むシートが存在しないということは、新歓担当がメンター用アンケートを作成したときに登録したシートを消したりしている可能性がある
      // それは回答者であるメンターにはどうすることもできないので、エラーとして扱いログを残す
      if (sheets === null) {
        throw new Error(
          "回答を書き込むシートが存在しませんでした、新歓担当に連絡してください",
        );
      }

      // データ行を作成
      const row =  [
        mentorName,
        email,
        posse,
        university,
        generation,
        availableCapacity,
        formatSlotsForDisplay(slots),
        submittedAt,
      ];;

      // シート名を取得
      const sheetName = await this.getSheetNameById(
        spreadsheetId,
        sheetId,
        accessToken,
      );

      // スプレッドシートに追加
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A2:H`,
        valueInputOption: "RAW",
        requestBody: {
          values: [row],
        },
      });

      console.log(
        `Successfully appended ${row.length} rows to spreadsheet ${spreadsheetId}`,
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

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `A2:E`, // ヘッダー行をスキップ
      });

      const rows = response.data.values || [];

      return rows.map((row) => ({
        submittedAt: row[0] || "",
        email: row[1] || "",
        mentorName: row[2] || "",
        generation: row[3] || "",
        posse: row[4] || "",
        university: row[5] || "",
        availableCapacity: row[6] || "",
        date: row[7] || "",
        startTime: row[8] || "",
        endTime: row[9] || "",
      }));
    } catch (error) {
      console.error("Error reading from spreadsheet:", error);
      return [];
    }
  },

  /**
   * スプレッドシートの情報からシート名を取得
   * @param spreadsheetId - スプレッドシートID
   * @param sheetId - シートID
   * @param accessToken - Google OAuth2アクセストークン
   * @returns シート名、存在しない場合はnull
   */
  async getSheetNameById(
    spreadsheetId: string,
    sheetId: number,
    accessToken: string,
  ): Promise<string | null> {
    try {
      const sheets = getSheetsClient(accessToken);

      const response = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      const sheet = response.data.sheets?.find(
        (s) => s.properties?.sheetId === sheetId,
      );

      return sheet?.properties?.title || null;
    } catch (error) {
      console.error("Error getting sheet name by ID:", error);
      return null;
    }
  },
};
