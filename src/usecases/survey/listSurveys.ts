import type { Survey } from "@/models/survey/survey";
import { surveyRepository } from "@/repositories/persistence";

export async function listSurveys(): Promise<Survey[]> {
  return await surveyRepository.findAll();
}
