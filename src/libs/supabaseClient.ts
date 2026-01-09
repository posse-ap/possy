import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

if (!supabaseAnonKey) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set. Supabase client may not work properly.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side用のSupabaseクライアント
 * ユーザーのセッションを使用してアクセストークンを取得
 */
export async function getServerSupabaseClient() {
  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");

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
