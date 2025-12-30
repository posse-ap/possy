import type { Slot } from "@/models/slot/slot";

export type MentorResponse = {
  id: string;
  surveyId: string;
  mentorName: string;
  slots: Slot[];
  createdAt: string;
};

export type MentorResponseInput = {
  mentorName: string;
  slots: Slot[];
};
