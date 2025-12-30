import { getCalendarClient } from "@/libs/googleApi";

export type CalendarEvent = {
  id: string;
  summary: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
};

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
  ): Promise<CalendarEvent[]> {
    try {
      const calendar = getCalendarClient(accessToken);

      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date(`${startDate}T00:00:00`).toISOString(),
        timeMax: new Date(`${endDate}T23:59:59`).toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.data.items || [];

      return events
        .filter((event) => event.start && event.end)
        .map((event) => ({
          id: event.id || "",
          summary: event.summary || "(タイトルなし)",
          start:
            event.start?.dateTime ||
            event.start?.date ||
            new Date().toISOString(),
          end:
            event.end?.dateTime || event.end?.date || new Date().toISOString(),
        }));
    } catch (error) {
      console.error("Error fetching calendar events:", error);
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
