"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Slot, SlotInput } from "@/models/slot/slot";
import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";
import type { CalendarEvent } from "@/models/calendar/calendarEvent";
import {
	mentorResponseSchema,
	type MentorResponseFormData,
} from "@/models/mentorResponse/mentorResponseValidators";
import { CalendarView } from "@/components/model/calendar/CalendarView";
import { EventList } from "@/components/model/calendar/EventList";
import { SlotList } from "@/components/model/slot/SlotList";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type MentorResponseFormProps = {
	onSubmit: (data: MentorResponseInput) => void;
	isSubmitting?: boolean;
	googleEvents?: CalendarEvent[];
};

export function MentorResponseForm({
	onSubmit,
	isSubmitting = false,
	googleEvents = [],
}: MentorResponseFormProps) {
	const [slots, setSlots] = useState<Slot[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<MentorResponseFormData>({
		resolver: zodResolver(mentorResponseSchema),
	});

	const handleDateTimeSelect = (date: string, startTime: string) => {
		// 2時間後の終了時刻を計算
		const [hours, minutes] = startTime.split(":").map(Number);
		const endHours = (hours + 2) % 24;
		const endTime = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

		// 既に同じ時間帯が選択されているか確認
		const existingSlot = slots.find(
			(slot) =>
				slot.date === date &&
				slot.startTime === startTime &&
				slot.endTime === endTime,
		);

		if (existingSlot) {
			// 既に選択されている場合は削除
			setSlots((prev) => prev.filter((slot) => slot.id !== existingSlot.id));
		} else {
			// 新しいスロットを追加
			const newSlot: Slot = {
				id: crypto.randomUUID(),
				date,
				startTime,
				endTime,
			};
			setSlots((prev) => [...prev, newSlot]);
		}
	};

	const handleRemoveSlot = (id: string) => {
		setSlots((prev) => prev.filter((slot) => slot.id !== id));
	};

	const onFormSubmit = (data: MentorResponseFormData) => {
		if (slots.length === 0) {
			alert("少なくとも1つのスロットを追加してください");
			return;
		}

		onSubmit({
			mentorName: data.mentorName,
			slots,
		});
	};

	return (
		<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>基本情報</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label htmlFor="mentorName">お名前 *</Label>
						<Input
							id="mentorName"
							type="text"
							placeholder="山田 太郎"
							{...register("mentorName")}
							className={errors.mentorName ? "border-red-500" : ""}
						/>
						{errors.mentorName && (
							<p className="text-sm text-red-500">
								{errors.mentorName.message}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2 space-y-4">
					<div>
						<h3 className="text-lg font-semibold">
							参加可能な日時を選択してください
						</h3>
						<p className="text-sm text-gray-500">
							カレンダーから空いている時間をクリックしてください（2時間単位）
						</p>
					</div>
					<CalendarView
						googleEvents={googleEvents}
						selectedSlots={slots}
						onDateTimeSelect={handleDateTimeSelect}
					/>
				</div>

				<div className="space-y-4">
					<EventList events={googleEvents} title="あなたの予定" />
					<div>
						<h3 className="text-sm font-semibold text-gray-700 mb-3">
							選択済みスロット
						</h3>
						<SlotList slots={slots} onRemove={handleRemoveSlot} />
					</div>
				</div>
			</div>

			<div className="flex justify-end gap-4 pt-4">
				<Button
					type="submit"
					variant="primary"
					size="lg"
					disabled={isSubmitting || slots.length === 0}
					className="w-full sm:w-auto"
				>
					{isSubmitting ? "送信中..." : "回答を送信"}
				</Button>
			</div>
		</form>
	);
}
