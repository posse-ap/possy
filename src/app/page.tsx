import { Calendar, LogIn, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Possy</h1>
          <p className="text-xl text-gray-600">メンターの日程調整を簡単に</p>
        </div>

        {/* ログインボタン */}
        <div className="mb-8 text-center">
          <Card className="border-2 bg-blue-50">
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-4">
                アンケートに回答または運営画面を利用するには、Googleアカウントでログインしてください
              </p>
              <Link href="/api/auth/google">
                <Button
                  variant="primary"
                  size="lg"
                  className="cursor-pointer gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Googleでログイン
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-8 w-8" />
                <CardTitle className="text-2xl">メンター</CardTitle>
              </div>
              <CardDescription>
                参加可能な日時を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                ログイン後、アンケートURLからアクセスしてください
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-8 w-8" />
                <CardTitle className="text-2xl">運営</CardTitle>
              </div>
              <CardDescription>アンケートの作成と回答管理</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/organizer" className="block">
                <Button variant="outline" className="w-full cursor-pointer">
                  運営画面を開く
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>開発中のプレビュー版です</p>
        </div>
      </div>
    </div>
  );
}
