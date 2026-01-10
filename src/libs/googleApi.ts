import { google } from "googleapis";
import { cookies } from "next/headers";

/**
 * Google OAuth2クライアントを取得
 * リフレッシュトークンがある場合は自動的にトークンをリフレッシュ
 */
export function getGoogleOAuth2Client(
  accessToken: string,
  refreshToken?: string,
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID,
    process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

/**
 * Supabaseのセッションからアクセストークンとリフレッシュトークンを取得
 */
export async function getAccessTokenFromSession(
  session: { provider_token?: string | null; provider_refresh_token?: string | null } | null,
): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const accessToken = session?.provider_token || null;
  const refreshToken = session?.provider_refresh_token || null;

  if (accessToken) {
    return { accessToken, refreshToken };
  }

  try {
    const cookieStore = await cookies();
    return {
      accessToken: cookieStore.get("google_provider_token")?.value || null,
      refreshToken: cookieStore.get("google_provider_refresh_token")?.value || null,
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

/**
 * Google Sheets APIクライアントを取得
 */
export function getSheetsClient(accessToken: string, refreshToken?: string) {
  const auth = getGoogleOAuth2Client(accessToken, refreshToken);
  return google.sheets({ version: "v4", auth });
}

/**
 * Google Calendar APIクライアントを取得
 */
export function getCalendarClient(accessToken: string, refreshToken?: string) {
  const auth = getGoogleOAuth2Client(accessToken, refreshToken);
  return google.calendar({ version: "v3", auth });
}
