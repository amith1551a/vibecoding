"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../dashboard.module.css";
import Link from "next/link";

export default function NewLink() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("google_meet");
  const [customSlug, setCustomSlug] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Later this will save to Firestore
    alert(`Successfully created new link: meetsync.com/amith/${customSlug || "new-event"}`);
    router.push("/dashboard");
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.header} style={{ marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '0.5rem', display: 'inline-block' }}>
            &larr; Back to Dashboard
          </Link>
          <h1 className={styles.headerTitle}>Create New Link</h1>
          <p className="text-muted">Configure the details for your new bookable event.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ maxWidth: '600px', border: '1px solid var(--border-color)', padding: '2rem' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Event Name</label>
            <input 
              type="text" 
              placeholder="e.g. Initial Consultation"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Duration</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
              >
                <option value="google_meet">Google Meet</option>
                <option value="zoom">Zoom</option>
                <option value="phone">Phone Call</option>
                <option value="in_person">In Person</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Custom Link</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>meetsync.com/amith/</span>
              <input 
                type="text" 
                placeholder="event-slug"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/ /g, '-'))}
                style={{ flex: 1, padding: '0.25rem', border: 'none', outline: 'none', background: 'transparent' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              This is the unique URL you will share with your clients.
            </p>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => router.push('/dashboard')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save New Link</button>
          </div>
        </form>
      </div>
    </div>
  );
}
