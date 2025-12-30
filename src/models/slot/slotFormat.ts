import type { Slot } from "./slot";

export function formatSlotDisplay(slot: Slot): string {
  const date = new Date(slot.date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day} ${slot.startTime}-${slot.endTime}`;
}

export function formatSlotForExport(slots: Slot[]): string {
  return slots.map((slot) => formatSlotDisplay(slot)).join("、");
}
