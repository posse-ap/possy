"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Google認証を処理しています...");

  useEffect(() => {
    const handleAuth = async () => {
      const next = searchParams.get("next") ?? "/";
      const code = searchParams.get("code");
      const hashParams = new URLSearchParams(
        window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash,
      );
      const accessToken = hashParams.get("access_token");
      const refreshToken =
        hashParams.get("refresh_token") ||
        hashParams.get("provider_refresh_token");
      const providerToken = hashParams.get("provider_token");
      const providerRefreshToken = hashParams.get("provider_refresh_token");

      try {
        if (code) {
          setMessage("セッションを確立しています...");
          const res = await fetch(
            `/api/auth/callback?code=${encodeURIComponent(code)}`,
          );
          if (!res.ok) {
            throw new Error("認証コードの処理に失敗しました");
          }
          router.replace(next);
          return;
        }

        if (accessToken && refreshToken) {
          setMessage("セッションを保存しています...");
          const res = await fetch("/api/auth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
              provider_token: providerToken,
              provider_refresh_token: providerRefreshToken,
            }),
          });

          if (!res.ok) {
            throw new Error("アクセストークンの処理に失敗しました");
          }

          router.replace(next);
          return;
        }

        throw new Error("必要な認証情報が見つかりませんでした");
      } catch (error) {
        console.error("Auth callback error:", error);
        router.replace("/auth/auth-code-error");
      }
    };

    void handleAuth();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center space-y-4">
        <h1 className="text-2xl font-semibold">ログイン処理中</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </main>
  );
}
