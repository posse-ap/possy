import { supabase } from "@/libs/supabaseClient";

type MentorResponseRecord = {
  id: string;
  survey_id: string;
  mentor_name: string;
  submitted_at: string;
};

export const mentorResponseRepository = {
  async findBySurveyId(surveyId: string): Promise<MentorResponseRecord[]> {
    const { data, error } = await supabase
      .from("mentor_responses")
      .select("*")
      .eq("survey_id", surveyId)
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching mentor responses:", error);
      return [];
    }

    return data || [];
  },

  async findBySurveyAndMentor(
    surveyId: string,
    mentorName: string,
  ): Promise<MentorResponseRecord | null> {
    const { data, error } = await supabase
      .from("mentor_responses")
      .select("*")
      .eq("survey_id", surveyId)
      .eq("mentor_name", mentorName)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error fetching mentor response:", error);
      return null;
    }

    return data;
  },

  async create(
    surveyId: string,
    mentorName: string,
  ): Promise<MentorResponseRecord | null> {
    const { data, error } = await supabase
      .from("mentor_responses")
      .insert({
        survey_id: surveyId,
        mentor_name: mentorName,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating mentor response:", error);
      return null;
    }

    return data;
  },

  async upsert(
    surveyId: string,
    mentorName: string,
  ): Promise<MentorResponseRecord | null> {
    const { data, error } = await supabase
      .from("mentor_responses")
      .upsert(
        {
          survey_id: surveyId,
          mentor_name: mentorName,
        },
        {
          onConflict: "survey_id,mentor_name",
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Error upserting mentor response:", error);
      return null;
    }

    return data;
  },
};
