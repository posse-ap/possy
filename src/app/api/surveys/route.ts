import { NextResponse } from "next/server";
import { getAccessTokenFromSession } from "@/libs/googleApi";
import { getServerSupabaseClient } from "@/libs/supabaseServer";
import type { SurveyInput } from "@/models/survey/survey";
import { createSurvey, listSurveys } from "@/usecases/survey";

export async function GET() {
  try {
    const surveys = await listSurveys();
    return NextResponse.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SurveyInput;

    // 基本的なバリデーション
    if (!body.title || !body.startDate || !body.endDate || !body.spreadsheetUrl) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Supabaseセッションからアクセストークンを取得
    const supabase = await getServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { accessToken } = await getAccessTokenFromSession(session);

    const result = await createSurvey(body, accessToken || undefined);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to create survey" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        survey: result.survey,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
