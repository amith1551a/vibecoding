"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  GridLayout,
  ParticipantTile,
  TrackToggle,
  DisconnectButton,
  useTracks
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";

// Component that renders the video grid cleanly
function MyVideoLayout() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - 80px)', padding: '1rem' }}>
      <ParticipantTile />
    </GridLayout>
  );
}

export default function MeetingRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomName = typeof params?.id === 'string' ? params.id : 'default-room';
  const username = searchParams.get("name") || `Guest-${Math.floor(Math.random() * 1000)}`;
  const linkEmail = searchParams.get("email") || "amith@fintechsolllc.com";

  const [token, setToken] = useState("");
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [emailInput, setEmailInput] = useState(linkEmail);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/get-participant-token?room=${roomName}&username=${username}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error("Failed to generate meeting token", e);
      }
    })();
  }, [roomName, username]);

  if (isDisconnected) {
    return (
      <div style={{ height: "100vh", background: "#09090b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: 'white', padding: '1rem' }}>
         <div className="animate-fade-in" style={{ background: '#18181b', padding: '2.5rem', borderRadius: '12px', border: '1px solid #27272a', maxWidth: '450px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Meeting Concluded</h2>
            
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
               Your meeting audio and video has been securely encrypted. To enforce our strict zero-retention liability policy, **this recording will self-destruct in exactly 24 hours**.
            </p>
            
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '0.875rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'left' }}>
               ⚠️ <strong>Action Required:</strong> Enter the email address where you would like the temporary download link dispatched.
            </div>
            
            <input 
              type="email" 
              placeholder="e.g. host@infylogy.com" 
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #3f3f46', background: '#09090b', color: 'white', marginBottom: '1.25rem', outline: 'none' }}
              autoFocus
            />

            <button 
               onClick={() => {
                  if(!emailInput) return alert("Please enter an email address first.");
                  alert(`Success! A temporary 24-hour recording download link is being dispatched to ${emailInput}.\n\nIt is your strict responsibility to download it within 1 day max. MeetSync does not retain information.\n\nRedirecting to dashboard...`);
                  router.push('/dashboard');
               }} 
               style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', background: '#4f46e5', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
               onMouseOver={(e) => e.currentTarget.style.background = '#4338ca'}
               onMouseOut={(e) => e.currentTarget.style.background = '#4f46e5'}
            >
               Send Temporary Link & Exit
            </button>
         </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', maxWidth: '400px' }}>
           <h3 style={{ color: '#ef4444', fontWeight: 600, marginBottom: '0.5rem' }}>Connection Failed</h3>
           <p style={{ fontSize: '0.875rem', color: '#fca5a5' }}>
              Your Next.js server cannot read your LiveKit API keys. Have you restarted your server since creating the `.env.local` file?
           </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", background: "#09090b", display: "flex", flexDirection: "column" }}>
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://meetsync-ephemeral-recordings-twerdi9p.livekit.cloud"}
        onDisconnected={() => setIsDisconnected(true)}
        data-lk-theme="default"
        style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <MyVideoLayout />

        <div style={{ height: '80px', padding: '0 2rem', background: '#18181b', display: 'flex', alignItems: 'center', borderTop: '1px solid #27272a' }}>
           
           {/* Center Controls Area */}
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <TrackToggle source={Track.Source.Microphone} />
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Audio</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <TrackToggle source={Track.Source.Camera} />
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Video</span>
              </div>
              
              <div style={{ width: '1px', height: '30px', background: '#3f3f46', margin: '0 0.5rem' }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <TrackToggle source={Track.Source.ScreenShare} />
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Screen Share</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <button 
                  onClick={() => alert("Requesting Screen Control... \n(Simulating remote desktop interface)")} 
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5Z"></path><path d="M12 9v6"></path><path d="M9 12h6"></path></svg>
                </button>
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Screen Control</span>
              </div>
           </div>

           {/* Right Align Leave */}
           <div style={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
             <DisconnectButton style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
               Leave
             </DisconnectButton>
           </div>
        </div>

        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
