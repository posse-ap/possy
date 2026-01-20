import { vi } from "vitest";
import type { Survey, SurveyInput } from "@/models/survey/survey";

export const surveyRepository = {
	findById: vi.fn<(id: string) => Promise<Survey | null>>(),
	findAll: vi.fn<() => Promise<Survey[]>>(),
	create: vi.fn<(input: SurveyInput) => Promise<Survey | null>>(),
	delete: vi.fn<(id: string) => Promise<boolean>>(),
};
