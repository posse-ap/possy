"use client";

import { Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Slot } from "@/models/slot/slot";
import { formatSlotDisplay } from "@/models/slot/slotFormat";

type SlotListProps = {
  slots: Slot[];
  onRemove: (id: string) => void;
};

export function SlotList({ slots, onRemove }: SlotListProps) {
  if (slots.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-500">
          まだスロットが追加されていません
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="font-medium">{formatSlotDisplay(slot)}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(slot.id)}
            className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="pt-2">
        <Badge variant="secondary">{slots.length}件のスロット</Badge>
      </div>
    </div>
  );
}
