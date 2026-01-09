"use client";

import { Button } from "@/components/ui/Button";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LoginButton = () => {
  const { handleGoogleLogin } = useGoogleLogin();
  const pathname = usePathname();

  const handleClick = () => {
    handleGoogleLogin(pathname);
  };

  return (
    <div className="flex flex-col items-center gap-3">
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
      <p className="text-xs text-gray-500 text-center">
        ログインすることで、
        <Link 
          href="/privacy" 
          className="text-blue-600 hover:underline mx-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          プライバシーポリシー
        </Link>
        に同意したものとみなします。
      </p>
    </div>
  );
};
