import { getServerSupabaseClient } from "@/libs/supabaseServer";
import { supabase } from "@/libs/supabaseClient";
import type { Survey, SurveyInput } from "@/models/survey/survey";

export const surveyRepository = {
  async findById(id: string): Promise<Survey | null> {
    // Server-sideの場合はgetServerSupabaseClient()を使用
    const client = typeof window === "undefined" 
      ? await getServerSupabaseClient()
      : supabase;

    const { data, error } = await client
      .from("surveys")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching survey:", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      startDate: data.start_date,
      endDate: data.end_date,
      spreadsheetUrl: data.spreadsheet_url,
      createdAt: data.created_at,
    };
  },

  async findAll(): Promise<Survey[]> {
    const client = typeof window === "undefined" 
      ? await getServerSupabaseClient()
      : supabase;

    const { data, error } = await client
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching surveys:", error);
      return [];
    }

    return (
      data?.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description || "",
        startDate: row.start_date,
        endDate: row.end_date,
        spreadsheetUrl: row.spreadsheet_url,
        createdAt: row.created_at,
      })) || []
    );
  },

  async create(input: SurveyInput): Promise<Survey | null> {
    const client = typeof window === "undefined" 
      ? await getServerSupabaseClient()
      : supabase;

    // SpreadsheetURLからIDを抽出
    const spreadsheetId = extractSpreadsheetId(input.spreadsheetUrl);

    const { data, error } = await client
      .from("surveys")
      .insert({
        title: input.title,
        description: input.description,
        start_date: input.startDate,
        end_date: input.endDate,
        spreadsheet_url: input.spreadsheetUrl,
        spreadsheet_id: spreadsheetId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating survey:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      startDate: data.start_date,
      endDate: data.end_date,
      spreadsheetUrl: data.spreadsheet_url,
      createdAt: data.created_at,
    };
  },

  async delete(id: string): Promise<boolean> {
    const client = typeof window === "undefined" 
      ? await getServerSupabaseClient()
      : supabase;

    const { error } = await client.from("surveys").delete().eq("id", id);

    if (error) {
      console.error("Error deleting survey:", error);
      return false;
    }

    return true;
  },
};

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
