"use client";

import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";

export const LogoutButton = () => {
  return (
    <form action={signOutAction}>
      <Button variant="outline" type="submit">
        ログアウト
      </Button>
    </form>
  );
};
