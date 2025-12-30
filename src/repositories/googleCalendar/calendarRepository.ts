export type CalendarEvent = {
  id: string;
  summary: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
};

export const calendarRepository = {
  async listEvents(
    startDate: string,
    endDate: string,
  ): Promise<CalendarEvent[]> {
    try {
      // TODO: Google Calendar API呼び出し実装
      console.log("Fetching calendar events from", startDate, "to", endDate);

      // 仮の実装: 空配列を返す
      return [];
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      return [];
    }
  },

  async createHoldEvent(
    date: string,
    startTime: string,
    endTime: string,
    title: string,
  ): Promise<string | null> {
    try {
      // TODO: Google Calendar API呼び出し実装
      console.log("Creating calendar hold event:", {
        date,
        startTime,
        endTime,
        title,
      });

      // 仮の実装: ダミーIDを返す
      return `event_${Date.now()}`;
    } catch (error) {
      console.error("Error creating calendar hold event:", error);
      return null;
    }
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      // TODO: Google Calendar API呼び出し実装
      console.log("Deleting calendar event:", eventId);

      return true;
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      return false;
    }
  },
};
