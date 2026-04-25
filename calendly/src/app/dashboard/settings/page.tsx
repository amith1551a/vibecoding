"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard.module.css";
// Import our new Firebase config
import { db } from "@/lib/firebase/clientApp";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Settings() {
  const [displayName, setDisplayName] = useState("Amith");
  const [businessInfo, setBusinessInfo] = useState("Infylogy Corp");
  const [tagline, setTagline] = useState("We help businesses scale with Next.js.");
  const [pitch, setPitch] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const HARDCODED_USER_ID = "host_amith_123";

  // Load the initial data when the dashboard mounts
  useEffect(() => {
    async function loadData() {
      try {
        const docRef = doc(db, "profiles", HARDCODED_USER_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDisplayName(data.displayName || "");
          setBusinessInfo(data.businessInfo || "");
          setTagline(data.tagline || "");
          setPitch(data.pitch || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      // Actually write the changes to the Firestore NoSQL database
      const docRef = doc(db, "profiles", HARDCODED_USER_ID);
      await setDoc(docRef, {
        displayName,
        businessInfo,
        tagline,
        pitch,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSaveMessage("Profile written to Firestore successfully!");
    } catch (err) {
      console.error(err);
      setSaveMessage("Error updating cloud database.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Account Settings</h1>
          <p className="text-muted">Manage your profile, billing, and system preferences.</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
        
        {/* Profile Settings */}
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Profile</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>MeetSync URL</label>
              <input 
                type="text" 
                value="meetsync.com/amith"
                disabled
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none', background: 'rgba(0,0,0,0.02)', color: 'var(--text-secondary)' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Business Info</label>
              <input 
                type="text" 
                value={businessInfo}
                onChange={(e) => setBusinessInfo(e.target.value)}
                placeholder="e.g. Acme Corp, Software Consulting"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Intro / Tagline</label>
              <input 
                type="text" 
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="We help businesses scale with Next.js."
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                <span>Business Pitch</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Max 1000 words</span>
              </label>
              <textarea 
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Tell your clients why they should book a meeting with you..."
                rows={5}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
              ></textarea>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                This pitch will be displayed prominently on your public booking page to attract and convert clients.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                className="btn-primary" 
                disabled={isSaving}
                onClick={handleSave}
                style={{ alignSelf: 'flex-start', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              
              {saveMessage && (
                <span className="animate-fade-in" style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Billing & Plan</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
            <span className="badge pro" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>Pro Plan</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Lifetime deal acquired</span>
          </div>
          
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem' }}>
             <p style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '0.5rem', fontWeight: 600 }}>
               Total Paid: $0.99 (Donation)
             </p>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
               You are verified as a business and generously donated to help us maintain services. You now have access to unlimited features with absolutely 0% meeting fees!
             </p>
          </div>
          <button className="btn-secondary" style={{ opacity: 0.8 }}>View Invoice</button>
        </div>

      </div>
    </div>
  );
}
