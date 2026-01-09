import { supabase } from "@/libs/supabaseClient";

export const useGoogleLogin = () => {
  const handleGoogleLogin = async (returnUrl?: string) => {
    const redirectTo = returnUrl 
      ? `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`
      : `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes:
          "openid email profile https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/spreadsheets",
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

  return { handleGoogleLogin };
};
