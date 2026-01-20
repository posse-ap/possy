import { vi } from "vitest";

export const supabase = {
	from: vi.fn(() => ({
		select: vi.fn(() => ({
			eq: vi.fn(() => ({
				single: vi.fn(),
			})),
			order: vi.fn(),
		})),
		insert: vi.fn(() => ({
			select: vi.fn(() => ({
				single: vi.fn(),
			})),
		})),
		upsert: vi.fn(() => ({
			select: vi.fn(() => ({
				single: vi.fn(),
			})),
		})),
		delete: vi.fn(() => ({
			eq: vi.fn(),
		})),
	})),
};
