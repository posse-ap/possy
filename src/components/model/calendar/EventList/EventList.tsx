"use client";

import { cn } from "@/libs/utils";
import type { CalendarEvent } from "@/models/calendar/calendarEvent";
import { Calendar, Clock } from "lucide-react";

type EventListProps = {
  events: CalendarEvent[];
  title?: string;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];
  return `${month}/${day}(${weekday})`;
}

export function EventList({ events, title = "既存の予定" }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <Calendar className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-3 text-sm text-gray-500">予定がありません</p>
      </div>
    );
  }

  // 日付でグループ化
  const eventsByDate = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    },
    {} as Record<string, CalendarEvent[]>,
  );

  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-2">
            <div className="text-xs font-medium text-gray-500">
              {formatDate(date)}
            </div>
            <div className="space-y-1">
              {eventsByDate[date]
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-center gap-1 rounded-md border p-2 text-sm",
                      event.isGoogleEvent
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-white",
                    )}
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium w-25">
                      {event.startTime} - {event.endTime}
                    </span>
                    <span className="text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap">
                      {event.title}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
