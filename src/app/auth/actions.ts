// app/auth/actions.ts
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.signOut();

  // Google provider tokenも削除
  cookieStore.set("google_provider_token", "", { path: "/", maxAge: 0 });
  cookieStore.set("google_provider_refresh_token", "", {
    path: "/",
    maxAge: 0,
  });

  if (error) {
    console.error("signOutAction error:", error.message);
  }

  // サーバー側でリダイレクト
  redirect("/");
}
