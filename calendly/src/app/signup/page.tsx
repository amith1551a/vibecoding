"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";

const PERSONAL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com"];

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [otp, setOtp] = useState("");
  const [expectedOtp, setExpectedOtp] = useState("123456"); 
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [donationAmount, setDonationAmount] = useState<number>(0.99);
  const [error, setError] = useState("");
  const router = useRouter();

  const isPersonalEmail = (emailAddress: string) => {
    if (!emailAddress.includes("@")) return false;
    const domain = emailAddress.split("@")[1].toLowerCase();
    return PERSONAL_DOMAINS.includes(domain);
  };

  const getEmailDomain = (emailAddress: string) => {
    if (!emailAddress.includes("@")) return "";
    return emailAddress.split("@")[1].toLowerCase();
  };

  const extractDomainFromUrl = (url: string) => {
    let cleanUrl = url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    cleanUrl = cleanUrl.split('/')[0];
    return cleanUrl;
  };

  const handleCreateUserDocument = async (uid: string, emailStr: string) => {
    const isPersonal = isPersonalEmail(emailStr);
    const isInfylogy = getEmailDomain(emailStr) === 'infylogy.com';
    const finalFee = isPersonal ? 0.99 : 0;
    const finalDonation = isInfylogy ? 0 : donationAmount;

    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        await setDoc(doc(db, "users", uid), {
          uid,
          email: emailStr,
          accountType: isPersonal ? "personal" : isInfylogy ? "infylogy_employee" : "business",
          plan: "free",
          perMeetingFee: finalFee,
          donationAmount: finalDonation,
          companyUrl: isPersonal ? "" : companyUrl,
          linksCount: 0,
          bookingsCount: 0,
          createdAt: new Date(),
        });
      }
    } catch (e) {
      console.warn("Skipping real DB save in mock mode.");
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (isPersonalEmail(email)) {
      // Proceed directly to password setup for personal
      setStep(3);
    } else {
      // Prompt for business details and OTP
      setStep(2);
    }
  };

  const handleBusinessOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate URL against email domain
    const emailDomain = getEmailDomain(email);
    const domainFromUrl = extractDomainFromUrl(companyUrl);

    if (emailDomain !== domainFromUrl) {
      setError(`Company URL (${domainFromUrl}) must match your email domain (${emailDomain}).`);
      return;
    }

    if (otp !== expectedOtp) {
      setError("Invalid OTP. Please check your email and try again.");
      return;
    }

    setStep(3);
  };

  const handleSendLiveOtp = async () => {
    setIsSending(true);
    setOtpSent(false);
    setError("");
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setExpectedOtp(data.otp); // Store the generated OTP to check later
        setOtpSent(true);
        alert(`An OTP has been sent to ${email}. Check your inbox!`);
      } else {
        setError("Error sending email: " + data.error);
      }
    } catch (err: any) {
      setError("Network error failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      // Mock signup
      router.push("/onboarding");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await handleCreateUserDocument(userCredential.user.uid, email);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '450px', margin: 'auto' }}>
        <h1 className="heading-lg" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h1>
        
        {error && <div style={{ color: 'white', background: '#ef4444', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        {/* STEP 1: Evaluate Email */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              We'll automatically determine if you are a business or personal user based on your domain.
            </p>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Work or Personal Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Continue</button>
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
              Already have an account? <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Log in</Link>
            </div>
          </form>
        )}

        {/* STEP 2: Business Validation & OTP */}
        {step === 2 && (
          <form onSubmit={handleBusinessOTP} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <strong>Business Domain Detected!</strong> MeetSync is completely free for verified businesses.
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Company Web Address</label>
              <input 
                type="text" 
                placeholder="e.g. yourdomain.com"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Email OTP (Verification Code)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                  required 
                />
                <button 
                  type="button" 
                  onClick={handleSendLiveOtp}
                  disabled={isSending}
                  className="btn-secondary" 
                  style={{ padding: '0.75rem', minWidth: '100px' }}
                >
                  {isSending ? "Sending..." : "Send OTP"}
                </button>
              </div>
              {otpSent && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  A verification code was sent to <strong>{email}</strong>!
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Verify Business</button>
            <button type="button" onClick={() => setStep(1)} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', background: 'none', border: 'none', marginTop: '0.5rem', cursor: 'pointer' }}>Back to Email</button>
          </form>
        )}

        {/* STEP 3: Complete Account Setup */}
        {step === 3 && (
          <form onSubmit={handleFinalSignup} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {isPersonalEmail(email) ? (
               <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--border-radius-md)', marginBottom: '0.5rem' }}>
                 <h3 style={{ color: '#b91c1c', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Personal Email Detected</h3>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                   You registered with <strong>{email}</strong>. Personal accounts are charged a flat rate of <strong>$0.99 per booked meeting</strong>. To use MeetSync completely for free, switch to your company or business email domain.
                 </p>
                 <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => { setStep(1); setEmail(""); }}
                  style={{ width: '100%', marginBottom: '1rem' }}
                 >
                   Use a Business Email instead (Free)
                 </button>
                 <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>- or -</div>
                 <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.5rem' }}>
                   Proceed with personal account ($0.99/meet)
                 </p>
               </div>
            ) : getEmailDomain(email) === 'infylogy.com' ? (
               <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem', marginBottom: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                 <strong>🏢 Infylogy Employee Access:</strong> MeetSync is 100% completely free for all Infylogy employees. Your $0.99 maintenance fee has been permanently waived.
               </div>
            ) : (
               <div style={{ padding: '1rem', background: 'rgba(79, 70, 229, 0.05)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem', marginBottom: '0.5rem', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                 <strong>Business Verification Complete:</strong> MeetSync is essentially free for businesses, but we require a minimum <strong>$0.99 donation</strong> to help us maintain server costs.
                 <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                   <span style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }}>$</span>
                   <input 
                      type="number"
                      min="0.99"
                      step="0.01"
                      placeholder="0.99"
                      value={donationAmount || ""}
                      onChange={(e) => setDonationAmount(parseFloat(e.target.value))}
                      style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 25px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
                   />
                 </div>
               </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>Create a Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                required 
                minLength={6}
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Create Account</button>
          </form>
        )}

      </div>
    </div>
  );
}
