import { describe, it, expect } from "vitest";
import type { Slot } from "./slot";
import {
	formatSlotDisplay,
	formatSlotsForDisplay,
	formatSlotForExport,
} from "./slotFormat";

describe("formatSlotDisplay", () => {
	it("スロットを正しくフォーマットする", () => {
		const slot: Slot = {
			id: "1",
			date: "2024-10-15",
			startTime: "10:00",
			endTime: "12:00",
		};
		const result = formatSlotDisplay(slot);
		expect(result).toBe("10/15 10:00-12:00");
	});

	it("1桁の月と日を正しく表示する", () => {
		const slot: Slot = {
			id: "1",
			date: "2024-01-05",
			startTime: "09:00",
			endTime: "11:00",
		};
		const result = formatSlotDisplay(slot);
		expect(result).toBe("1/5 09:00-11:00");
	});

	it("12月を正しく表示する", () => {
		const slot: Slot = {
			id: "1",
			date: "2024-12-31",
			startTime: "23:00",
			endTime: "23:59",
		};
		const result = formatSlotDisplay(slot);
		expect(result).toBe("12/31 23:00-23:59");
	});
});

describe("formatSlotsForDisplay", () => {
	it("空配列の場合は空文字列を返す", () => {
		const result = formatSlotsForDisplay([]);
		expect(result).toBe("");
	});

	it("1つのスロットを正しくフォーマットする", () => {
		const slots: Slot[] = [
			{
				id: "1",
				date: "2024-10-15",
				startTime: "10:00",
				endTime: "12:00",
			},
		];
		const result = formatSlotsForDisplay(slots);
		expect(result).toBe("10/15 10:00-12:00");
	});

	it("複数のスロットを読点区切りでフォーマットする", () => {
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
				startTime: "14:00",
				endTime: "16:00",
			},
			{
				id: "3",
				date: "2024-10-17",
				startTime: "18:00",
				endTime: "20:00",
			},
		];
		const result = formatSlotsForDisplay(slots);
		expect(result).toBe(
			"10/15 10:00-12:00、10/16 14:00-16:00、10/17 18:00-20:00",
		);
	});
});

describe("formatSlotForExport", () => {
	it("formatSlotsForDisplayと同じ結果を返す", () => {
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
				startTime: "14:00",
				endTime: "16:00",
			},
		];
		expect(formatSlotForExport(slots)).toBe(formatSlotsForDisplay(slots));
	});
});
