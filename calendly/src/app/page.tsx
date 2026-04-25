import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          MeetSync
        </div>
        <nav className={styles.navLinks}>
          <Link href="/login" className={styles.navLink}>Log In</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={`${styles.hero} animate-fade-in`}>
          <h1 className="heading-xl">Scheduling made simple, elegant, and fast.</h1>
          <p className={styles.subtitle}>
            Eliminate back-and-forth emails. Share your link, let others book times that work for both of you, and watch your calendar fill up automatically.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/signup" className="btn-primary">
              Start for Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              View Demo Dashboard
            </Link>
          </div>
        </div>

        <div className={styles.milestones}>
          <div className={`${styles.milestoneCard} glass-panel animate-fade-in`} style={{ animationDelay: '0.1s' }}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3 className={styles.milestoneTitle}>1. Set up profile</h3>
            <p className={styles.milestoneDesc}>Connect your calendar and set your working hours quickly.</p>
          </div>
          
          <div className={`${styles.milestoneCard} glass-panel animate-fade-in`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
            <h3 className={styles.milestoneTitle}>2. Create link</h3>
            <p className={styles.milestoneDesc}>Generate a beautiful booking page tailored to your availability.</p>
          </div>

          <div className={`${styles.milestoneCard} glass-panel animate-fade-in`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
            </div>
            <h3 className={styles.milestoneTitle}>3. First Booking!</h3>
            <p className={styles.milestoneDesc}>Share your link and earn your first booking achievement.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
