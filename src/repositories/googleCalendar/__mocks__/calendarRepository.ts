import { vi } from "vitest";
import type { CalendarEvent } from "@/models/calendar/calendarEvent";

export const calendarRepository = {
  listEvents:
    vi.fn<
      (
        startDate: string,
        endDate: string,
        accessToken: string,
        refreshToken?: string,
      ) => Promise<CalendarEvent[]>
    >(),
  createHoldEvent:
    vi.fn<
      (
        date: string,
        startTime: string,
        endTime: string,
        title: string,
        accessToken: string,
      ) => Promise<string | null>
    >(),
  deleteEvent:
    vi.fn<(eventId: string, accessToken: string) => Promise<boolean>>(),
  updateEvent:
    vi.fn<
      (
        eventId: string,
        updates: {
          summary?: string;
          startDateTime?: string;
          endDateTime?: string;
        },
        accessToken: string,
      ) => Promise<boolean>
    >(),
};
