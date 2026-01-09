"use client";

import { Button } from "@/components/ui/Button";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const LoginButton = () => {
  const { handleGoogleLogin } = useGoogleLogin();
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  const handleClick = () => {
    handleGoogleLogin(pathname);
  };

  return (
    <Button variant="default" onClick={handleClick}>
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
