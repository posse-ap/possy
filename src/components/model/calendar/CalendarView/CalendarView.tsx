"use client";

import { useState } from "react";
import type { CalendarEvent } from "@/models/calendar/calendarEvent";
import type { Slot } from "@/models/slot/slot";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarViewProps = {
	googleEvents: CalendarEvent[];
	selectedSlots: Slot[];
	onDateTimeSelect: (date: string, startTime: string) => void;
};

export function CalendarView({
	googleEvents,
	selectedSlots,
	onDateTimeSelect,
}: CalendarViewProps) {
	const [currentWeekStart, setCurrentWeekStart] = useState(() => {
		const today = new Date();
		const day = today.getDay();
		const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 月曜日を週の開始に
		return new Date(today.setDate(diff));
	});

	// 表示する時間帯（8:00 - 22:00）
	const timeSlots = Array.from({ length: 15 }, (_, i) => {
		const hour = 8 + i;
		return `${String(hour).padStart(2, "0")}:00`;
	});

	// 週の日付を取得
	const weekDays = Array.from({ length: 7 }, (_, i) => {
		const date = new Date(currentWeekStart);
		date.setDate(date.getDate() + i);
		return date;
	});

	const handlePrevWeek = () => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(newDate.getDate() - 7);
		setCurrentWeekStart(newDate);
	};

	const handleNextWeek = () => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(newDate.getDate() + 7);
		setCurrentWeekStart(newDate);
	};

	const getDateString = (date: Date): string => {
		return date.toISOString().split("T")[0];
	};

	const hasEvent = (date: Date, time: string): CalendarEvent | undefined => {
		const dateStr = getDateString(date);
		return googleEvents.find((event) => {
			if (event.date !== dateStr) return false;
			const eventStart = event.startTime;
			const eventEnd = event.endTime;
			return time >= eventStart && time < eventEnd;
		});
	};

	const hasSelectedSlot = (date: Date, time: string): boolean => {
		const dateStr = getDateString(date);
		return selectedSlots.some((slot) => {
			if (slot.date !== dateStr) return false;
			return time >= slot.startTime && time < slot.endTime;
		});
	};

	const handleCellClick = (date: Date, time: string) => {
		const event = hasEvent(date, time);
		if (event) return; // 既存予定がある場合は選択不可

		onDateTimeSelect(getDateString(date), time);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">カレンダー表示</h3>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handlePrevWeek}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="text-sm font-medium">
						{currentWeekStart.getFullYear()}/{currentWeekStart.getMonth() + 1}
					</span>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleNextWeek}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
				<div className="min-w-[800px]">
					{/* ヘッダー */}
					<div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
						<div className="border-r border-gray-200 p-2 text-center text-xs font-medium">
							時刻
						</div>
						{weekDays.map((date, idx) => {
							const isToday = date.toDateString() === new Date().toDateString();
							return (
								<div
									key={idx}
									className={cn(
										"border-r border-gray-200 p-2 text-center text-xs",
										isToday && "bg-blue-50",
									)}
								>
									<div className="font-medium">
										{["月", "火", "水", "木", "金", "土", "日"][idx]}
									</div>
									<div className="text-gray-500">
										{date.getMonth() + 1}/{date.getDate()}
									</div>
								</div>
							);
						})}
					</div>

					{/* タイムスロット */}
					<div>
						{timeSlots.map((time) => (
							<div key={time} className="grid grid-cols-8 border-b border-gray-200">
								<div className="border-r border-gray-200 p-2 text-center text-xs text-gray-500">
									{time}
								</div>
								{weekDays.map((date, idx) => {
									const event = hasEvent(date, time);
									const isSelected = hasSelectedSlot(date, time);
									const isToday =
										date.toDateString() === new Date().toDateString();

									return (
										<button
											type="button"
											key={idx}
											onClick={() => handleCellClick(date, time)}
											disabled={!!event}
											className={cn(
												"border-r border-gray-200 p-1 text-xs transition-colors",
												isToday && "bg-blue-50/30",
												event &&
													"cursor-not-allowed bg-blue-100 text-blue-800",
												isSelected && "bg-black text-white",
												!event &&
													!isSelected &&
													"hover:bg-gray-100 cursor-pointer",
											)}
										>
											{event ? (
												<div className="truncate font-medium">
													{event.title}
												</div>
											) : isSelected ? (
												<div className="font-medium">選択中</div>
											) : null}
										</button>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
				<div className="flex flex-wrap gap-3">
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded bg-blue-100 border border-blue-200" />
						<span>既存の予定</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded bg-black" />
						<span>選択した時間（2時間枠）</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 rounded border border-gray-300 bg-white" />
						<span>選択可能</span>
					</div>
				</div>
			</div>
		</div>
	);
}
