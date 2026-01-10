import { getAccessTokenFromSession } from "@/libs/googleApi";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

/**
 * Server-side用のSupabaseクライアント
 * ユーザーのセッションを使用してアクセストークンを取得
 */
export async function getServerSupabaseClient() {
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
        } catch {
          // setCookieはServer Actionsでのみ呼び出せる
        }
      },
    },
  });
}

/**
 * sessionを持っているかチェック（Server Component専用）
 */
export async function hasAuthenticated(): Promise<boolean> {
  try {
    const supabase = await getServerSupabaseClient();

    // まずセッションをチェック
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return false;
    }

    // セッションがある場合のみgetUser()で検証
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log(
      "hasAuthenticated - user exists:",
      !!user,
      "error:",
      error?.message,
    );

    return !!user && !error;
  } catch (error) {
    console.error("hasAuthenticated error:", error);
    return false;
  }
}

/**
 * アクセストークンの有無をチェック（Server Component専用）
 * @deprecated 有効性も確認する isAuthenticated() の使用を推奨
 */
export async function hasAccessToken() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { accessToken } = await getAccessTokenFromSession(session);
  return !!accessToken;
}
