import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/clientApp';
import { doc, setDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided in URL' }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/google/callback`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Exchange the authorization code for an offline access token
    const { tokens } = await oauth2Client.getToken(code);
    
    oauth2Client.setCredentials(tokens);

    // Get user profile to associate the tokens with the correct account
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const userEmail = userInfo.data.email;

    if (!userEmail) throw new Error("Could not fetch user email");

    // Securely save the offline tokens to Google Firestore
    // This allows the 8 AM Cron Job to read their calendar tomorrow morning
    const docRef = doc(db, 'oauth_tokens', userEmail);
    await setDoc(docRef, {
      google_calendar: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token, // Crucial for offline background tasks
        expiry_date: tokens.expiry_date,
        updated_at: new Date().toISOString()
      }
    }, { merge: true });

    // Redirect the user back to the dashboard with a success flag
    return NextResponse.redirect(new URL('/dashboard/integrations?auth_success=true', req.url));

  } catch (error: any) {
    console.error('Error exchanging Google OAuth code:', error?.response?.data || error);
    return NextResponse.json({ error: 'Failed to authenticate with Google', details: error.message }, { status: 500 });
  }
}
