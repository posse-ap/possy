import type { Survey } from "@/models/survey/survey";
import { surveyRepository } from "@/repositories/persistence";

export async function getSurvey(surveyId: string): Promise<Survey | null> {
  return await surveyRepository.findById(surveyId);
}
