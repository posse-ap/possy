import type { Slot } from "@/models/slot/slot";

type SpreadsheetRow = {
  mentorName: string;
  date: string;
  startTime: string;
  endTime: string;
  submittedAt: string;
};

export const sheetsRepository = {
  async appendMentorResponseRows(
    spreadsheetId: string,
    mentorName: string,
    slots: Slot[],
    submittedAt: string,
  ): Promise<boolean> {
    try {
      const rows: SpreadsheetRow[] = slots.map((slot) => ({
        mentorName,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        submittedAt,
      }));

      // TODO: Google Sheets API呼び出し実装
      // 現時点ではログのみ
      console.log("Appending to spreadsheet:", spreadsheetId);
      console.log("Rows:", rows);

      // Google Sheets API を使用してデータを追加
      // const response = await fetch(...);

      return true;
    } catch (error) {
      console.error("Error appending to spreadsheet:", error);
      return false;
    }
  },

  async clearAndWriteRows(
    spreadsheetId: string,
    rows: SpreadsheetRow[],
  ): Promise<boolean> {
    try {
      console.log("Clearing and writing to spreadsheet:", spreadsheetId);
      console.log("Rows count:", rows.length);

      // TODO: Google Sheets API呼び出し実装

      return true;
    } catch (error) {
      console.error("Error writing to spreadsheet:", error);
      return false;
    }
  },
};
