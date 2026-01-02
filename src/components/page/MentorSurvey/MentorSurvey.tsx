"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MentorResponseForm } from "@/components/model/mentorResponse/MentorResponseForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { CalendarEvent } from "@/models/calendar/calendarEvent";
import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";

type MentorSurveyProps = {
  surveyId: string;
  surveyTitle?: string;
  surveyDescription?: string;
  startDate: string;
  endDate: string;
};

export function MentorSurvey({
  surveyId,
  surveyTitle = "メンター日程アンケート",
  surveyDescription = "参加可能な日時を選択してください。カレンダーから空いている時間をクリックしてください。",
  startDate,
  endDate,
}: MentorSurveyProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Google Calendarイベントを取得
  useEffect(() => {
    async function fetchCalendarEvents() {
      try {
        const response = await fetch(
          `/api/calendar/events?startDate=${startDate}&endDate=${endDate}`,
        );
        
        if (response.ok) {
          const data = await response.json();
          setGoogleEvents(data.events || []);
        } else {
          console.warn("Failed to fetch calendar events:", response.status);
        }
      } catch (error) {
        console.warn("Error fetching calendar events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    }

    fetchCalendarEvents();
  }, [startDate, endDate]);

  const handleSubmit = async (data: MentorResponseInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/mentor-responses/${surveyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "送信に失敗しました");
      }

      router.push(`/mentor/${surveyId}/done`);
    } catch (error) {
      console.error("送信エラー:", error);
      const message =
        error instanceof Error
          ? error.message
          : "送信に失敗しました。もう一度お試しください。";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl">{surveyTitle}</CardTitle>
            <CardDescription className="text-base">
              {surveyDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">
                {isLoadingEvents 
                  ? "Googleカレンダーの予定を読み込み中..."
                  : googleEvents.length > 0
                  ? "Googleカレンダーの予定を表示しています"
                  : "Googleカレンダーの予定が取得できませんでした（Google認証が必要です）"}
              </p>
              <ul className="space-y-1 text-blue-700">
                <li>・青色のセルはあなたの既存予定です</li>
                <li>・空いている時間をクリックして選択してください</li>
                <li>・各スロットは2時間単位で自動計算されます</li>
                <li>・週の切り替えボタンで異なる週を表示できます</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <MentorResponseForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          googleEvents={googleEvents}
        />
      </div>
    </div>
  );
}
