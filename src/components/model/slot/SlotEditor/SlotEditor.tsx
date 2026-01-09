"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { SlotInput } from "@/models/slot/slot";
import { Plus } from "lucide-react";
import { useState } from "react";

type SlotEditorProps = {
  onAdd: (slot: SlotInput) => void;
};

export function SlotEditor({ onAdd }: SlotEditorProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleAdd = () => {
    if (!date || !startTime) return;

    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = (hours + 2) % 24;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    onAdd({
      date,
      startTime,
      endTime,
    });

    setDate("");
    setStartTime("");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">日付</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="日付を選択"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">開始時刻（2時間枠）</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="開始時刻"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="default"
            onClick={handleAdd}
            disabled={!date || !startTime}
            className="w-full cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            スロットを追加
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
