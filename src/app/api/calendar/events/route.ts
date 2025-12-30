import { NextResponse } from "next/server";
import { getAccessTokenFromSession } from "@/libs/googleApi";
import { getServerSupabaseClient } from "@/libs/supabaseClient";
import { calendarRepository } from "@/repositories/googleCalendar";

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
    
    console.log("Calendar API: Session exists:", !!session);
    console.log("Calendar API: Session user:", session?.user?.email);
    
    const accessToken = await getAccessTokenFromSession(session);
    console.log("Calendar API: Access token exists:", !!accessToken);

    if (!accessToken) {
      console.warn("Calendar API: No access token available");
      return NextResponse.json(
        { 
          error: "Not authenticated with Google",
          events: [],
          message: "Google認証が必要です"
        },
        { status: 200 }, // 200で返してフロントエンドで空配列を処理
      );
    }

    const events = await calendarRepository.listEvents(
      startDate,
      endDate,
      accessToken,
    );

    console.log(`Calendar API: Fetched ${events.length} events`);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch calendar events",
        events: [],
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 200 }, // エラーでも200で返して空配列を処理
    );
  }
}
