# Google API セットアップガイド

このアプリケーションはGoogle Calendar APIとGoogle Sheets APIを使用します。以下の手順で設定してください。

## 1. Google Cloud Consoleでプロジェクトを作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. プロジェクト名: 例）`possy-mentor-scheduler`

## 2. APIを有効化

### Google Calendar API
1. 左メニューから「APIとサービス」→「ライブラリ」
2. "Google Calendar API"を検索
3. 「有効にする」をクリック

### Google Sheets API
1. 左メニューから「APIとサービス」→「ライブラリ」
2. "Google Sheets API"を検索
3. 「有効にする」をクリック

## 3. OAuth 2.0 認証情報の作成

### 認証情報の設定
1. 左メニューから「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「OAuth クライアント ID」を選択
3. 「同意画面を構成」が未完了の場合は設定:
   - ユーザータイプ: **外部**（テストユーザーを追加できる）
   - アプリ名: `possy`
   - ユーザーサポートメール: あなたのメールアドレス
   - デベロッパーの連絡先情報: あなたのメールアドレス
   - スコープの追加:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/spreadsheets`
   - テストユーザー: 使用するGoogleアカウントのメールアドレスを追加

### OAuth クライアント作成
1. アプリケーションの種類: **ウェブアプリケーション**
2. 名前: `possy-web-client`
3. 承認済みの JavaScript 生成元:
   ```
   http://localhost:3000
   ```
4. 承認済みのリダイレクト URI:
   ```
   http://localhost:54321/auth/v1/callback
   ```
   ※ Supabaseローカル環境のコールバックURL
5. 「作成」をクリック
6. **クライアントID**と**クライアントシークレット**をコピー

## 4. Supabaseの設定

### ローカル環境（config.toml）
`supabase/config.toml` を編集:

```toml
[auth.external.google]
enabled = true
client_id = "YOUR_GOOGLE_CLIENT_ID"
client_secret = "YOUR_GOOGLE_CLIENT_SECRET"
redirect_uri = "http://localhost:54321/auth/v1/callback"

# 必要なスコープを追加
[auth.external.google.scopes]
calendar = "https://www.googleapis.com/auth/calendar"
sheets = "https://www.googleapis.com/auth/spreadsheets"
```

### 本番環境
Supabaseダッシュボードで設定:
1. プロジェクトの「Authentication」→「Providers」
2. Google を有効化
3. クライアントIDとシークレットを入力
4. Authorized Client IDsに追加のスコープを設定

## 5. 環境変数の設定

`.env.local` ファイルを作成（または更新）:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Google OAuth (Server-side用)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:54321/auth/v1/callback
```

## 6. Supabaseを再起動

```bash
npm run supabase:restart
```

## 7. アプリケーションを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスし、Google認証でログインしてください。

## 必要な権限

アプリケーションが要求する権限:
- **Google Calendar**: カレンダーイベントの読み取り・作成・削除
- **Google Sheets**: スプレッドシートの読み取り・書き込み

## トラブルシューティング

### 「アクセスがブロックされました」と表示される
- OAuth同意画面の「テストユーザー」にあなたのGoogleアカウントが追加されているか確認
- アプリが「公開」ステータスになっていない場合、テストユーザーのみアクセス可能

### トークンが取得できない
- Supabaseの設定でGoogleプロバイダーが有効になっているか確認
- リダイレクトURIが正しく設定されているか確認
- Supabaseを再起動してみる

### APIエラーが発生する
- Google Cloud ConsoleでAPIが有効になっているか確認
- 認証情報のスコープが正しく設定されているか確認
- アクセストークンが正しく取得されているか（ブラウザのDevToolsで確認）

## 実装されている機能

### Google Sheets
- メンター回答の自動書き込み（日付・時刻・名前）
- シートが存在しない場合は自動作成
- ヘッダー行の自動設定
- 運営画面で回答データの取得

### Google Calendar
- メンター回答時にカレンダーに仮押さえイベントを作成
- イベントは赤色で表示（目立たせるため）
- イベントの更新・削除機能

## 参考リンク

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api/reference/rest)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
