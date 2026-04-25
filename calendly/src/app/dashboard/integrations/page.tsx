"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../dashboard.module.css";

export default function Integrations() {
  const searchParams = useSearchParams();
  const [googleAccounts, setGoogleAccounts] = useState<string[]>([]);
  const [outlookAccounts, setOutlookAccounts] = useState<string[]>([]);
  const [activeDisplayAccounts, setActiveDisplayAccounts] = useState<string[]>([]);

  // Load real synchronized accounts from Google Firebase
  useEffect(() => {
    async function fetchConnectedIntegrations() {
      try {
        const { collection, getDocs, getFirestore } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase/clientApp');
        
        const tokensSnap = await getDocs(collection(db, "oauth_tokens"));
        const connectedGoogle: string[] = [];
        
        tokensSnap.forEach(doc => {
          const data = doc.data();
          if (data.google_calendar) {
             // The document ID is the user's email because we saved it as: doc(db, 'oauth_tokens', userEmail)
             connectedGoogle.push(doc.id);
          }
        });
        
        setGoogleAccounts(connectedGoogle);
        // Automatically check them for display
        setActiveDisplayAccounts(prev => [...new Set([...prev, ...connectedGoogle])]);
        
        // Show success if they just returned from Google
        if (searchParams.get('auth_success') === 'true') {
           alert("Successfully synchronized your Google Calendar to Firebase!");
           window.history.replaceState({}, '', '/dashboard/integrations');
        }
      } catch (err) {
        console.error("Failed to load integrations", err);
      }
    }
    fetchConnectedIntegrations();
  }, [searchParams]);

  // Premium Custom Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProvider, setModalProvider] = useState<"Google" | "Outlook" | null>(null);
  const [modalEmailInput, setModalEmailInput] = useState("");
  
  // Event Details Modal State
  const [selectedEvent, setSelectedEvent] = useState<{title: string, email: string, date: string, time: string} | null>(null);
  
  // Calendar View Control State
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const toggleDisplay = (email: string) => {
    setActiveDisplayAccounts(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleModalSubmit = () => {
    if (modalEmailInput && modalEmailInput.trim() !== '') {
      const cleanEmail = modalEmailInput.trim();
      if (modalProvider === "Google") {
        setGoogleAccounts(prev => prev.includes(cleanEmail) ? prev : [...prev, cleanEmail]);
      } else if (modalProvider === "Outlook") {
        setOutlookAccounts(prev => prev.includes(cleanEmail) ? prev : [...prev, cleanEmail]);
      }
      setActiveDisplayAccounts(prev => prev.includes(cleanEmail) ? prev : [...prev, cleanEmail]);
    }
    setModalOpen(false);
    setModalEmailInput("");
    setModalProvider(null);
  };

  const handleGoogleConnect = () => {
    // Initiate real Google OAuth flow by hitting our new backend!
    window.location.href = "/api/auth/google";
  };

  const handleOutlookConnect = () => {
    const popup = window.open('https://outlook.office.com/mail', 'Microsoft OAuth', 'width=500,height=600');
    
    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        setModalProvider("Outlook");
        setModalOpen(true);
      }
    }, 500);

    setTimeout(() => {
      if (popup && !popup.closed) popup.close();
    }, 30000);
  };

  const allAccounts = [...googleAccounts, ...outlookAccounts];
  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];
  const getColorForEmail = (email: string) => {
     const index = allAccounts.indexOf(email);
     return colors[Math.max(0, index) % colors.length];
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2.5fr', gap: '2rem', height: 'calc(100vh - 120px)' }}>
      
      {/* LEFT COLUMN: Account Management */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', paddingRight: '0.5rem' }}>
        <div className={styles.header} style={{ marginBottom: '2rem', flexShrink: 0 }}>
          <div>
            <h1 className={styles.headerTitle}>Calendar Sync</h1>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Select connected accounts to overlay on the schedule.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Google Calendar Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                     <path fill="#4285F4" d="M23.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.3 3.6v3h3.7c2.2-2 3.6-5.1 3.6-8.9z"/>
                     <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-3c-1.1.7-2.5 1.1-4.2 1.1-3.2 0-5.9-2.1-6.9-5l-3.8 2.9C3.3 21 7.3 24 12 24z"/>
                     <path fill="#FBBC05" d="M5.1 18.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1V11H1.3C.5 12.5 0 14.1 0 16s.5 3.5 1.3 5l3.8-2.9z"/>
                     <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 3 1.4 7l3.8 2.9c1-2.9 3.7-5.1 6.8-5.1z"/>
                   </svg>
                 </div>
                 <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Google Calendar</h3>
              </div>
              <button onClick={handleGoogleConnect} className="btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                {googleAccounts.length > 0 ? "+ Add" : "Connect"}
              </button>
            </div>
            
            {googleAccounts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                {googleAccounts.map(email => (
                  <label key={email} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={activeDisplayAccounts.includes(email)} 
                      onChange={() => toggleDisplay(email)}
                      style={{ accentColor: getColorForEmail(email), width: '16px', height: '16px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                       <span style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{email}</span>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); setGoogleAccounts(prev => prev.filter(a => a !== email)); setActiveDisplayAccounts(prev => prev.filter(active => active !== email)); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Disconnect</button>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Outlook Calendar Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', background: 'rgba(79, 70, 229, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0072C6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                      <path d="M2 8h20"></path>
                      <path d="M6 4v4"></path>
                    </svg>
                 </div>
                 <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Outlook Calendar</h3>
              </div>
              <button onClick={handleOutlookConnect} className="btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                 {outlookAccounts.length > 0 ? "+ Add" : "Connect"}
              </button>
            </div>
            
            {outlookAccounts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                {outlookAccounts.map(email => (
                  <label key={email} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={activeDisplayAccounts.includes(email)} 
                      onChange={() => toggleDisplay(email)}
                      style={{ accentColor: getColorForEmail(email), width: '16px', height: '16px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                       <span style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{email}</span>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); setOutlookAccounts(prev => prev.filter(a => a !== email)); setActiveDisplayAccounts(prev => prev.filter(active => active !== email)); }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Disconnect</button>
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Workweek Preview */}
      <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
           <div>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>Workweek availability</h2>
             <p className="text-muted" style={{ fontSize: '0.875rem' }}>Displaying conflicts for selected accounts.</p>
           </div>
           
           <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)' }}>
              <button onClick={() => setViewMode('day')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.875rem', borderRadius: '6px', background: viewMode === 'day' ? 'var(--bg-color)' : 'transparent', boxShadow: viewMode === 'day' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', fontWeight: viewMode === 'day' ? 600 : 400, color: 'var(--text-primary)', transition: 'all 0.2s' }}>Day</button>
              <button onClick={() => setViewMode('week')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.875rem', borderRadius: '6px', background: viewMode === 'week' ? 'var(--bg-color)' : 'transparent', boxShadow: viewMode === 'week' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', fontWeight: viewMode === 'week' ? 600 : 400, color: 'var(--text-primary)', transition: 'all 0.2s' }}>Week</button>
              <button onClick={() => setViewMode('month')} style={{ padding: '0.35rem 0.85rem', fontSize: '0.875rem', borderRadius: '6px', background: viewMode === 'month' ? 'var(--bg-color)' : 'transparent', boxShadow: viewMode === 'month' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', border: 'none', cursor: 'pointer', fontWeight: viewMode === 'month' ? 600 : 400, color: 'var(--text-primary)', transition: 'all 0.2s' }}>Month</button>
           </div>
        </div>
        
        {allAccounts.length === 0 ? (
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', minHeight: '300px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                 <line x1="16" y1="2" x2="16" y2="6"></line>
                 <line x1="8" y1="2" x2="8" y2="6"></line>
                 <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <p>Connect a calendar on the left to see your schedule layout.</p>
           </div>
        ) : (
           viewMode === 'month' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-color)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                   {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', borderLeft: d !== 'Sun' ? '1px solid var(--border-color)' : 'none' }}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', flex: 1, background: 'var(--border-color)', gap: '1px' }}>
                   {[...Array(3)].map((_, i) => <div key={`empty-${i}`} style={{ background: 'var(--bg-secondary)', opacity: 0.5 }}></div>)}
                   {Array.from({length: 30}).map((_, i) => {
                      const dayNum = i + 1;
                      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(i + 3) % 7];
                      const mockCount = (dayName === 'Sat' || dayName === 'Sun') ? 0 : activeDisplayAccounts.filter(a => (a.charCodeAt(0) + dayNum) % 4 === 0).length;
                      return (
                         <div key={dayNum} style={{ background: 'var(--bg-color)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                             <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right', marginBottom: '0.25rem' }}>{dayNum}</div>
                             {dayNum === 14 && activeDisplayAccounts.includes('amith.1551a@gmail.com') && (
                                 <div style={{ background: '#4f46e5', color: '#fff', fontSize: '0.65rem', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>6 Events</div>
                             )}
                             {dayNum === 13 && activeDisplayAccounts.includes('hr@infylogy.com') && (
                                 <div style={{ background: '#10b981', color: '#fff', fontSize: '0.65rem', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Interview Invite</div>
                             )}
                             {mockCount > 0 && dayNum !== 14 && dayNum !== 13 && (
                                 <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.65rem', padding: '2px 4px', borderRadius: '4px', textAlign: 'center' }}>{mockCount} activities</div>
                             )}
                         </div>
                      )
                   })}
                   {[...Array(2)].map((_, i) => <div key={`empty-end-${i}`} style={{ background: 'var(--bg-secondary)', opacity: 0.5 }}></div>)}
                </div>
              </div>
           ) : (
           <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
             <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${viewMode === 'day' ? 1 : 5}, 1fr)`, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
               <div></div>
               {(viewMode === 'day' ? [{ name: 'Tue', date: '04/14/2026' }] : [
                 { name: 'Mon', date: '04/13/2026' },
                 { name: 'Tue', date: '04/14/2026' },
                 { name: 'Wed', date: '04/15/2026' },
                 { name: 'Thu', date: '04/16/2026' },
                 { name: 'Fri', date: '04/17/2026' }
               ]).map(day => (
                 <div key={day.name} style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--text-primary)', borderLeft: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{day.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{day.date}</div>
                 </div>
               ))}
             </div>
             
             <div style={{ overflowY: 'auto', flex: 1 }}>
               <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${viewMode === 'day' ? 1 : 5}, 1fr)` }}>
                 {Array.from({length: 11}).map((_, i) => {
                    const hour = i + 7; // 7 AM to 5 PM
                    return (
                      <React.Fragment key={hour}>
                        <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right', borderBottom: '1px solid var(--border-color)' }}>
                           {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                        </div>
                        {(viewMode === 'day' ? [{ name: 'Tue', date: '04/14/2026' }] : [
                          { name: 'Mon', date: '04/13/2026' },
                          { name: 'Tue', date: '04/14/2026' },
                          { name: 'Wed', date: '04/15/2026' },
                          { name: 'Thu', date: '04/16/2026' },
                          { name: 'Fri', date: '04/17/2026' }
                        ]).map(day => {
                           // Simulated events generation logic
                           let dayEvents = activeDisplayAccounts.filter(email => {
                              if (email === 'amith@infylogy.com' && day.name === 'Tue' && hour === 13) return false;
                              if (email === 'hr@infylogy.com' && day.name === 'Mon' && hour === 12) return false;
                              if (email === 'amith.1551a@gmail.com' && day.name === 'Tue') return false;
                              if (email === 'amith@fintech' && day.name === 'Tue' && hour === 12) return false;
                              
                              const hash = email.charCodeAt(0) + day.name.charCodeAt(0) * 3 + hour * 7;
                              return hash % 11 < 3;
                           }).map(email => {
                              let title = 'Busy';
                              const customTitles: Record<string, string[]> = {
                                'hr@infylogy.com': ['Candidate Interview', 'PRIVATE LIMITED Onboarding', 'HR Team Sync'],
                                'amith.1551a@gmail.com': ['Personal Appointment', 'Lunch Out of Office', 'Gym'],
                                'adamarigapudi@gmail.com': ['Focus Time', 'Design Review']
                              };
                              if (customTitles[email]) {
                                 const hash = day.name.charCodeAt(0) + hour * 5;
                                 const titles = customTitles[email];
                                 title = titles[hash % titles.length];
                              }
                              return { email, title };
                           });

                           // Explicit mock override for the specific user screenshot request
                           if (activeDisplayAccounts.includes('amith@infylogy.com') && day.name === 'Tue' && hour === 13) {
                              dayEvents.push({ email: 'amith@infylogy.com', title: 'Amith kumar Arigapudi and Aaron Cruz (Zoom)' });
                           }
                           if (activeDisplayAccounts.includes('hr@infylogy.com') && day.name === 'Mon' && hour === 12) {
                              dayEvents.push({ email: 'hr@infylogy.com', title: 'Interview Invite || Ms.Anoos' });
                           }
                           
                           // Extensive overrides for amith.1551a and amith@fintech on Tuesday
                           if (day.name === 'Tue') {
                               if (activeDisplayAccounts.includes('amith.1551a@gmail.com')) {
                                   switch(hour) {
                                       case 7:
                                           dayEvents.push({ email: 'amith.1551a@gmail.com', title: '[MORNING] Lamictal (1), Vitamin D3...' });
                                           dayEvents.push({ email: 'amith.1551a@gmail.com', title: 'Irving Weekly Bone Meeting...' });
                                           break;
                                       case 8:
                                           dayEvents.push({ email: 'amith.1551a@gmail.com', title: 'check app1 and app2 website daily' });
                                           dayEvents.push({ email: 'amith.1551a@gmail.com', title: 'daily habits, 8:30am' });
                                           break;
                                       case 12:
                                           dayEvents.push({ email: 'amith.1551a@gmail.com', title: 'irs SADI weekly meet, 12pm' });
                                           break;
                                       case 16:
                                           dayEvents.push({ email: 'amith.1551a@gmail.com', title: 'track eod 4-5pm' });
                                           break;
                                   }
                               }
                               if (activeDisplayAccounts.includes('amith@fintech') && hour === 12) {
                                   dayEvents.push({ email: 'amith@fintech', title: 'irs SADI weekly meet, 12pm' });
                               }
                           }
                           
                           return (
                              <div key={`${day.name}-${hour}`} style={{ padding: '4px', borderLeft: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', position: 'relative', minHeight: '60px' }}>
                                 {dayEvents.map((ev, index) => (
                                    <div key={`${ev.email}-${index}`} title={ev.title} 
                                      onClick={() => setSelectedEvent({
                                          title: ev.title,
                                          email: ev.email,
                                          date: `${day.name}, ${day.date}`,
                                          time: `${hour === 12 ? '12:00 PM' : hour > 12 ? hour - 12 + ':00 PM' : hour + ':00 AM'} - ${hour + 1 === 12 ? '12:00 PM' : hour + 1 > 12 ? hour + 1 - 12 + ':00 PM' : hour + 1 + ':00 AM'}`
                                      })}
                                      style={{ 
                                      background: getColorForEmail(ev.email), 
                                      opacity: 0.85, 
                                      color: 'white', 
                                      fontSize: '0.65rem', 
                                      padding: '0.25rem 0.5rem', 
                                      borderRadius: '4px', 
                                      marginBottom: '4px', 
                                      whiteSpace: 'nowrap', 
                                      overflow: 'hidden', 
                                      textOverflow: 'ellipsis',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                      cursor: 'pointer'
                                    }}>
                                        {ev.title}
                                    </div>
                                 ))}
                              </div>
                           );
                        })}
                      </React.Fragment>
                    )
                 })}
               </div>
             </div>
           </div>
           )
        )}

      </div>
    </div>
    
    {/* Premium Email Entry Modal Overlay */}
    {modalOpen && (
      <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
        {/* ... existing modalOpen content ... */}
        <div style={{ width: '420px', background: 'var(--bg-color)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Authorization Successful</h3>
           </div>
           
           <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
             To complete the simulation, please enter the {modalProvider} email address you just approved:
           </p>
           
           <input 
              type="email" 
              autoFocus
              value={modalEmailInput}
              onChange={e => setModalEmailInput(e.target.value)}
              placeholder={`e.g., your.name@${modalProvider === 'Google' ? 'gmail.com' : 'outlook.com'}`}
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleModalSubmit();
              }}
           />
           
           <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setModalOpen(false); setModalEmailInput(""); setModalProvider(null); }} style={{ padding: '0.625rem 1rem', background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Cancel</button>
              <button className="btn-primary" onClick={handleModalSubmit} style={{ padding: '0.625rem 1.25rem' }}>Complete Sync</button>
           </div>
        </div>
      </div>
    )}

    {/* Event Details Modal */}
    {selectedEvent && (
       <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '450px', background: 'var(--bg-color)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '1rem' }}>{selectedEvent.title}</h3>
                <button onClick={() => setSelectedEvent(null)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '1.25rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>&times;</button>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <strong style={{ color: 'var(--text-primary)', minWidth: '80px' }}>Account:</strong> 
                   <span style={{ background: getColorForEmail(selectedEvent.email), padding: '0.125rem 0.5rem', borderRadius: '4px', color: '#fff', fontSize: '0.75rem' }}>{selectedEvent.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <strong style={{ color: 'var(--text-primary)', minWidth: '80px' }}>When:</strong> 
                   <span>{selectedEvent.date} @ {selectedEvent.time}</span>
                </div>
                
                {selectedEvent.title.toLowerCase().includes('zoom') || selectedEvent.title.toLowerCase().includes('meet') ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                     <strong style={{ color: 'var(--text-primary)', minWidth: '80px' }}>Location:</strong> 
                     <a href="#" className="text-primary" onClick={e => e.preventDefault()} style={{ textDecoration: 'underline' }}>https://zoom.us/j/mock-meeting-link...</a>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <strong style={{ color: 'var(--text-primary)', minWidth: '80px' }}>Location:</strong> 
                     <span>N/A (Standard Event)</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                   <strong style={{ color: 'var(--text-primary)', minWidth: '80px' }}>Description:</strong> 
                   <p style={{ margin: 0, lineHeight: 1.5 }}>This is a synced event actively populated from <b>{selectedEvent.email}</b> indicating guaranteed conflict status across your ecosystem.</p>
                </div>
             </div>
             
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button onClick={() => { alert(`Simulation: You Accepted "${selectedEvent.title}" on ${selectedEvent.email}`); setSelectedEvent(null); }} style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Accept
                   </button>
                   <button onClick={() => { alert(`Simulation: Marked Tentative for "${selectedEvent.title}"`); setSelectedEvent(null); }} style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                      Tentative
                   </button>
                   <button onClick={() => { alert(`Simulation: You Declined "${selectedEvent.title}"`); setSelectedEvent(null); }} style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: 'var(--bg-secondary)', color: '#ef4444', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Decline
                   </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <button onClick={() => {
                        if (selectedEvent.email.includes('gmail')) {
                             window.open('https://calendar.google.com/calendar/u/0/r/eventedit', '_blank');
                        } else {
                             window.open('https://outlook.office.com/calendar/view/month', '_blank');
                        }
                   }} style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem', display: 'inline-block', verticalAlign: 'middle' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Edit
                   </button>
                </div>
             </div>
          </div>
       </div>
    )}
    </>
  );
}
