import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch (error) {
          console.error("Failed to set Supabase auth cookies:", error);
        }
      },
    },
  });
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is missing" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Failed to exchange auth code for session:", error.message);
      return NextResponse.json(
        { error: "Failed to exchange auth code" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    const providerToken = data.session?.provider_token;
    const providerRefreshToken = data.session?.provider_refresh_token;

    if (providerToken) {
      response.cookies.set("google_provider_token", providerToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    if (providerRefreshToken) {
      response.cookies.set(
        "google_provider_refresh_token",
        providerRefreshToken,
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        },
      );
    }

    return response;
  } catch (error) {
    console.error("Auth callback GET error:", error);
    return NextResponse.json(
      { error: "Unexpected error processing auth callback" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      provider_token: providerToken,
      provider_refresh_token: providerRefreshToken,
    } = await request.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Access token or refresh token is missing" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Failed to set session from tokens:", error.message);
      return NextResponse.json(
        { error: "Failed to set session" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    if (providerToken) {
      response.cookies.set("google_provider_token", providerToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    if (providerRefreshToken) {
      response.cookies.set(
        "google_provider_refresh_token",
        providerRefreshToken,
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        },
      );
    }

    return response;
  } catch (error) {
    console.error("Auth callback POST error:", error);
    return NextResponse.json(
      { error: "Unexpected error processing auth tokens" },
      { status: 500 },
    );
  }
}
