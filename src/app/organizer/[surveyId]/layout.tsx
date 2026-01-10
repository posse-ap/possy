import { LoginButton } from "@/components/model/Auth";
import { hasAuthenticated } from "@/libs/supabaseServer";

export default async function MentorSurveyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await hasAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">認証が必要です</h1>
            <p className="text-gray-600 mb-8">
              このページを表示するにはログインしてください
            </p>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
