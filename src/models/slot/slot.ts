export type Slot = {
	id: string;
	date: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
};

export type SlotInput = Omit<Slot, "id">;
