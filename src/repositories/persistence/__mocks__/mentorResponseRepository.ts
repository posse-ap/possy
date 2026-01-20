import type { Slot } from "@/models/slot/slot";
import type { MentorResponseRecord } from "@/repositories/persistence/mentorResponseRepository";
import { vi } from "vitest";

export const mentorResponseRepository = {
  findBySurveyId:
    vi.fn<(surveyId: string) => Promise<MentorResponseRecord[]>>(),
  findBySurveyAndMentor:
    vi.fn<
      (
        surveyId: string,
        mentorName: string,
      ) => Promise<MentorResponseRecord | null>
    >(),
  create:
    vi.fn<
      (
        surveyId: string,
        mentorName: string,
        slots: Slot[],
      ) => Promise<MentorResponseRecord | null>
    >(),
  upsert:
    vi.fn<
      (
        surveyId: string,
        input: {
          mentorName: string;
          email: string;
          posse: string;
          university: string;
          generation: string;
          availableCapacity: string;
          slots: Slot[];
        },
      ) => Promise<MentorResponseRecord | null>
    >(),
};
