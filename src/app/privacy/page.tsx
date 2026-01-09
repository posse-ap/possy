import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Possy",
  description: "Possyのプライバシーポリシー",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <p className="text-sm text-gray-600 mb-4">
              最終更新日: 2026年1月9日
            </p>
            <p>
              Possy（以下「当サービス」）は、ユーザーの個人情報保護を重視し、以下のプライバシーポリシーに従って個人情報を取り扱います。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. 収集する情報</h2>
            <p className="mb-2">当サービスは、以下の情報を収集します：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>氏名（メンター名）</li>
              <li>メールアドレス</li>
              <li>所属大学</li>
              <li>所属Posse</li>
              <li>世代情報</li>
              <li>スケジュール情報（日時の空き状況）</li>
              <li>Googleカレンダーの予定情報（閲覧・編集のため）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 情報の利用目的</h2>
            <p className="mb-2">収集した個人情報は、以下の目的で利用します：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>メンター日程調整の管理</li>
              <li>アンケート回答の収集と集計</li>
              <li>Googleカレンダーとの連携によるスケジュール管理</li>
              <li>Google Sheetsへのデータバックアップ</li>
              <li>サービスの改善と運営</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 第三者サービスの利用</h2>
            <p className="mb-2">当サービスは、以下の第三者サービスを利用しています：</p>
            
            <div className="space-y-3 mt-3">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Google API</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Google OAuth 2.0（認証）</li>
                  <li>Google Calendar API（カレンダー情報の取得・編集）</li>
                  <li>Google Sheets API（データの書き込み）</li>
                </ul>
                <p className="text-sm mt-2">
                  詳細は
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Googleプライバシーポリシー
                  </a>
                  をご確認ください。
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Supabase</h3>
                <p className="text-sm">
                  データベースとして利用し、個人情報を保存します。
                  詳細は
                  <a 
                    href="https://supabase.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Supabaseプライバシーポリシー
                  </a>
                  をご確認ください。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cookieの使用</h2>
            <p className="mb-2">
              当サービスは、以下の目的でCookieを使用します：
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>ユーザー認証の維持</li>
              <li>Google OAuthトークンの保存（`google_provider_token`, `google_provider_refresh_token`）</li>
              <li>セッション管理</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. データの保存期間</h2>
            <p>
              収集した個人情報は、サービス利用目的が達成されるまで、または法令で定められた期間保存します。
              削除をご希望の場合は、お問い合わせください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. データの安全性</h2>
            <p>
              当サービスは、個人情報の紛失、破壊、改ざん、漏洩などを防止するため、適切な安全管理措置を講じています。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. ユーザーの権利</h2>
            <p className="mb-2">ユーザーは、以下の権利を有します：</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>個人情報の開示請求</li>
              <li>個人情報の訂正・追加・削除</li>
              <li>個人情報の利用停止</li>
              <li>サービスの利用停止・退会</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Google APIの利用について</h2>
            <p className="mb-2">
              当サービスのGoogle APIの使用およびGoogle APIから取得した情報の他のアプリへの転送は、
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mx-1"
              >
                Google API Services User Data Policy
              </a>
              （限定的な使用要件を含む）に準拠します。
            </p>
            <p className="mt-2">
              当サービスがアクセスするGoogleユーザーデータのスコープ：
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>openid - ユーザー識別</li>
              <li>email - メールアドレス</li>
              <li>profile - プロフィール情報</li>
              <li>https://www.googleapis.com/auth/calendar.readonly - カレンダー閲覧</li>
              <li>https://www.googleapis.com/auth/calendar.events - カレンダーイベント編集</li>
              <li>https://www.googleapis.com/auth/spreadsheets - スプレッドシート編集</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. プライバシーポリシーの変更</h2>
            <p>
              当サービスは、法令の変更やサービスの改善に伴い、本プライバシーポリシーを変更することがあります。
              変更後のプライバシーポリシーは、本ページに掲載された時点で効力を生じます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. お問い合わせ</h2>
            <p>
              個人情報の取り扱いに関するご質問やご要望がある場合は、以下までお問い合わせください。
            </p>
            <div className="bg-gray-50 p-4 rounded mt-2">
              <p className="text-sm">
                サービス名: Possy<br />
                お問い合わせ先: kazuki.iwagi@posse-ap.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
