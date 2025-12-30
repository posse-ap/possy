import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center space-y-4">
        <h1 className="text-2xl font-semibold">認証に失敗しました</h1>
        <p className="text-gray-600">
          Google認証の処理に問題が発生しました。もう一度ログインをお試しください。
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="default">トップに戻る</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
