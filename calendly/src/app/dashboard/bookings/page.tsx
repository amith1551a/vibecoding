"use client";

import styles from "../dashboard.module.css";

export default function Bookings() {
  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Upcoming Bookings</h1>
          <p className="text-muted">Manage your scheduled events and invitees.</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Mock Booking Item */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 600 }}>Wednesday, April 15, 2026 - 09:00 AM</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Project Discovery Call</h3>
            <span style={{ color: 'var(--text-secondary)' }}>Invitee: John Doe (john@example.com)</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Reschedule</button>
             <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderColor: '#ef4444', color: '#ef4444' }}>Cancel</button>
          </div>
        </div>

        {/* Mock Booking Item 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 600 }}>Thursday, April 16, 2026 - 02:30 PM</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>15 Minute Meeting</h3>
            <span style={{ color: 'var(--text-secondary)' }}>Invitee: Sarah Jenkins (sarah@startup.io)</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Reschedule</button>
             <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderColor: '#ef4444', color: '#ef4444' }}>Cancel</button>
          </div>
        </div>

      </div>
    </div>
  );
}
