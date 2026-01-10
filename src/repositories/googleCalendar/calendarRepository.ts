import { getCalendarClient } from "@/libs/googleApi";
import type { CalendarEvent } from "@/models/calendar/calendarEvent";

export const calendarRepository = {
  /**
   * 指定期間のカレンダーイベントを取得
   * @param startDate - 開始日 (YYYY-MM-DD)
   * @param endDate - 終了日 (YYYY-MM-DD)
   * @param accessToken - Google OAuth2アクセストークン
   */
  async listEvents(
    startDate: string,
    endDate: string,
    accessToken: string,
    refreshToken?: string,
  ): Promise<CalendarEvent[]> {
    try {
      const calendar = getCalendarClient(accessToken, refreshToken);

      // 日付をJSTのISOString形式に変換
      const startDateTime = new Date(`${startDate}T00:00:00+09:00`);
      const endDateTime = new Date(`${endDate}T23:59:59+09:00`);

      console.log("Fetching calendar events:", {
        startDate,
        endDate,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      });

      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: startDateTime.toISOString(),
        timeMax: endDateTime.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        timeZone: "Asia/Tokyo",
      });

      const events = response.data.items || [];

      return events
        .filter((event) => event.start && event.end && event.eventType !== "workingLocation")
        .map((event) => {
          const startDateTime = event.start?.dateTime || event.start?.date || "";
          const endDateTime = event.end?.dateTime || event.end?.date || "";
          // ISO 8601形式から日付と時刻を抽出（JSTで処理）
          const startDate = new Date(startDateTime);
          const endDate = new Date(endDateTime);
          // UTCからJSTに変換
          const jstStart = new Date(startDate.getTime() + (9 * 60 * 60 * 1000));
          const jstEnd = new Date(endDate.getTime() + (9 * 60 * 60 * 1000));
          return {
            id: event.id || "",
            title: event.summary || "(タイトルなし)",
            date: startDate.toISOString().split("T")[0], // YYYY-MM-DD
            startTime: `${String(jstStart.getHours()).padStart(2, "0")}:${String(jstStart.getMinutes()).padStart(2, "0")}`, // HH:mm
            endTime: `${String(jstEnd.getHours()).padStart(2, "0")}:${String(jstEnd.getMinutes()).padStart(2, "0")}`, // HH:mm
            isGoogleEvent: true,
          };
        });
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      return [];
    }
  },

  /**
   * カレンダーに仮押さえイベントを作成
   * @param date - 日付 (YYYY-MM-DD)
   * @param startTime - 開始時刻 (HH:mm)
   * @param endTime - 終了時刻 (HH:mm)
   * @param title - イベントタイトル
   * @param accessToken - Google OAuth2アクセストークン
   * @returns イベントID
   */
  async createHoldEvent(
    date: string,
    startTime: string,
    endTime: string,
    title: string,
    accessToken: string,
  ): Promise<string | null> {
    try {
      const calendar = getCalendarClient(accessToken);

      const startDateTime = `${date}T${startTime}:00`;
      const endDateTime = `${date}T${endTime}:00`;

      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: title,
          description: "メンター日程調整による仮押さえ",
          start: {
            dateTime: startDateTime,
            timeZone: "Asia/Tokyo",
          },
          end: {
            dateTime: endDateTime,
            timeZone: "Asia/Tokyo",
          },
          colorId: "11", // 赤色（仮押さえを目立たせる）
          transparency: "transparent", // カレンダーで表示
        },
      });

      const eventId = response.data.id;
      console.log(`Created calendar event: ${eventId}`);
      return eventId || null;
    } catch (error) {
      console.error("Error creating calendar hold event:", error);
      return null;
    }
  },

  /**
   * カレンダーイベントを削除
   * @param eventId - イベントID
   * @param accessToken - Google OAuth2アクセストークン
   */
  async deleteEvent(eventId: string, accessToken: string): Promise<boolean> {
    try {
      const calendar = getCalendarClient(accessToken);

      await calendar.events.delete({
        calendarId: "primary",
        eventId,
      });

      console.log(`Deleted calendar event: ${eventId}`);
      return true;
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      return false;
    }
  },

  /**
   * カレンダーイベントを更新
   * @param eventId - イベントID
   * @param updates - 更新内容
   * @param accessToken - Google OAuth2アクセストークン
   */
  async updateEvent(
    eventId: string,
    updates: {
      summary?: string;
      startDateTime?: string;
      endDateTime?: string;
    },
    accessToken: string,
  ): Promise<boolean> {
    try {
      const calendar = getCalendarClient(accessToken);

      const requestBody: {
        summary?: string;
        start?: { dateTime: string; timeZone: string };
        end?: { dateTime: string; timeZone: string };
      } = {};

      if (updates.summary) {
        requestBody.summary = updates.summary;
      }

      if (updates.startDateTime) {
        requestBody.start = {
          dateTime: updates.startDateTime,
          timeZone: "Asia/Tokyo",
        };
      }

      if (updates.endDateTime) {
        requestBody.end = {
          dateTime: updates.endDateTime,
          timeZone: "Asia/Tokyo",
        };
      }

      await calendar.events.patch({
        calendarId: "primary",
        eventId,
        requestBody,
      });

      console.log(`Updated calendar event: ${eventId}`);
      return true;
    } catch (error) {
      console.error("Error updating calendar event:", error);
      return false;
    }
  },
};
