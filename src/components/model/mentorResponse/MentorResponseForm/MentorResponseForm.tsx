"use client";

import { CalendarView } from "@/components/model/calendar/CalendarView";
import { EventList } from "@/components/model/calendar/EventList";
import { SlotList } from "@/components/model/slot/SlotList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select/select";
import type { CalendarEvent } from "@/models/calendar/calendarEvent";
import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";
import {
  checkNewSlotOverlap,
  type MentorResponseFormData,
  mentorResponseSchema,
  validateNoOverlap,
} from "@/models/mentorResponse/mentorResponseValidators";
import type { Slot } from "@/models/slot/slot";
import { formatTimeDisplay } from "@/utils/Time";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type MentorResponseFormProps = {
  onSubmit: (data: MentorResponseInput) => void;
  isSubmitting?: boolean;
  googleEvents?: CalendarEvent[];
  startDate: string;
  endDate: string;
};

export function MentorResponseForm({
  onSubmit,
  isSubmitting = false,
  googleEvents = [],
  startDate,
  endDate,
}: MentorResponseFormProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
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
      setValidationError("");
    } else {
      // 新しいスロットが既存のスロットと重複しないかチェック
      const newSlotData = { date, startTime, endTime };
      const overlapCheck = checkNewSlotOverlap(newSlotData, slots);

      if (overlapCheck.hasOverlap) {
        // 重複エラーを表示
        setValidationError(
          overlapCheck.message ||
            "選択した時間が既存のスロットと重複しています",
        );
        return;
      }

      // 新しいスロットを追加
      const newSlot: Slot = {
        id: crypto.randomUUID(),
        date,
        startTime,
        endTime,
      };
      setSlots((prev) => [...prev, newSlot]);
      setValidationError("");
    }
  };

  const handleRemoveSlot = (id: string) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
    setValidationError("");
  };

  const onFormSubmit = (data: MentorResponseFormData) => {
    // スロットのバリデーション
    const validation = validateNoOverlap(slots);

    if (!validation.isValid) {
      setValidationError(
        validation.message || "バリデーションエラーが発生しました",
      );
      return;
    }

    onSubmit({
      mentorName: data.mentorName,
      email: data.email,
      university: data.university,
      posse: data.posse,
      generation: data.generation,
      availableCapacity: data.availableCapacity,
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
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス *</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">大学 *</Label>
              <Input
                id="university"
                type="text"
                placeholder="〇〇大学"
                {...register("university")}
                className={errors.university ? "border-red-500" : ""}
              />
              {errors.university && (
                <p className="text-sm text-red-500">
                  {errors.university.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="posse">所属POSSE *</Label>
              <Controller
                name="posse"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors.posse ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="①">①</SelectItem>
                      <SelectItem value="②">②</SelectItem>
                      <SelectItem value="③">③</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.posse && (
                <p className="text-sm text-red-500">{errors.posse.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="generation">何期生 *</Label>
              <Controller
                name="generation"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors.generation ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3期生">3期生</SelectItem>
                      <SelectItem value="4期生">4期生</SelectItem>
                      <SelectItem value="5期生">5期生</SelectItem>
                      <SelectItem value="6期生">6期生</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.generation && (
                <p className="text-sm text-red-500">
                  {errors.generation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableCapacity">
                何グループ対応できるか *
              </Label>
              <Controller
                name="availableCapacity"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full ${errors.availableCapacity ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1チームならできます">
                        1チームならできます
                      </SelectItem>
                      <SelectItem value="2〜3チームならできます">
                        2〜3チームならできます
                      </SelectItem>
                      <SelectItem value="3チーム以上できます">
                        3チーム以上できます
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.availableCapacity && (
                <p className="text-sm text-red-500">
                  {errors.availableCapacity.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {validationError && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <Badge variant="default" className="bg-red-600 text-white">
              エラー
            </Badge>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                時間の重複が検出されました
              </p>
              <p className="text-sm text-red-700 mt-1">{validationError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">
              参加可能な日時を {formatTimeDisplay(startDate)} 〜{" "}
              {formatTimeDisplay(endDate)} の期間から選択してください
            </h3>
          </div>
          <CalendarView
            googleEvents={googleEvents}
            selectedSlots={slots}
            onDateTimeSelect={handleDateTimeSelect}
          />
        </div>

        <div className="space-y-4 ">
          <EventList events={googleEvents} title="あなたの予定" />
          <SlotList slots={slots} onRemove={handleRemoveSlot} />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          variant="outline"
          size="lg"
          disabled={isSubmitting || slots.length === 0}
          className="w-full sm:w-auto cursor-pointer"
        >
          {isSubmitting ? "送信中..." : "回答を送信"}
        </Button>
      </div>
    </form>
  );
}
