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

      // ヘッダー行が存在するか確認し、なければ作成
      const sheetName = "回答データ";
      await this.ensureSheetExists(spreadsheetId, sheetName, accessToken);

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
        range: `${sheetName}!A:E`,
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

  /**
   * シートが存在することを確認し、なければ作成してヘッダーを設定
   */
  async ensureSheetExists(
    spreadsheetId: string,
    sheetName: string,
    accessToken: string,
  ): Promise<void> {
    try {
      const sheets = getSheetsClient(accessToken);

      // スプレッドシートのメタデータを取得
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      });

      // シートが存在するか確認
      const sheetExists = spreadsheet.data.sheets?.some(
        (sheet) => sheet.properties?.title === sheetName,
      );

      if (!sheetExists) {
        // シートを作成
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });

        // ヘッダー行を追加
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:E1`,
          valueInputOption: "RAW",
          requestBody: {
            values: [
              ["メンター名", "日付", "開始時刻", "終了時刻", "送信日時"],
            ],
          },
        });

        console.log(`Created sheet "${sheetName}" with headers`);
      }
    } catch (error) {
      console.error("Error ensuring sheet exists:", error);
      throw error;
    }
  },

  /**
   * スプレッドシートをクリアして新しいデータを書き込む
   */
  async clearAndWriteRows(
    spreadsheetId: string,
    rows: SpreadsheetRow[],
    accessToken: string,
  ): Promise<boolean> {
    try {
      const sheets = getSheetsClient(accessToken);
      const sheetName = "回答データ";

      await this.ensureSheetExists(spreadsheetId, sheetName, accessToken);

      // データをクリア（ヘッダーは残す）
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}!A2:E`,
      });

      // 新しいデータを書き込む
      if (rows.length > 0) {
        const values = rows.map((row) => [
          row.mentorName,
          row.date,
          row.startTime,
          row.endTime,
          row.submittedAt,
        ]);

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A2:E`,
          valueInputOption: "RAW",
          requestBody: {
            values,
          },
        });
      }

      console.log(`Successfully wrote ${rows.length} rows to spreadsheet`);
      return true;
    } catch (error) {
      console.error("Error writing to spreadsheet:", error);
      return false;
    }
  },
};
