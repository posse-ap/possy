import { getAccessTokenFromSession } from "@/libs/googleApi";
import { getServerSupabaseClient } from "@/libs/supabaseServer";
import { calendarRepository } from "@/repositories/googleCalendar";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 },
      );
    }

    // Supabaseセッションからアクセストークンを取得
    const supabase = await getServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();


    const { accessToken, refreshToken } =
      await getAccessTokenFromSession(session);

    if (!accessToken) {
      console.warn("Calendar API: No access token available");
      return NextResponse.json(
        {
          error: "Not authenticated with Google",
          events: [],
          message: "Google認証が必要です",
        },
        { status: 401 },
      );
    }

    // Google APIライブラリが自動的にトークンをリフレッシュ
    const events = await calendarRepository.listEvents(
      startDate,
      endDate,
      accessToken,
      refreshToken || undefined,
    );


    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    
    // 401エラーの場合は認証エラーとして処理
    if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
      return NextResponse.json(
        {
          error: "Token expired or invalid",
          events: [],
          message: "認証の有効期限が切れました。再度ログインしてください",
        },
        { status: 401 },
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to fetch calendar events",
        events: [],
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
