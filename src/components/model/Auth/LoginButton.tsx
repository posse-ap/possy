"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

export const LoginButton = () => {
  const { handleGoogleLogin } = useGoogleLogin();

  return (
    <Button variant="default" onClick={handleGoogleLogin}>
      <Image
        src="/google.svg"
        alt="Google Logo"
        width={20}
        height={20}
        className="mr-2"
      />
      Sign in with Google
    </Button>
  );
};
