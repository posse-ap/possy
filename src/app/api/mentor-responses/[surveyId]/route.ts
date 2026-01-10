import { NextResponse } from "next/server";
import { getAccessTokenFromSession } from "@/libs/googleApi";
import { getServerSupabaseClient } from "@/libs/supabaseServer";
import type { MentorResponseInput } from "@/models/mentorResponse/mentorResponse";
import { submitMentorResponse } from "@/usecases/mentorResponse";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ surveyId: string }> },
) {
  try {
    const { surveyId } = await params;
    const body = (await request.json()) as MentorResponseInput;

    // 基本的なバリデーション
    if (!body.mentorName || !body.slots) {
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

    const result = await submitMentorResponse(
      surveyId,
      body,
      accessToken || undefined,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to submit response" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        responseId: result.responseId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting mentor response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
