"use client";

import { useState } from "react";
import styles from "./book.module.css";
import Link from "next/link";

export default function BookingPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "01:00 PM", "02:30 PM"];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={`${styles.bookingCard} animate-fade-in`} style={{ padding: '3rem', textAlign: 'center', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--accent-color)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '2rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="heading-lg" style={{ marginBottom: '1rem' }}>You are scheduled!</h1>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>
            A calendar invitation has been sent to your email.
          </p>
          <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', textAlign: 'left', width: '100%', maxWidth: '400px' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Project Discovery Call</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              With Amith
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Wednesday, April {selectedDate}, 2026<br/>
              {selectedTime}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.bookingCard} animate-fade-in`}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          {showForm && (
            <button 
              onClick={() => setShowForm(false)}
              style={{ color: 'var(--primary-color)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </button>
          )}

          <div className={styles.hostInfo}>
            <div className={styles.hostName}>Amith</div>
            <h1 className={styles.meetingTitle}>Project Discovery Call</h1>
          </div>

          <div className={styles.meetingDetails}>
            <div className={styles.detailRow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              45 min
            </div>
            {showForm && (
              <div className={styles.detailRow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Wednesday, April {selectedDate}, 2026 <br/> {selectedTime}
              </div>
            )}
            <div className={styles.detailRow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              Google Meet details provided upon confirmation
            </div>
            {!showForm && (
              <>
                <br/>
                <p style={{ fontSize: '0.875rem' }}>
                  Let's discuss your project goals, scope, and how we can work together to build something amazing.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {showForm ? (
          <div className={`${styles.mainContent} animate-fade-in`} style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
            <h2 className={styles.sectionTitle}>Enter Details</h2>
            <form onSubmit={handleSubmitBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Name *</label>
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email *</label>
                <input 
                  type="email" 
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                  required 
                />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>Schedule Event</button>
            </form>
          </div>
        ) : (
          <div className={styles.mainContent}>
            <div className={styles.calendarSection}>
              <h2 className={styles.sectionTitle}>Select a Date & Time</h2>
              
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>April 2026</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button aria-label="Previous month" style={{ color: 'var(--primary-color)' }}>&lt;</button>
                  <button aria-label="Next month" style={{ color: 'var(--primary-color)' }}>&gt;</button>
                </div>
              </div>

              <div className={styles.calendarGrid}>
                {days.map(day => <div key={day} className={styles.dayName}>{day}</div>)}
                <div></div><div></div><div></div>
                
                {dates.map(date => {
                  const isDisabled = date < 8 || date > 25 || date % 7 === 0 || date % 7 === 6;
                  const isSelected = date === selectedDate;
                  
                  return (
                    <div 
                      key={date} 
                      onClick={() => !isDisabled && setSelectedDate(date)}
                      className={`${styles.dayCell} ${isDisabled ? styles.disabled : ''} ${isSelected ? styles.selected : ''}`}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
              
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                Central Time - US & Canada
              </div>
            </div>

            {selectedDate && (
              <div className={`${styles.slotsSection} animate-fade-in`} style={{ height: '100%', overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                  Wednesday, April {selectedDate}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {timeSlots.map(time => {
                    const isSelected = selectedTime === time;
                    return (
                      <div key={time} style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className={styles.slotButton} 
                          onClick={() => handleTimeSelect(time)}
                          style={{ 
                            flex: 1,
                            backgroundColor: isSelected ? 'var(--text-secondary)' : 'transparent',
                            color: isSelected ? 'white' : 'var(--primary-color)',
                            borderColor: isSelected ? 'var(--text-secondary)' : 'var(--primary-color)'
                          }}
                        >
                          {time}
                        </button>
                        {isSelected && (
                          <button 
                            className="btn-primary animate-fade-in" 
                            onClick={handleNext}
                            style={{ padding: '0.75rem 1rem' }}
                          >
                            Next
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
