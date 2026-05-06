"use client";
import React, { useEffect, useState } from "react";
import { useAdminContext } from "./AdminAuthProvider";

export default function PollManager() {
  const { user } = useAdminContext();
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{text: ""}, {text: ""}]);
  const [submitting, setSubmitting] = useState(false);

  const fetchPolls = () => {
    fetch("/api/admin/polls", { headers: { "x-admin-secret": "sc_admin_2024" } })
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        setPolls(data.polls || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.text.trim());
    if (!question.trim() || validOptions.length < 2) {
      alert("Question and at least 2 options are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": "sc_admin_2024" },
        body: JSON.stringify({
          question,
          options: validOptions,
          createdBy: user?.email
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to create poll");
      if (!data) throw new Error("Invalid response");
      setQuestion("");
      setOptions([{text: ""}, {text: ""}]);
      fetchPolls();
    } catch(err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch("/api/admin/polls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": "sc_admin_2024" },
        body: JSON.stringify({ id, is_active: !currentActive })
      });
      fetchPolls();
    } catch (err) {}
  };

  const deletePoll = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/polls?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": "sc_admin_2024" }
      });
      fetchPolls();
    } catch (err) {}
  };

  if (loading) return <div style={{ color: "var(--text-muted)", padding: "20px" }}>Loading polls...</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
      <div className="admin-card">
        <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>Create New Poll</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Question</label>
            <input 
              type="text" value={question} onChange={e => setQuestion(e.target.value)} 
              className="admin-input" placeholder="e.g. Which exam are you focusing on?"
              required
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>Options</label>
            {options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input 
                  type="text" value={opt.text} 
                  onChange={e => {
                    const newOpts = [...options];
                    newOpts[i].text = e.target.value;
                    setOptions(newOpts);
                  }} 
                  className="admin-input" placeholder={`Option ${i+1}`}
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => setOptions(options.filter((_, idx) => idx !== i))} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: "8px", width: "40px", cursor: "pointer" }}>×</button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button type="button" onClick={() => setOptions([...options, {text: ""}])} style={{ background: "transparent", color: "var(--accent)", border: "none", cursor: "pointer", fontSize: "13px", padding: "8px 0" }}>+ Add Option</button>
            )}
          </div>
          <button type="submit" className="admin-btn" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Poll"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: "16px", marginBottom: "20px", fontWeight: 600 }}>All Polls</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {polls.map((poll) => (
            <div key={poll.id} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", background: poll.is_active ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ fontWeight: 600, color: "var(--text)" }}>{poll.question}</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => toggleActive(poll.id, poll.is_active)} style={{ background: poll.is_active ? "#10b981" : "rgba(255,255,255,0.1)", color: poll.is_active ? "#fff" : "var(--text-muted)", border: "none", borderRadius: "6px", padding: "6px 10px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>
                    {poll.is_active ? "ACTIVE" : "INACTIVE"}
                  </button>
                  <button onClick={() => deletePoll(poll.id)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: "6px", padding: "6px 10px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}>Delete</button>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                Created: {new Date(poll.created_at).toLocaleDateString()}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {poll.options.map((o: any, i: number) => (
                  <span key={i} style={{ background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
                    {o.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {polls.length === 0 && <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>No polls created yet.</div>}
        </div>
      </div>
    </div>
  );
}
