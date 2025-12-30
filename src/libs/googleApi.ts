import { cookies } from "next/headers";
import { google } from "googleapis";

/**
 * Google OAuth2クライアントを取得
 * ユーザーのアクセストークンを使用してAPIを呼び出す
 */
export function getGoogleOAuth2Client(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID,
    process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return oauth2Client;
}

/**
 * Supabaseのセッションからアクセストークンを取得
 */
export async function getAccessTokenFromSession(
  session: { provider_token?: string | null } | null,
): Promise<string | null> {
  const tokenFromSession = session?.provider_token || null;
  if (tokenFromSession) return tokenFromSession;

  try {
    const cookieStore = await cookies();
    return cookieStore.get("google_provider_token")?.value || null;
  } catch {
    return null;
  }
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
