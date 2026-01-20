import { describe, expect, it } from "vitest";
import type { Slot } from "../slot/slot";
import {
  checkNewSlotOverlap,
  validateNoOverlap,
} from "./mentorResponseValidators";

describe("validateNoOverlap", () => {
  it("スロットが0個の場合はエラーを返す", () => {
    const result = validateNoOverlap([]);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("少なくとも1つのスロットを追加してください");
  });

  it("スロットが1個の場合は成功する", () => {
    const slots: Slot[] = [
      {
        id: "1",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
      },
    ];
    const result = validateNoOverlap(slots);
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("異なる日付のスロットは重複しない", () => {
    const slots: Slot[] = [
      {
        id: "1",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "2",
        date: "2024-10-16",
        startTime: "10:00",
        endTime: "12:00",
      },
    ];
    const result = validateNoOverlap(slots);
    expect(result.isValid).toBe(true);
  });

  it("同じ日付で時間が重複する場合はエラーを返す", () => {
    const slots: Slot[] = [
      {
        id: "1",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "2",
        date: "2024-10-15",
        startTime: "11:00",
        endTime: "13:00",
      },
    ];
    const result = validateNoOverlap(slots);
    expect(result.isValid).toBe(false);
    expect(result.message).toContain("重複しています");
  });

  it("同じ日付で時間が隣接している場合は重複しない", () => {
    const slots: Slot[] = [
      {
        id: "1",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "2",
        date: "2024-10-15",
        startTime: "12:00",
        endTime: "14:00",
      },
    ];
    const result = validateNoOverlap(slots);
    expect(result.isValid).toBe(true);
  });

  it("同じ日付で完全に重複する場合はエラーを返す", () => {
    const slots: Slot[] = [
      {
        id: "1",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "2",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
      },
    ];
    const result = validateNoOverlap(slots);
    expect(result.isValid).toBe(false);
  });

  it("同じ日付で一方が他方を包含する場合はエラーを返す", () => {
    const slots: Slot[] = [
      {
        id: "1",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "14:00",
      },
      {
        id: "2",
        date: "2024-10-15",
        startTime: "11:00",
        endTime: "12:00",
      },
    ];
    const result = validateNoOverlap(slots);
    expect(result.isValid).toBe(false);
  });

  it("複数スロットで重複がない場合は成功する", () => {
    const slots: Slot[] = [
      {
        id: "1",
        date: "2024-10-15",
        startTime: "10:00",
        endTime: "12:00",
      },
      {
        id: "2",
        date: "2024-10-15",
        startTime: "14:00",
        endTime: "16:00",
      },
      {
        id: "3",
        date: "2024-10-16",
        startTime: "10:00",
        endTime: "12:00",
      },
    ];
    const result = validateNoOverlap(slots);
    expect(result.isValid).toBe(true);
  });
});

describe("checkNewSlotOverlap", () => {
  const existingSlots: Slot[] = [
    {
      id: "1",
      date: "2024-10-15",
      startTime: "10:00",
      endTime: "12:00",
    },
    {
      id: "2",
      date: "2024-10-15",
      startTime: "14:00",
      endTime: "16:00",
    },
  ];

  it("既存スロットと重複しない場合は成功する", () => {
    const newSlot = {
      date: "2024-10-15",
      startTime: "12:00",
      endTime: "14:00",
    };
    const result = checkNewSlotOverlap(newSlot, existingSlots);
    expect(result.hasOverlap).toBe(false);
    expect(result.message).toBeUndefined();
  });

  it("既存スロットと重複する場合はエラーを返す", () => {
    const newSlot = {
      date: "2024-10-15",
      startTime: "11:00",
      endTime: "13:00",
    };
    const result = checkNewSlotOverlap(newSlot, existingSlots);
    expect(result.hasOverlap).toBe(true);
    expect(result.message).toContain("重複しています");
  });

  it("異なる日付の場合は重複しない", () => {
    const newSlot = {
      date: "2024-10-16",
      startTime: "10:00",
      endTime: "12:00",
    };
    const result = checkNewSlotOverlap(newSlot, existingSlots);
    expect(result.hasOverlap).toBe(false);
  });

  it("既存スロットが空の場合は成功する", () => {
    const newSlot = {
      date: "2024-10-15",
      startTime: "10:00",
      endTime: "12:00",
    };
    const result = checkNewSlotOverlap(newSlot, []);
    expect(result.hasOverlap).toBe(false);
  });
});
