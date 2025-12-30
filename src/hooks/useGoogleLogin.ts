import { supabase } from "@/libs/supabaseClient";

export const useGoogleLogin = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

  return { handleGoogleLogin };
};
