"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

export default function HelpBanner() {
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  let title = "Welcome to MeetSync!";
  let description = "Navigate using the sidebar to set up your profile and start scheduling.";

  if (pathname === '/dashboard') {
    title = "Dashboard Overview";
    description = "Here you can see your upcoming meetings, manage your active event types, and quickly copy your booking links to share with clients. Click 'New Event Type' to start.";
  } else if (pathname?.includes('/dashboard/integrations')) {
    title = "Calendar Sync Guide";
    description = "Connect your Google or Outlook accounts here to prevent double-booking. Use the 'Day | Week | Month' toggles to preview your merged availability, and click on any calendar block to interact with it.";
  } else if (pathname?.includes('/dashboard/bookings')) {
    title = "Manage Bookings";
    description = "Review all your scheduled appointments, reschedule if needed, or join active meetings directly from this panel.";
  } else if (pathname?.includes('/dashboard/settings')) {
    title = "Account Settings";
    description = "Update your working hours, branding, and billing details here. (Your PRO status is completely active!).";
  } else if (pathname?.includes('/dashboard/new-link')) {
    title = "Create New Event";
    description = "Set the duration, location, and custom questions for your new bookable event type. Once saved, it will appear on your public booking page.";
  }

  return (
    <div className="animate-fade-in" style={{ background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.2)', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ color: 'var(--primary-color)', marginTop: '2px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div>
           <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-color)' }}>{title}</h4>
           <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{description}</p>
        </div>
      </div>
      <button onClick={() => setClosed(true)} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  );
}
