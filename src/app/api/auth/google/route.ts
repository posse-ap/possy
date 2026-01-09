import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
  const redirectUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(new URL("/", request.url).toString())}`;

  return NextResponse.redirect(redirectUrl);
}
