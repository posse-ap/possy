import { describe, it, expect } from "vitest";
import type { Slot } from "./slot";
import {
	getAllUniqueSlotsFromResponses,
	formatSlotsForGoogleForm,
} from "./slotUtils";

describe("getAllUniqueSlotsFromResponses", () => {
	it("空の回答配列の場合は空配列を返す", () => {
		const result = getAllUniqueSlotsFromResponses([]);
		expect(result).toEqual([]);
	});

	it("1つの回答の場合はそのスロットを返す", () => {
		const responses = [
			{
				slots: [
					{
						id: "1",
						date: "2024-10-15",
						startTime: "10:00",
						endTime: "12:00",
					},
				],
			},
		];
		const result = getAllUniqueSlotsFromResponses(responses);
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(responses[0].slots[0]);
	});

	it("重複するスロットを削除する", () => {
		const responses = [
			{
				slots: [
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
				],
			},
			{
				slots: [
					{
						id: "3",
						date: "2024-10-15",
						startTime: "10:00",
						endTime: "12:00",
					},
				],
			},
		];
		const result = getAllUniqueSlotsFromResponses(responses);
		expect(result).toHaveLength(2);
	});

	it("日時順にソートされる", () => {
		const responses = [
			{
				slots: [
					{
						id: "1",
						date: "2024-10-16",
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
						date: "2024-10-15",
						startTime: "10:00",
						endTime: "12:00",
					},
				],
			},
		];
		const result = getAllUniqueSlotsFromResponses(responses);
		expect(result[0].date).toBe("2024-10-15");
		expect(result[0].startTime).toBe("10:00");
		expect(result[1].date).toBe("2024-10-15");
		expect(result[1].startTime).toBe("14:00");
		expect(result[2].date).toBe("2024-10-16");
	});

	it("同じ日付の場合は開始時刻順にソートされる", () => {
		const responses = [
			{
				slots: [
					{
						id: "1",
						date: "2024-10-15",
						startTime: "16:00",
						endTime: "18:00",
					},
					{
						id: "2",
						date: "2024-10-15",
						startTime: "10:00",
						endTime: "12:00",
					},
					{
						id: "3",
						date: "2024-10-15",
						startTime: "14:00",
						endTime: "16:00",
					},
				],
			},
		];
		const result = getAllUniqueSlotsFromResponses(responses);
		expect(result[0].startTime).toBe("10:00");
		expect(result[1].startTime).toBe("14:00");
		expect(result[2].startTime).toBe("16:00");
	});
});

describe("formatSlotsForGoogleForm", () => {
	it("空配列の場合は空文字列を返す", () => {
		const result = formatSlotsForGoogleForm([]);
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
		const result = formatSlotsForGoogleForm(slots);
		expect(result).toMatch(/10\/15\(.+\) 10:00-12:00/);
	});

	it("複数のスロットを改行区切りでフォーマットする", () => {
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
		const result = formatSlotsForGoogleForm(slots);
		const lines = result.split("\n");
		expect(lines).toHaveLength(2);
		expect(lines[0]).toMatch(/10\/15\(.+\) 10:00-12:00/);
		expect(lines[1]).toMatch(/10\/16\(.+\) 14:00-16:00/);
	});

	it("曜日が正しく表示される", () => {
		const slots: Slot[] = [
			{
				id: "1",
				date: "2024-01-01",
				startTime: "10:00",
				endTime: "12:00",
			},
		];
		const result = formatSlotsForGoogleForm(slots);
		expect(result).toContain("1/1");
		expect(result).toMatch(/\(.\)/);
	});
});
