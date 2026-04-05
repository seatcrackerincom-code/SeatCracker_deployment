"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LoginScreen.module.css";
import {
  signInWithGoogle,
  signInEmail,
  signUpEmail,
  sendResetEmail,
  type User,
} from "../lib/firebase";

interface Props {
  onSuccess: (user: User | null) => void; // null = guest
}

type Phase = "choice" | "email";

export default function LoginScreen({ onSuccess }: Props) {
  const [phase, setPhase] = useState<Phase>("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Firebase not configured check
  const firebaseReady = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();
      if (user) {
        onSuccess(user);
      } else {
        setError("Google sign-in was cancelled. Try again.");
      }
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let user;
      if (isSignUp) {
        user = await signUpEmail(email, password);
      } else {
        user = await signInEmail(email, password);
      }
      if (user) onSuccess(user);
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    try {
      await sendResetEmail(email);
      setResetSent(true);
      setError("");
    } catch (err: any) {
      setError("Could not send reset email. Check the address.");
    }
  };

  return (
    <div className={styles.screen}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />




      {/* Card */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoRing}>
            <img src="/logo.png" alt="SeatCracker Logo" className={styles.logoIcon} />
          </div>
          <div className={styles.appName}>
            SEATCRACKER.COM
          </div>
          <div className={styles.tagline}>Crack Your EAMCET. Own Your Seat.</div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "choice" && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.authBtns}>
                {/* Google */}
                <button
                  className={styles.googleBtn}
                  onClick={handleGoogle}
                  disabled={loading || !firebaseReady}
                >
                  {loading ? (
                    <div className={styles.spinner} />
                  ) : (
                    <svg className={styles.googleIcon} viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.8 2.4 30.2 0 24 0 14.6 0 6.5 5.6 2.6 13.8l7.8 6C12.3 13.7 17.7 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.5 24.5c0-1.7-.1-3.3-.4-4.9H24v9.3h12.7c-.6 3-2.3 5.5-4.9 7.2l7.7 6C43.9 38.2 46.5 31.8 46.5 24.5z" />
                      <path fill="#FBBC05" d="M10.4 28.2C9.8 26.5 9.5 24.8 9.5 23s.4-3.5 1-5.1l-7.8-6C1 15 0 19 0 23s1 8 2.6 11.2l7.8-6z" />
                      <path fill="#34A853" d="M24 46c6.2 0 11.4-2 15.2-5.5l-7.7-6c-2.1 1.4-4.7 2.3-7.5 2.3-6.3 0-11.7-4.2-13.6-9.9l-7.8 6C6.5 40.4 14.6 46 24 46z" />
                    </svg>
                  )}
                  {!firebaseReady ? "Set up Firebase to enable Google login" : "Continue with Google"}
                </button>

                {/* Email */}
                <button
                  className={styles.phoneBtn}
                  onClick={() => { setPhase("email"); setError(""); }}
                  disabled={loading || !firebaseReady}
                >
                  📧 Continue with Email
                </button>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.divider}>
                <div className={styles.dividerLine} />
                <span className={styles.dividerText}>or</span>
                <div className={styles.dividerLine} />
              </div>

              {/* Guest */}
              <button className={styles.guestBtn} onClick={() => onSuccess(null)}>
                Continue as Guest (trial starts automatically)
              </button>
            </motion.div>
          )}

          {phase === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <form className={styles.otpSection} onSubmit={handleEmailAuth}>
                <h3 className={styles.formTitle}>
                  {isSignUp ? "Create an Account" : "Welcome Back"}
                </h3>

                <input
                  className={styles.phoneInput}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  className={styles.phoneInput}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && <div className={styles.error}>{error}</div>}

                {resetSent && <div className={styles.success}>Reset email sent! Check your inbox.</div>}

                <button
                  className={styles.verifyBtn}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <div className={styles.spinner} style={{ margin: '0 auto' }} /> : (isSignUp ? "Sign Up 🚀" : "Login 🔓")}
                </button>

                {!isSignUp && (
                  <button
                    type="button"
                    className={styles.forgotPass}
                    onClick={handleReset}
                  >
                    Forgot Password?
                  </button>
                )}

                <div className={styles.formFooter}>
                  <span>{isSignUp ? "Already have an account?" : "Don't have an account?"}</span>
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  >
                    {isSignUp ? "Login" : "Sign Up"}
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.guestBtn}
                  style={{ marginBottom: 0, marginTop: 10 }}
                  onClick={() => { setPhase("choice"); setError(""); }}
                >
                  ← Back
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.footerNote}>
          By continuing, you agree to SeatCracker's Terms of Service.<br />
          Your data is safe and secure.
        </div>
      </motion.div>
    </div>
  );
}
