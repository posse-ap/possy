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
 * 有効なアクセストークンを持っているかチェック（Server Component専用）
 * 単純にトークンの存在のみチェック（実際の有効性はGoogle APIライブラリが自動リフレッシュ）
 */
export async function hasValidAccessToken(): Promise<boolean> {
  try {
    const supabase = await getServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { accessToken } =
      await getAccessTokenFromSession(session);

    // トークンが存在すればOK（Google APIライブラリが自動的にリフレッシュする）
    return !!accessToken;
  } catch (error) {
    console.error("Error checking access token:", error);
    return false;
  }
}

/**
 * アクセストークンの有無をチェック（Server Component専用）
 * @deprecated 有効性も確認する hasValidAccessToken() の使用を推奨
 */
export async function hasAccessToken() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { accessToken } = await getAccessTokenFromSession(session);
  return !!accessToken;
}
