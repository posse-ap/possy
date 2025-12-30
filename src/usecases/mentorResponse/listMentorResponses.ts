import type { Slot } from "@/models/slot/slot";
import { mentorResponseRepository } from "@/repositories/persistence";

export type MentorResponseWithSlots = {
  id: string;
  surveyId: string;
  mentorName: string;
  slots: Slot[];
  createdAt: string;
  submittedAt: string;
};

export async function listMentorResponses(
  surveyId: string,
): Promise<MentorResponseWithSlots[]> {
  const responses = await mentorResponseRepository.findBySurveyId(surveyId);

  // TODO: スロット情報はGoogle Sheetsから取得する必要がある
  // 現時点ではスロット情報なしで返す
  return responses.map((response) => ({
    id: response.id,
    surveyId: response.survey_id,
    mentorName: response.mentor_name,
    slots: [], // スロット情報は後で実装
    createdAt: response.submitted_at,
    submittedAt: response.submitted_at,
  }));
}
