"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [useCase, setUseCase] = useState("business");
  const router = useRouter();

  const handleCompleteSetup = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically save config to the 'users' document in Firestore
    router.push("/dashboard?onboarded=true");
  };

  return (
    <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '500px', margin: 'auto' }}>
        
        {/* Progress indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <div style={{ height: '6px', width: '40px', background: 'var(--primary-color)', borderRadius: '3px' }}></div>
          <div style={{ height: '6px', width: '40px', background: 'var(--border-color)', borderRadius: '3px' }}></div>
          <div style={{ height: '6px', width: '40px', background: 'var(--border-color)', borderRadius: '3px' }}></div>
        </div>

        <h1 className="heading-lg" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Welcome to MeetSync</h1>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Let's set up your profile so people can start booking with you.</p>
        
        <form onSubmit={handleCompleteSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Jane Doe"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
              required 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Your Unique MeetSync URL</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden' }}>
              <span style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                meetsync.com/
              </span>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="janedoe"
                style={{ width: '100%', padding: '0.75rem', border: 'none', outline: 'none' }}
                required 
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>This is the link you will share with invitees.</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Primary Use</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                type="button"
                onClick={() => setUseCase("business")}
                style={{ 
                  padding: '1rem', 
                  borderRadius: 'var(--border-radius-sm)', 
                  border: useCase === 'business' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
                  background: useCase === 'business' ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Business
              </button>
              <button 
                type="button"
                onClick={() => setUseCase("personal")}
                style={{ 
                  padding: '1rem', 
                  borderRadius: 'var(--border-radius-sm)', 
                  border: useCase === 'personal' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', 
                  background: useCase === 'personal' ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Personal
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Continue to Dashboard
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
