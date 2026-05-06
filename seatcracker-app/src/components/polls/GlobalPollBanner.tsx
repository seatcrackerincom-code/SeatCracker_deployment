"use client";
import React, { useEffect, useState } from "react";
import { onAuthChange } from "../../lib/firebase";
import { supabase } from "../../lib/supabase";

export default function GlobalPollBanner() {
  const [poll, setPoll] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [voted, setVoted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check sessionStorage for dismiss
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("poll_dismissed");
      if (isDismissed) setDismissed(true);
    }

    const unsub = onAuthChange((fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        checkActivePoll(fbUser.uid);
      } else {
        checkActivePoll(null);
      }
    });

    return () => unsub();
  }, []);

  const checkActivePoll = async (uid: string | null) => {
    if (!supabase) return;
    try {
      const { data: activePolls } = await supabase.from("polls").select("*").eq("is_active", true).limit(1);
      if (activePolls && activePolls.length > 0) {
        const p = activePolls[0];
        setPoll(p);
        
        if (uid) {
          // Check if voted
          const { data: vote } = await supabase.from("poll_votes").select("id").eq("poll_id", p.id).eq("user_id", uid).single();
          if (vote) {
            setVoted(true);
            fetchResults(p.id);
          }
        }
      }
    } catch (e) {}
  };

  const fetchResults = async (pollId: string) => {
    try {
      const res = await fetch(`/api/polls/vote?pollId=${pollId}`);
      if (!res.ok) return;
      const data = await res.json();
      setResults(data.poll);
    } catch(e) {}
  };

  const handleVote = async (idx: number) => {
    if (!user) {
      alert("Please login to vote!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/polls/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, userId: user.uid, optionIdx: idx })
      });
      if (res.ok) {
        const data = await res.json();
        setVoted(true);
        fetchResults(poll.id);
      }
    } catch(e) {}
    setSubmitting(false);
  };

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("poll_dismissed", "true");
  };

  if (!poll || dismissed) return null;

  return (
    <div style={{ 
      background: "linear-gradient(90deg, #1e1b4b, #312e81)", 
      borderBottom: "1px solid rgba(99, 102, 241, 0.3)",
      padding: "16px", display: "flex", justifyContent: "center", position: "relative"
    }}>
      <button onClick={dismiss} style={{ position: "absolute", right: "16px", top: "16px", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" }}>×</button>
      
      <div style={{ maxWidth: "800px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ fontWeight: 600, fontSize: "16px", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📊</span> {poll.question}
        </div>

        {!voted ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {poll.options.map((opt: any, i: number) => (
              <button 
                key={i} 
                onClick={() => handleVote(i)}
                disabled={submitting}
                style={{ 
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", padding: "8px 16px", borderRadius: "20px", cursor: "pointer",
                  fontSize: "13px", fontWeight: 500, transition: "all 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(99, 102, 241, 0.5)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              >
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          results ? (
            <div style={{ width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {results.results.map((r: any, i: number) => {
                const pct = results.totalVotes ? Math.round((r.votes / results.totalVotes) * 100) : 0;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "#e2e8f0" }}>
                    <div style={{ flex: 1, textAlign: "right", whiteSpace: "nowrap" }}>{r.text}</div>
                    <div style={{ width: "150px", height: "8px", background: "rgba(0,0,0,0.3)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#10b981", borderRadius: "4px" }} />
                    </div>
                    <div style={{ width: "40px" }}>{pct}%</div>
                  </div>
                );
              })}
              <div style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Thanks for voting!</div>
            </div>
          ) : <div style={{ fontSize: "13px", color: "#94a3b8" }}>Loading results...</div>
        )}
      </div>
    </div>
  );
}
