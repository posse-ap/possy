import { google } from "googleapis";

/**
 * Google OAuth2クライアントを取得
 * ユーザーのアクセストークンを使用してAPIを呼び出す
 */
export function getGoogleOAuth2Client(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return oauth2Client;
}

/**
 * Supabaseのセッションからアクセストークンを取得
 */
export function getAccessTokenFromSession(
  session: { provider_token?: string | null } | null,
): string | null {
  return session?.provider_token || null;
}

/**
 * Google Sheets APIクライアントを取得
 */
export function getSheetsClient(accessToken: string) {
  const auth = getGoogleOAuth2Client(accessToken);
  return google.sheets({ version: "v4", auth });
}

/**
 * Google Calendar APIクライアントを取得
 */
export function getCalendarClient(accessToken: string) {
  const auth = getGoogleOAuth2Client(accessToken);
  return google.calendar({ version: "v3", auth });
}
