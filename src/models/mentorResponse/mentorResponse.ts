import type { Slot } from "@/models/slot/slot";
import type { AvailableCapacity, Generation, Posse } from "@/types/posse";

export type MentorResponse = {
  id: string;
  surveyId: string;
  mentorName: string;
  slots: Slot[];
  createdAt: string;
};

export type MentorResponseInput = {
  mentorName: string;
  email: string;
  posse: Posse;
  university: string;
  generation: Generation;
  availableCapacity: AvailableCapacity;
  slots: Slot[];
};
