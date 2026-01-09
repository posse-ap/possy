"use client";

import { Button } from "@/components/ui/Button";
import { supabase } from "@/libs/supabaseClient";

export const LogoutButton = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      ログアウト
    </Button>
  );
};
