"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Slot, SlotInput } from "@/models/slot/slot";
import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";
import {
	mentorResponseSchema,
	type MentorResponseFormData,
} from "@/models/mentorResponse/mentorResponseValidators";
import { SlotEditor } from "@/components/model/slot/SlotEditor";
import { SlotList } from "@/components/model/slot/SlotList";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type MentorResponseFormProps = {
	onSubmit: (data: MentorResponseInput) => void;
	isSubmitting?: boolean;
};

export function MentorResponseForm({
	onSubmit,
	isSubmitting = false,
}: MentorResponseFormProps) {
	const [slots, setSlots] = useState<Slot[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<MentorResponseFormData>({
		resolver: zodResolver(mentorResponseSchema),
	});

	const handleAddSlot = (slotInput: SlotInput) => {
		const newSlot: Slot = {
			id: crypto.randomUUID(),
			...slotInput,
		};
		setSlots((prev) => [...prev, newSlot]);
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

			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">参加可能な日時を追加</h3>
					<p className="text-sm text-gray-500">
						開始時刻から2時間枠で自動計算されます
					</p>
				</div>
				<SlotEditor onAdd={handleAddSlot} />
			</div>

			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-semibold">追加済みスロット</h3>
				</div>
				<SlotList slots={slots} onRemove={handleRemoveSlot} />
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
