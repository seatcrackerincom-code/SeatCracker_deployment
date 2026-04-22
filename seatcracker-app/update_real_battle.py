import re

file_path = r'src\components\EAMCET\RealBattleMode.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Phase Types
code = code.replace('    | "comingSoon"\n  >("submodeSelection");', '    | "comingSoon"\n    | "submit_summary"\n  >("submodeSelection");')

# 2. Add New States
state_insert = '''  const [showRules, setShowRules] = useState(false);
  const [hasSeenRules, setHasSeenRules] = useState(false);
  const [nowTime, setNowTime] = useState(Date.now());
  const [warningCount, setWarningCount] = useState(0);'''
code = code.replace('  const [warningCount, setWarningCount] = useState(0);', state_insert)

# 3. Add persistence init for rules
rules_init = '''    const savedRules = localStorage.getItem("sc_battle_rules_seen");
    if (savedRules) setHasSeenRules(true);

    // Detect orientation'''
code = code.replace('    // Detect orientation', rules_init)

# 4. Add useEffect for ticking clock
ticking_effect = '''  // Update nowTime every second to keep countdowns live
  useEffect(() => {
    if (phase !== "selection") return;
    const t = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const hasInitialized = useRef(false);'''
code = code.replace('  const hasInitialized = useRef(false);', ticking_effect)

# 5. HandleSubmit function to replace handleBack in the "Yes, Submit" button
handle_submit_func = '''
  const handleSubmitExam = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
    // Save submission data for results & cooldown
    if (selectedMock) {
      const mockId = selectedMock.toLowerCase().replace(/\s+/g, "_");
      const submitNow = Date.now();
      localStorage.setItem(sc_submit_time_, submitNow.toString());
      localStorage.setItem(sc_responses_, JSON.stringify(responses));
      localStorage.setItem(sc_questions_, JSON.stringify(allQ));
      localStorage.setItem(sc_mock_completed_, "true");
      // Global cooldown: track last submission time
      const prevSubmits = JSON.parse(localStorage.getItem("sc_daily_submits") || "[]");
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const todaySubmits = prevSubmits.filter((t: number) => t > todayStart.getTime());
      todaySubmits.push(submitNow);
      localStorage.setItem("sc_daily_submits", JSON.stringify(todaySubmits));
      localStorage.setItem("sc_last_submit_time", submitNow.toString());
    }
    // Clear persisted exam state
    localStorage.removeItem("sc_battle_phase");
    localStorage.removeItem("sc_battle_secs");
    localStorage.removeItem("sc_battle_mock");
    setShowSubmitConfirm(false);
    setPhase("submit_summary");
  }, [selectedMock, responses, allQ]);

  const handleBack = useCallback(() => {'''
code = code.replace('  const handleBack = useCallback(() => {', handle_submit_func)

# 6. Change the "Yes, Submit" button to use handleSubmitExam
code = code.replace('onClick={handleBack}>Yes, Submit</button>', 'onClick={handleSubmitExam}>Yes, Submit</button>')

# 7. Make the Submit Sidebar Button always clickable
sidebar_submit_old = '''          <div className={styles.sidebarFooter}>
            {secs > 0 ? (
              <button className={styles.sidebarSubmitDisabled} disabled title="Submit will be available when the timer reaches 0">Submit</button>
            ) : (
              <button className={styles.sidebarSubmit} onClick={() => setShowSubmitConfirm(true)}>Submit</button>
            )}
          </div>'''
sidebar_submit_new = '''          <div className={styles.sidebarFooter}>
            <button className={styles.sidebarSubmit} onClick={() => setShowSubmitConfirm(true)}>Submit</button>
          </div>'''
code = code.replace(sidebar_submit_old, sidebar_submit_new)

# 8. Update nowTime in selection
code = code.replace('const now = Date.now();\n    const COOLDOWN_MS', 'const now = nowTime;\n    const COOLDOWN_MS')

# 9. Inject RulesOverlay into renderSelection
render_selection_overlay_old = '''    return (
      <div className={styles.selectionOverlay}>
        {renderBackground()}'''
render_selection_overlay_new = '''    return (
      <div className={styles.selectionOverlay}>
        {!hasSeenRules && (
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
        {renderBackground()}'''
code = code.replace(render_selection_overlay_old, render_selection_overlay_new)

# 10. Create renderSubmitSummary
render_submit_summary = '''
  const renderSubmitSummary = () => {
    return (
      <div className={styles.selectionOverlay} style={{ display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
        {renderBackground()}
        <div style={{ background:"#1a1b23", border:"1px solid #334155", borderRadius:16, padding:40, textAlign:"center", maxWidth:500, zIndex:10 }}>
          <h1 style={{ color:"#4ade80", fontSize:28, marginBottom:16 }}>Exam Submitted Successfully!</h1>
          <p style={{ color:"#94a3b8", fontSize:15, marginBottom:24 }}>Your responses have been securely saved.</p>
          
          <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:12, padding:20, marginBottom:32, display:"flex", justifyContent:"space-around" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:"#10b981", fontSize:24, fontWeight:"bold" }}>{answered}</div>
              <div style={{ color:"#64748b", fontSize:12, textTransform:"uppercase" }}>Answered</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:"#ef4444", fontSize:24, fontWeight:"bold" }}>{notAns}</div>
              <div style={{ color:"#64748b", fontSize:12, textTransform:"uppercase" }}>Not Answered</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ color:"#cbd5e1", fontSize:24, fontWeight:"bold" }}>{notVisit}</div>
              <div style={{ color:"#64748b", fontSize:12, textTransform:"uppercase" }}>Not Visited</div>
            </div>
          </div>

          <div style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.3)", borderRadius:8, padding:16, color:"#93c5fd", fontSize:14, marginBottom:24 }}>
            ?? Results and detailed analysis will be released in exactly <strong>1 Hour</strong>.
          </div>

          <button 
            style={{ width:"100%", background:"#3b82f6", color:"#fff", border:"none", padding:"14px 24px", borderRadius:8, fontSize:16, fontWeight:"bold", cursor:"pointer" }}
            onClick={() => setPhase("selection")}
          >
            Return to Mock Selection
          </button>
        </div>
      </div>
    );
  };
'''
code = code.replace('const renderSelection = () => {', render_submit_summary + '\n  const renderSelection = () => {')

# 11. Add phase to main render block
main_render_old = '''  return (
    <div className={styles.examConsole}>
      { /* Submit confirmation dialog */}'''
main_render_new = '''  if (phase === "submit_summary") return renderSubmitSummary();

  return (
    <div className={styles.examConsole}>
      { /* Submit confirmation dialog */}'''
code = code.replace(main_render_old, main_render_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Update completed successfully.")
