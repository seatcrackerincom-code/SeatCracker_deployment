import re

file_path = r'src\components\EAMCET\RealBattleMode.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add "submit_summary" to phase type
content = content.replace('    | "comingSoon"\n  >("submodeSelection");', '    | "comingSoon"\n    | "submit_summary"\n  >("submodeSelection");')

# 2. Add showRules, hasSeenRules, nowTime states
state_injection = """
  const [showRules, setShowRules] = useState(false);
  const [hasSeenRules, setHasSeenRules] = useState(false);
  const [nowTime, setNowTime] = useState(Date.now());
"""
content = content.replace('const [warningCount, setWarningCount] = useState(0);', state_injection.strip() + '\n  const [warningCount, setWarningCount] = useState(0);')

# 3. Add useEffect for persistence and ticking
persistence_init = """
    const savedRules = localStorage.getItem("sc_battle_rules_seen");
    if (savedRules) setHasSeenRules(true);

    // Detect orientation
"""
content = content.replace('// Detect orientation', persistence_init.strip() + '\n    // Detect orientation')

tick_effect = """
  // Update nowTime every second to keep countdowns live
  useEffect(() => {
    if (phase !== "selection") return;
    const t = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);
"""
content = content.replace('const hasInitialized = useRef(false);', tick_effect.strip() + '\n\n  const hasInitialized = useRef(false);')

# 4. Replace 'const now = Date.now();' with 'const now = nowTime;' in renderSelection
content = content.replace('const prefix = ${statePrefix};\n\n    const now = Date.now();', 'const prefix = ${statePrefix};\n\n    const now = nowTime;')

# 5. Inject RulesOverlay and replace "if (!selectedMock)" logic to show Rules first
rules_overlay = """
      {phase === "selection" && !hasSeenRules && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(10,10,15,0.95)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#1a1b23", border:"1px solid #334155", borderRadius:16, width:"100%", maxWidth:600, padding:"32px" }}>
            <h2 style={{ color:"#fff", fontSize:24, marginBottom:16, borderBottom:"1px solid #334155", paddingBottom:16 }}>Real Battle Mode Rules</h2>
            <ul style={{ color:"#cbd5e1", fontSize:15, lineHeight:1.6, paddingLeft:20, marginBottom:32 }}>
              <li style={{ marginBottom:12 }}><strong>Daily Limit:</strong> You can attempt a maximum of <strong>2 mock tests</strong> per day.</li>
              <li style={{ marginBottom:12 }}><strong>Global Cooldown:</strong> After submitting an exam, there is a strict <strong>3-hour cooldown</strong> before you can unlock the next mock.</li>
              <li style={{ marginBottom:12 }}><strong>Results Processing:</strong> Just like the real exam, results are not immediate. Results and analysis will be released exactly <strong>1 hour</strong> after you submit.</li>
            </ul>
            <button 
              style={{ width:"100%", background:"linear-gradient(90deg, #3b82f6, #2563eb)", color:"#fff", padding:"14px 24px", borderRadius:8, fontSize:16, fontWeight:600, cursor:"pointer", border:"none" }}
              onClick={() => {
                setHasSeenRules(true);
                localStorage.setItem("sc_battle_rules_seen", "true");
              }}
            >
              I Understand. Let's Battle.
            </button>
          </div>
        </div>
      )}
"""
content = content.replace('return (\n      <div className={styles.selectionOverlay}>', rules_overlay.strip() + '\n    return (\n      <div className={styles.selectionOverlay}>')

# 6. Enable Submit button early
submit_disabled = """
          <div className={styles.sidebarFooter}>
            {secs > 0 ? (
              <button className={styles.sidebarSubmitDisabled} disabled title="Submit will be available when the timer reaches 0">Submit</button>
            ) : (
              <button className={styles.sidebarSubmit} onClick={() => setShowSubmitConfirm(true)}>Submit</button>
            )}
          </div>
"""
submit_enabled = """
          <div className={styles.sidebarFooter}>
            <button className={styles.sidebarSubmit} onClick={() => setShowSubmitConfirm(true)}>Submit</button>
          </div>
"""
content = content.replace(submit_disabled.strip(), submit_enabled.strip())

# 7. Update handleBack (Submit Confirm YES) to go to submit_summary instead of failure_cinema/selection
submit_confirm_logic = """
    if (selectedMock) {
      const mockId = selectedMock.toLowerCase().replace(/\s+/g, "_");
      const now = Date.now();
      localStorage.setItem(sc_submit_time_, now.toString());
      localStorage.setItem(sc_responses_, JSON.stringify(responses));
      localStorage.setItem(sc_questions_, JSON.stringify(allQ));
"""
submit_new_logic = """
    setPhase("submit_summary");
"""
# Actually, the user wants us to save the mock, THEN go to submit_summary?
# Wait, handleBack currently calls save() and then goes to selection.
# We should instead go to submit_summary FIRST, and in submit_summary, we provide a button to Return to Dashboard (which then saves and sets phase to selection).
"""

# Let's write the file directly so we don't mess up.
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Phase 1 update complete.")
