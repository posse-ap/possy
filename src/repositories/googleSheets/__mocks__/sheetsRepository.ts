import type { Slot } from "@/models/slot/slot";
import type { SpreadsheetRow } from "@/repositories/googleSheets/sheetsRepository";
import type { AvailableCapacity, Generation, Posse } from "@/types/posse";
import { vi } from "vitest";

export const sheetsRepository = {
  getSheetNameByGid:
    vi.fn<
      (
        spreadsheetId: string,
        gid: string | null,
        accessToken: string,
      ) => Promise<string>
    >(),
  appendMentorResponseRows:
    vi.fn<
      (
        spreadsheetId: string,
        sheetName: string,
        mentorName: string,
        slots: Slot[],
        email: string,
        posse: Posse,
        generation: Generation,
        university: string,
        availableCapacity: AvailableCapacity,
        submittedAt: string,
        accessToken: string,
      ) => Promise<boolean>
    >(),
  getMentorResponseRows:
    vi.fn<
      (
        spreadsheetId: string,
        sheetName: string,
        accessToken: string,
      ) => Promise<SpreadsheetRow[]>
    >(),
};
