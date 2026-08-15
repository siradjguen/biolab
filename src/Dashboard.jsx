import React, { useEffect, useState } from 'react';
import QuizBuilder from './QuizBuilder';

const getToken = () => localStorage.getItem('labforge_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

const GROUPS = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
const levelColor = { Beginner: '#0cb88a', Intermediate: '#0891b2', Advanced: '#7c3aed' };

const sharedStyles = `
  .bio-reveal { opacity: 0; transform: translateY(24px); transition: 0.6s ease; }
  .bio-visible { opacity: 1; transform: translateY(0); }
  .dash-card { background:#fff; border-radius:18px; padding:22px; border:1.5px solid #e2f5ef; transition:0.2s ease; }
  .dash-card:hover { transform:translateY(-3px); box-shadow:0 10px 30px rgba(12,184,138,0.12); }
  .btn-main { background:linear-gradient(135deg,#0cb88a,#0891b2); color:#fff; border:none; border-radius:50px; padding:11px 26px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; }
  .btn-outline { background:transparent; color:#0cb88a; border:2px solid #0cb88a; border-radius:50px; padding:9px 22px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-outline:hover { background:#0cb88a; color:#fff; }
  .btn-danger { background:transparent; color:#dc2626; border:2px solid #fca5a5; border-radius:50px; padding:7px 18px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-danger:hover { background:#fee2e2; }
  .tag { border-radius:20px; padding:3px 12px; font-size:11px; font-weight:700; }
  .field-label { font-size:13px; font-weight:700; color:#0f2920; display:block; margin-bottom:8px; }
  .field-input { width:100%; padding:10px 13px; border-radius:10px; border:1.5px solid #e2f5ef; font-size:14px; font-family:inherit; outline:none; box-sizing:border-box; transition:border 0.15s; }
  .field-input:focus { border-color:#0cb88a; }
  .group-chip { border:2px solid #e2f5ef; border-radius:10px; padding:10px 14px; cursor:pointer; text-align:center; font-weight:700; font-size:14px; color:#0f2920; transition:0.2s; user-select:none; }
  .group-chip.selected { border-color:#0891b2; background:#e0f0ff; color:#0891b2; }
`;

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────
function StudentDashboard({ user, navigateTo, onOpenLab }) {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.group) { setLoading(false); return; }
    fetch(`http://localhost:5000/api/student-labs/${encodeURIComponent(user.group)}`, { headers: authHeaders() })
      .then(r => r.json()).then(data => { setLabs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    const els = document.querySelectorAll('.bio-reveal');
    const obs = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('bio-visible')), { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [labs]);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#f8fffd', minHeight: '100vh', color: '#0f2920' }}>
      <style>{sharedStyles}</style>

      {/* HEADER */}
      <div style={{ padding: '70px 24px 30px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display:'inline-block', background:'#e0faf4', border:'1px solid #b2edd8', borderRadius:50, padding:'4px 14px', fontSize:12, fontWeight:700, color:'#0cb88a', marginBottom:16 }}>
          🎓 {user?.group || 'Student'}
        </div>
        <h1 style={{ fontSize:'clamp(28px,5vw,42px)', fontWeight:800, lineHeight:1.2, margin:'0 0 10px' }}>
          Welcome back, <span style={{ color:'#0cb88a' }}>{user?.name || 'Student'}</span> 👋
        </h1>
        <p style={{ color:'#5a8070', fontSize:16, maxWidth:560, margin:'0 0 24px' }}>
          Your assigned biology practicals are listed below. Complete them before their due dates.
        </p>
        <button className="btn-outline" onClick={() => navigateTo('workspace')}>Open Workspace →</button>
      </div>

      {/* LABS */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'10px 24px 100px' }}>
        {loading ? (
          <p style={{ color:'#6b9e8a' }}>Loading your labs...</p>
        ) : labs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#6b9e8a' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
            <h3 style={{ fontWeight:700 }}>No labs assigned yet</h3>
            <p style={{ fontSize:14 }}>Your professor hasn't assigned any labs to {user?.group} yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#0cb88a', letterSpacing:1 }}>ASSIGNED BY YOUR PROFESSOR</div>
              <h2 style={{ fontSize:24, fontWeight:800, marginTop:4 }}>Your Lab Practicals</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {labs.map((lab, i) => (
                <div key={lab.id} className="dash-card bio-reveal" style={{ transitionDelay:`${i*70}ms`, cursor:'pointer' }} onClick={() => onOpenLab(lab)}>
                  <div style={{ background: lab.labColor || '#e0faf4', borderRadius:12, padding:16, fontSize:36, textAlign:'center', marginBottom:14 }}>{lab.labEmoji || '🔬'}</div>
                  <h3 style={{ fontWeight:700, fontSize:17, margin:'0 0 8px' }}>{lab.labTitle}</h3>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                    {lab.labSubject && <span className="tag" style={{ background:'#e0faf4', color:'#0cb88a' }}>{lab.labSubject}</span>}
                    {lab.labTime && <span className="tag" style={{ background:'#f0f4f8', color:'#6b7280' }}>{lab.labTime}</span>}
                    {lab.labLevel && <span className="tag" style={{ background: (levelColor[lab.labLevel]||'#6b7280')+'20', color: levelColor[lab.labLevel]||'#6b7280' }}>{lab.labLevel}</span>}
                  </div>
                  {lab.dueDate && (
                    <p style={{ fontSize:13, color:'#5a8070', margin:'8px 0 0' }}>📅 Due: <strong style={{ color:'#0f2920' }}>{lab.dueDate}</strong></p>
                  )}
                  <button className="btn-main" style={{ width:'100%', marginTop:14 }} onClick={e => { e.stopPropagation(); onOpenLab(lab); }}>
                    Start Lab →
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PROFESSOR DASHBOARD ──────────────────────────────────────────────
function ProfessorDashboard({ user, navigateTo }) {
  const [assignedLabs, setAssignedLabs] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState('labs');
  const [quizzes, setQuizzes] = useState([]);
  const [editingLab, setEditingLab] = useState(null);
  const [reports, setReports] = useState([]);

  // ── assign form state ──
  const [labName, setLabName] = useState('');
  const [labSubject, setLabSubject] = useState('');
  const [labLevel, setLabLevel] = useState('');
  const [labTime, setLabTime] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch('http://localhost:5000/api/professor-labs', { headers: authHeaders() })
      .then(r => r.json()).then(setAssignedLabs).catch(() => {});
    fetch('http://localhost:5000/api/students', { headers: authHeaders() })
      .then(r => r.json()).then(setStudents).catch(() => {});
    fetch('http://localhost:5000/api/reports', { headers: authHeaders() })
      .then(r => r.json()).then(setReports).catch(() => {});
    fetch('http://localhost:5000/api/quizzes', { headers: authHeaders() })
      .then(r => r.json()).then(setQuizzes).catch(() => {});
  }, [user]);

  const toggleGroup = (g) => {
    setSelectedGroups(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };

  const resetModal = () => {
    setLabName('');
    setLabSubject('');
    setLabLevel('');
    setLabTime('');
    setSelectedGroups([]);
    setDueDate('');
    setSelectedQuiz(null);
    setShowAssignModal(false);
  };

  const handleAssign = async () => {
    if (!labName.trim() || selectedGroups.length === 0) return;

    // Fire one assignment per selected group
    const promises = selectedGroups.map(group => {
      const payload = {
        labTitle: labName.trim(),
        labEmoji: '🔬',
        labSubject: labSubject.trim() || null,
        labLevel: labLevel || null,
        labTime: labTime.trim() || null,
        labColor: '#e0faf4',
        group,
        dueDate: dueDate || null,
        quizId: selectedQuiz?.id || null,
        quiz: selectedQuiz || null,
      };
      return fetch('http://localhost:5000/api/assign-lab', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(payload)
      }).then(r => r.json());
    });

    const newLabs = await Promise.all(promises);
    setAssignedLabs(prev => [...prev, ...newLabs]);
    resetModal();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/assign-lab/${id}`, { method: 'DELETE', headers: authHeaders() });
    setAssignedLabs(prev => prev.filter(l => l.id !== id));
  };

  const handleAttachQuiz = async (labId, quiz) => {
    const res = await fetch(`http://localhost:5000/api/assign-lab/${labId}/quiz`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ quizId: quiz?.id || null, quiz: quiz || null })
    });
    if (!res.ok) return;
    const updated = await res.json();
    setAssignedLabs(prev => prev.map(l => l.id === updated.id ? updated : l));
    setEditingLab(null);
  };

  const canAssign = labName.trim().length > 0 && selectedGroups.length > 0;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#f8fffd', minHeight:'100vh', color:'#0f2920' }}>
      <style>{sharedStyles}</style>

      {/* HEADER */}
      <div style={{ padding:'70px 24px 30px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', background:'#e0f0ff', border:'1px solid #bfdbfe', borderRadius:50, padding:'4px 14px', fontSize:12, fontWeight:700, color:'#0891b2', marginBottom:16 }}>
          👩‍🏫 Professor View
        </div>
        <h1 style={{ fontSize:'clamp(28px,5vw,42px)', fontWeight:800, lineHeight:1.2, margin:'0 0 10px' }}>
          Hello, <span style={{ color:'#0891b2' }}>{user?.name || 'Professor'}</span> 👋
        </h1>
        <p style={{ color:'#5a8070', fontSize:16, maxWidth:560, margin:'0 0 24px' }}>
          Assign biology labs to your student groups and track their progress.
        </p>
        <button className="btn-main" onClick={() => setShowAssignModal(true)}>+ Assign Lab to Group</button>
      </div>

      {/* TABS */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ display:'flex', gap:8, marginBottom:28, borderBottom:'2px solid #e2f5ef', paddingBottom:0 }}>
          {[['labs','Assigned Labs'], ['students','My Students'], ['reports','Reports'], ['quizzes','Quiz Builder']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              background:'none', border:'none', cursor:'pointer', fontFamily:'inherit',
              fontSize:15, fontWeight:700, padding:'10px 18px',
              color: activeTab === key ? '#0cb88a' : '#6b9e8a',
              borderBottom: activeTab === key ? '3px solid #0cb88a' : '3px solid transparent',
              marginBottom:-2, transition:'0.2s'
            }}>{label}</button>
          ))}
        </div>

        {/* ASSIGNED LABS TAB */}
        {activeTab === 'labs' && (
          <div style={{ paddingBottom:80 }}>
            {assignedLabs.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'#6b9e8a' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
                <h3 style={{ fontWeight:700 }}>No labs assigned yet</h3>
                <p style={{ fontSize:14 }}>Click "+ Assign Lab to Group" to get started.</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
                {assignedLabs.map((lab, i) => (
                  <div key={lab.id} className="dash-card bio-reveal" style={{ transitionDelay:`${i*70}ms` }}>
                    <div style={{ background: lab.labColor || '#e0faf4', borderRadius:12, padding:16, fontSize:36, textAlign:'center', marginBottom:14 }}>{lab.labEmoji || '🔬'}</div>
                    <h3 style={{ fontWeight:700, fontSize:16, margin:'0 0 8px' }}>{lab.labTitle}</h3>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                      {lab.labSubject && <span className="tag" style={{ background:'#e0faf4', color:'#0cb88a' }}>{lab.labSubject}</span>}
                      <span className="tag" style={{ background:'#e0f0ff', color:'#0891b2' }}>{lab.group}</span>
                      {lab.labTime && <span className="tag" style={{ background:'#f0f4f8', color:'#6b7280' }}>{lab.labTime}</span>}
                    </div>
                    {lab.dueDate && <p style={{ fontSize:12, color:'#5a8070', margin:'4px 0 10px' }}>📅 Due: <strong>{lab.dueDate}</strong></p>}
                    <p style={{ fontSize:11, color:'#9ca3af', margin:'0 0 12px' }}>
                      Assigned {new Date(lab.assignedAt).toLocaleDateString()}
                    </p>
                    <div style={{ marginBottom:10 }}>
                      {lab.quiz
                        ? <span style={{ background:'#e0faf4', color:'#0cb88a', borderRadius:50, padding:'4px 12px', fontSize:12, fontWeight:700 }}>✅ Quiz: {lab.quiz.title}</span>
                        : <span style={{ background:'#fff8e0', color:'#c97c00', borderRadius:50, padding:'4px 12px', fontSize:12, fontWeight:700 }}>⚠️ No quiz attached</span>
                      }
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn-outline" style={{ flex:1, padding:'7px 10px', fontSize:12 }} onClick={() => setEditingLab(lab)}>
                        🔗 {lab.quiz ? 'Change Quiz' : 'Attach Quiz'}
                      </button>
                      <button className="btn-danger" onClick={() => handleDelete(lab.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div style={{ paddingBottom:80 }}>
            {GROUPS.map(group => {
              const groupStudents = students.filter(s => s.group === group);
              return (
                <div key={group} style={{ marginBottom:36 }}>
                  <h3 style={{ fontWeight:800, fontSize:18, margin:'0 0 14px', color:'#0f2920' }}>
                    {group} <span style={{ fontSize:13, color:'#6b9e8a', fontWeight:500 }}>({groupStudents.length} students)</span>
                  </h3>
                  {groupStudents.length === 0 ? (
                    <p style={{ fontSize:14, color:'#9ca3af' }}>No students in this group yet.</p>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
                      {groupStudents.map(s => (
                        <div key={s.id} style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#0cb88a,#0891b2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0 }}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                            <div style={{ fontSize:12, color:'#6b9e8a' }}>{s.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div style={{ paddingBottom:80 }}>
            {reports.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'#6b9e8a' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
                <h3 style={{ fontWeight:700 }}>No reports submitted yet</h3>
                <p style={{ fontSize:14 }}>Student reports will appear here once submitted.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {reports.map(r => (
                  <div key={r.id} style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:16, padding:24 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:16 }}>
                      <div>
                        <h3 style={{ fontWeight:800, fontSize:17, margin:'0 0 6px' }}>{r.labTitle}</h3>
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                          <span style={{ background:'#e0faf4', color:'#0cb88a', borderRadius:50, padding:'3px 12px', fontSize:12, fontWeight:700 }}>👤 {r.studentName}</span>
                          <span style={{ background:'#e0f0ff', color:'#0891b2', borderRadius:50, padding:'3px 12px', fontSize:12, fontWeight:700 }}>{r.group}</span>
                          <span style={{ background:'#f0f4f8', color:'#6b7280', borderRadius:50, padding:'3px 12px', fontSize:12, fontWeight:500 }}>📅 {new Date(r.submittedAt).toLocaleDateString()}</span>
                          {r.quizScore !== null && r.quizScore !== undefined && (
                            <span style={{ background: r.quizScore === r.quizTotal ? '#e0faf4' : r.quizScore >= r.quizTotal/2 ? '#fff8e0' : '#fee2e2', color: r.quizScore === r.quizTotal ? '#0cb88a' : r.quizScore >= r.quizTotal/2 ? '#c97c00' : '#dc2626', borderRadius:50, padding:'3px 12px', fontSize:12, fontWeight:700 }}>
                              🎯 Quiz: {r.quizScore}/{r.quizTotal}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ background:'#f8fffd', border:'1.5px solid #e2f5ef', borderRadius:12, padding:16, fontSize:14, color:'#0f2920', lineHeight:1.7, whiteSpace:'pre-wrap' }}>
                      {r.reportText}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUIZ BUILDER TAB */}
        {activeTab === 'quizzes' && (
          <div style={{ paddingBottom:80 }}>
            <QuizBuilder user={user} />
          </div>
        )}
      </div>

      {/* ATTACH QUIZ MODAL */}
      {editingLab && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:36, width:'100%', maxWidth:480, maxHeight:'85vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, margin:'0 0 4px' }}>Attach Quiz</h2>
            <p style={{ color:'#6b9e8a', fontSize:14, margin:'0 0 20px' }}>
              Lab: <strong style={{ color:'#0f2920' }}>{editingLab.labTitle}</strong> — {editingLab.group}
            </p>

            {quizzes.length === 0 ? (
              <div style={{ background:'#f8fffd', border:'1.5px dashed #b2edd8', borderRadius:12, padding:24, textAlign:'center', color:'#6b9e8a', marginBottom:20 }}>
                <p style={{ fontSize:14, margin:0 }}>No quizzes yet. Go to the Quiz Builder tab to create one first.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
                <div
                  onClick={() => handleAttachQuiz(editingLab.id, null)}
                  style={{ border:`2px solid ${!editingLab.quiz ? '#0cb88a' : '#e2f5ef'}`, borderRadius:10, padding:'10px 14px', cursor:'pointer', background:!editingLab.quiz?'#e0faf4':'#fff', fontSize:13, fontWeight:600, color:!editingLab.quiz?'#0cb88a':'#6b7280', transition:'0.2s' }}
                >
                  No quiz
                </div>
                {quizzes.map(q => (
                  <div key={q.id}
                    onClick={() => handleAttachQuiz(editingLab.id, q)}
                    style={{ border:`2px solid ${editingLab.quiz?.id === q.id ? '#0cb88a' : '#e2f5ef'}`, borderRadius:10, padding:'12px 14px', cursor:'pointer', background:editingLab.quiz?.id === q.id?'#e0faf4':'#fff', transition:'0.2s' }}
                  >
                    <div style={{ fontWeight:700, fontSize:14, color:'#0f2920' }}>{q.title}</div>
                    <div style={{ fontSize:12, color:'#6b9e8a', marginTop:2 }}>{q.questions.length} question{q.questions.length !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-outline" style={{ width:'100%' }} onClick={() => setEditingLab(null)}>Close</button>
          </div>
        </div>
      )}

      {/* ASSIGN MODAL */}
      {showAssignModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:36, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontWeight:800, fontSize:22, margin:'0 0 6px' }}>Assign a Lab</h2>
            <p style={{ color:'#6b9e8a', fontSize:14, margin:'0 0 28px' }}>Fill in the lab details and choose which groups receive it.</p>

            {/* LAB NAME */}
            <label className="field-label">Lab Name <span style={{ color:'#dc2626' }}>*</span></label>
            <input
              className="field-input"
              placeholder="e.g. Cell Mitosis Observation"
              value={labName}
              onChange={e => setLabName(e.target.value)}
              style={{ marginBottom:18 }}
            />

            {/* SUBJECT */}
            <label className="field-label">Subject <span style={{ color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
            <input
              className="field-input"
              placeholder="e.g. Cell Biology"
              value={labSubject}
              onChange={e => setLabSubject(e.target.value)}
              style={{ marginBottom:18 }}
            />

            {/* LEVEL + TIME side by side */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
              <div>
                <label className="field-label">Level <span style={{ color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
                <select
                  className="field-input"
                  value={labLevel}
                  onChange={e => setLabLevel(e.target.value)}
                  style={{ background:'#fff', cursor:'pointer' }}
                >
                  <option value="">— select —</option>
                  <option value="Beginner">L1</option>
                  <option value="Intermediate">L2</option>
                  <option value="Advanced">L3</option>
                </select>
              </div>
              <div>
                <label className="field-label">Duration <span style={{ color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
                <input
                  className="field-input"
                  placeholder="e.g. 45 min"
                  value={labTime}
                  onChange={e => setLabTime(e.target.value)}
                />
              </div>
            </div>

            {/* GROUPS (multi-select) */}
            <label className="field-label">
              Assign to Groups <span style={{ color:'#dc2626' }}>*</span>
              {selectedGroups.length > 0 && (
                <span style={{ fontWeight:500, color:'#0891b2', marginLeft:8 }}>
                  {selectedGroups.length} selected
                </span>
              )}
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
              {GROUPS.map(g => (
                <div
                  key={g}
                  className={`group-chip${selectedGroups.includes(g) ? ' selected' : ''}`}
                  onClick={() => toggleGroup(g)}
                >
                  {selectedGroups.includes(g) && <span style={{ marginRight:6 }}>✓</span>}
                  {g}
                </div>
              ))}
            </div>

            {/* QUIZ PICKER */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <label className="field-label" style={{ margin:0 }}>Attach a Quiz <span style={{ color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
              <button
                style={{ fontSize:12, fontWeight:700, color:'#0891b2', background:'#e0f0ff', border:'none', borderRadius:50, padding:'4px 12px', cursor:'pointer', fontFamily:'inherit' }}
                onClick={() => { setActiveTab('quizzes'); resetModal(); }}
              >
                + Build New Quiz
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
              <div
                onClick={() => setSelectedQuiz(null)}
                style={{ border:`2px solid ${!selectedQuiz ? '#0cb88a' : '#e2f5ef'}`, borderRadius:10, padding:'10px 14px', cursor:'pointer', background:!selectedQuiz?'#e0faf4':'#fff', fontSize:13, fontWeight:600, color:!selectedQuiz?'#0cb88a':'#6b7280', transition:'0.2s' }}
              >
                No quiz
              </div>
              {quizzes.length === 0
                ? <p style={{ fontSize:13, color:'#9ca3af', margin:'4px 0 0' }}>No quizzes yet — click "Build New Quiz" above.</p>
                : quizzes.map(q => (
                  <div key={q.id} onClick={() => setSelectedQuiz(q)}
                    style={{ border:`2px solid ${selectedQuiz?.id === q.id ? '#0cb88a' : '#e2f5ef'}`, borderRadius:10, padding:'12px 14px', cursor:'pointer', background:selectedQuiz?.id === q.id?'#e0faf4':'#fff', transition:'0.2s' }}
                  >
                    <div style={{ fontWeight:700, fontSize:14, color:'#0f2920' }}>{q.title}</div>
                    <div style={{ fontSize:12, color:'#6b9e8a', marginTop:2 }}>{q.questions.length} question{q.questions.length !== 1 ? 's' : ''}</div>
                  </div>
                ))
              }
            </div>

            {/* DUE DATE */}
            <label className="field-label">Due Date <span style={{ color:'#9ca3af', fontWeight:400 }}>(optional)</span></label>
            <input
              type="date"
              className="field-input"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{ marginBottom:28 }}
            />

            <div style={{ display:'flex', gap:10 }}>
              <button
                className="btn-main"
                style={{ flex:1, opacity: canAssign ? 1 : 0.5, cursor: canAssign ? 'pointer' : 'not-allowed' }}
                onClick={handleAssign}
                disabled={!canAssign}
              >
                Assign Lab{selectedGroups.length > 1 ? ` to ${selectedGroups.length} Groups` : ''}
              </button>
              <button className="btn-outline" style={{ flex:1 }} onClick={resetModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROUTER ───────────────────────────────────────────────────────────
export default function Dashboard({ navigateTo, user, onOpenLab }) {
  if (user?.role === 'professor') return <ProfessorDashboard user={user} navigateTo={navigateTo} />;
  return <StudentDashboard user={user} navigateTo={navigateTo} onOpenLab={onOpenLab} />;
}