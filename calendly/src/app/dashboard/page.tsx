"use client";

import styles from "./dashboard.module.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [showGamificationToast, setShowGamificationToast] = useState(false);

  useEffect(() => {
    if (searchParams.get("onboarded") === "true") {
      setShowGamificationToast(true);
      const timer = setTimeout(() => setShowGamificationToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      
      {/* Gamification Toast */}
      {showGamificationToast && (
        <div className="animate-fade-in" style={{
          position: 'fixed', bottom: '2rem', right: '2rem', background: '#10b981', color: 'white',
          padding: '1rem 1.5rem', borderRadius: 'var(--border-radius-md)', boxShadow: 'var(--box-shadow-hover)',
          display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 100
        }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Profile complete!</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Next Step: Create your first booking link.</div>
          </div>
          <button onClick={() => setShowGamificationToast(false)} style={{ color: 'white', opacity: 0.8, marginLeft: '1rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Welcome back, Amith!</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
             <p className="text-muted" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>You are on the <span className="badge pro">Pro</span> plan.</p>
             <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>• You currently have 3 Active Event Links.</span>
          </div>
          
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'rgba(79, 70, 229, 0.05)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(79, 70, 229, 0.1)', display: 'inline-block', margin: 0 }}>
             <strong style={{ color: 'var(--primary-color)' }}>ℹ️ What are "Links"?</strong> A link refers to a unique bookable event template (like a "15 Min Call" or "60 Min Interview") that your clients can schedule with you.
          </div>
        </div>
        <Link href="/dashboard/new-link" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Link
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Active Links</div>
          <div className={styles.statValue}>3</div>
        </div>
        <div className={styles.statCard} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.statTitle}>Bookings This Month</div>
          <div className={styles.statValue}>0</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            Total scheduled meetings created across all your active links this calendar month.
          </div>
        </div>
        <div className={styles.statCard} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.statTitle}>Profile Views</div>
          <div className={styles.statValue}>0</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
            Number of times visitors have viewed your main public booking page (meetsync.com/amith).
          </div>
        </div>
      </div>

      <h2 className="heading-lg" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Links</h2>
      
      <div className={styles.linksGrid}>
        <div className={styles.linkCard}>
          <div className={styles.linkHeader}>
            <div>
              <h3 className={styles.linkTitle}>15 Minute Meeting</h3>
              <div className={styles.linkDuration}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                15 mins, Voice call
              </div>
            </div>
            <button aria-label="Copy Link" title="Copy Link" style={{ color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
          <Link href="/book?t=15" className={styles.linkUrl}>
            meetsync.com/amith/15-min
          </Link>
          <div className={styles.linkFooter}>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Edit</button>
          </div>
        </div>

        {/* 30 Minute Link */}
        <div className={styles.linkCard}>
          <div className={styles.linkHeader}>
            <div>
              <h3 className={styles.linkTitle}>30 Minute Catch-up</h3>
              <div className={styles.linkDuration}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                30 mins, Video call
              </div>
            </div>
            <button aria-label="Copy Link" title="Copy Link" style={{ color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
          <Link href="/book?t=30" className={styles.linkUrl}>
            meetsync.com/amith/30-min
          </Link>
          <div className={styles.linkFooter}>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Edit</button>
          </div>
        </div>

        {/* 45 Minute Link */}
        <div className={styles.linkCard}>
          <div className={styles.linkHeader}>
            <div>
              <h3 className={styles.linkTitle}>Project Discovery</h3>
              <div className={styles.linkDuration}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                45 mins, Video call
              </div>
            </div>
            <button aria-label="Copy Link" title="Copy Link" style={{ color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
          <Link href="/book?t=45" className={styles.linkUrl}>
            meetsync.com/amith/discovery
          </Link>
          <div className={styles.linkFooter}>
            <label className={styles.switch}>
              <input type="checkbox" defaultChecked />
              <span className={styles.slider}></span>
            </label>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
