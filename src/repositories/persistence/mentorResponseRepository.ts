import { supabase } from "@/libs/supabaseClient";
import type { Slot } from "@/models/slot/slot";

type MentorResponseRecord = {
  id: string;
  survey_id: string;
  mentor_name: string;
  slots: Slot[];
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

    return (
      data?.map((row) => ({
        id: row.id,
        survey_id: row.survey_id,
        mentor_name: row.mentor_name,
        slots: row.slots || [],
        submitted_at: row.submitted_at,
      })) || []
    );
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

    return {
      id: data.id,
      survey_id: data.survey_id,
      mentor_name: data.mentor_name,
      slots: data.slots || [],
      submitted_at: data.submitted_at,
    };
  },

  async create(
    surveyId: string,
    mentorName: string,
    slots: Slot[],
  ): Promise<MentorResponseRecord | null> {
    const { data, error } = await supabase
      .from("mentor_responses")
      .insert({
        survey_id: surveyId,
        mentor_name: mentorName,
        slots,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating mentor response:", error);
      return null;
    }

    return {
      id: data.id,
      survey_id: data.survey_id,
      mentor_name: data.mentor_name,
      slots: data.slots || [],
      submitted_at: data.submitted_at,
    };
  },

  async upsert(
    surveyId: string,
    mentorName: string,
    slots: Slot[],
  ): Promise<MentorResponseRecord | null> {
    const { data, error } = await supabase
      .from("mentor_responses")
      .upsert(
        {
          survey_id: surveyId,
          mentor_name: mentorName,
          slots,
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

    return {
      id: data.id,
      survey_id: data.survey_id,
      mentor_name: data.mentor_name,
      slots: data.slots || [],
      submitted_at: data.submitted_at,
    };
  },
};
