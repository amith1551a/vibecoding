import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room');
  const participantName = req.nextUrl.searchParams.get('username');

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  } else if (!participantName) {
    return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Server misconfigured: Missing LiveKit details' }, { status: 500 });
  }

  // Create a fast, short-lived JWT that only grants access to this specific room
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    // Add token expiration strictly to 2 hours
    ttl: '2h', 
  });
  
  // Here we attach specific granular permissions.
  // We allow them to join/publish in the room, and indicate we will auto-record this room from the backend via Egress later.
  at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });

  const token = await at.toJwt();
  
  return NextResponse.json({ token });
}
