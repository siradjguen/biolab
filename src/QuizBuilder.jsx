import React, { useState, useEffect } from 'react';

const getToken = () => localStorage.getItem('labforge_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

const API = 'http://localhost:5000';

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid #e2f5ef', fontSize: 14, fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box', color: '#0f2920', background: '#fff'
};

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
  .qb-card { background:#fff; border-radius:16px; padding:24px; border:1.5px solid #e2f5ef; margin-bottom:16px; }
  .qb-opt-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .qb-correct-dot { width:20px; height:20px; border-radius:50%; border:2px solid #e2f5ef; cursor:pointer; flex-shrink:0; transition:0.2s; }
  .qb-correct-dot.selected { background:#0cb88a; border-color:#0cb88a; }
  .btn-main { background:linear-gradient(135deg,#0cb88a,#0891b2); color:#fff; border:none; border-radius:50px; padding:11px 26px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-main:hover { opacity:0.9; }
  .btn-main:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-outline { background:transparent; color:#0cb88a; border:2px solid #0cb88a; border-radius:50px; padding:9px 22px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-outline:hover { background:#0cb88a; color:#fff; }
  .btn-ghost { background:transparent; color:#9ca3af; border:1.5px solid #e2f5ef; border-radius:50px; padding:7px 16px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-ghost:hover { border-color:#f87171; color:#dc2626; }
  .btn-danger { background:transparent; color:#dc2626; border:1.5px solid #fca5a5; border-radius:8px; padding:5px 12px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-danger:hover { background:#fee2e2; }
`;

const emptyQuestion = () => ({
  id: Date.now() + Math.random(),
  question: '',
  options: ['', '', '', ''],
  correct: 0,
});

export default function QuizBuilder({ user, onBack }) {
  const [quizzes, setQuizzes] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [editing, setEditing] = useState(null); // quiz being edited

  // ── form state ──
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`${API}/api/quizzes`, { headers: authHeaders() })
      .then(r => r.json()).then(setQuizzes).catch(() => {});
  }, []);

  const resetForm = () => {
    setTitle('');
    setQuestions([emptyQuestion()]);
    setEditing(null);
    setError('');
    setSuccess('');
  };

  const openCreate = () => { resetForm(); setView('create'); };

  const openEdit = (quiz) => {
    setTitle(quiz.title);
    setQuestions(quiz.questions.map(q => ({ ...q, id: q.id || Date.now() + Math.random() })));
    setEditing(quiz);
    setError('');
    setSuccess('');
    setView('edit');
  };

  // ── question mutations ──
  const setQuestion = (id, val) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, question: val } : q));

  const setOption = (id, oi, val) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, options: q.options.map((o, i) => i === oi ? val : o) } : q));

  const setCorrect = (id, oi) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, correct: oi } : q));

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()]);

  const removeQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // ── save ──
  const handleSave = async () => {
    if (!title.trim()) { setError('Please enter a quiz title.'); return; }
    for (const q of questions) {
      if (!q.question.trim()) { setError('All questions must have text.'); return; }
      if (q.options.some(o => !o.trim())) { setError('All answer options must be filled in.'); return; }
    }
    setError('');
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing
        ? `${API}/api/quizzes/${editing.id}`
        : `${API}/api/quizzes`;
      const res = await fetch(url, {
        method, headers: authHeaders(),
        body: JSON.stringify({ title, questions })
      });
      if (!res.ok) throw new Error('Failed to save quiz.');
      const saved = await res.json();
      if (editing) {
        setQuizzes(prev => prev.map(q => q.id === saved.id ? saved : q));
      } else {
        setQuizzes(prev => [...prev, saved]);
      }
      setSuccess(editing ? 'Quiz updated!' : 'Quiz created!');
      setTimeout(() => { setView('list'); resetForm(); }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/api/quizzes/${id}`, { method: 'DELETE', headers: authHeaders() });
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:'#0f2920' }}>
      <style>{sharedStyles}</style>

      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:'#0cb88a', letterSpacing:1, marginBottom:4 }}>QUIZ MANAGEMENT</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, margin:0 }}>
            {view === 'list' ? 'My Quizzes' : view === 'create' ? 'Create Quiz' : 'Edit Quiz'}
          </h2>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {view !== 'list' && (
            <button className="btn-outline" onClick={() => { setView('list'); resetForm(); }}>← Back</button>
          )}
          {view === 'list' && (
            <button className="btn-main" onClick={openCreate}>+ New Quiz</button>
          )}
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <>
          {quizzes.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#6b9e8a' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🧪</div>
              <h3 style={{ fontWeight:700, margin:'0 0 8px' }}>No quizzes yet</h3>
              <p style={{ fontSize:14, margin:'0 0 24px' }}>Create your first quiz to attach to lab assignments.</p>
              <button className="btn-main" onClick={openCreate}>+ Create Quiz</button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
              {quizzes.map(quiz => (
                <div key={quiz.id} className="qb-card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, margin:'0 0 6px' }}>{quiz.title}</h3>
                    <div style={{ display:'flex', gap:8 }}>
                      <span style={{ background:'#e0faf4', color:'#0cb88a', borderRadius:50, padding:'3px 12px', fontSize:12, fontWeight:700 }}>
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                      </span>
                      <span style={{ background:'#f0f4f8', color:'#6b7280', borderRadius:50, padding:'3px 12px', fontSize:12, fontWeight:500 }}>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {/* question preview */}
                  <div style={{ background:'#f8fffd', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#5a8070' }}>
                    <strong style={{ color:'#0f2920' }}>Q1:</strong> {quiz.questions[0]?.question || '—'}
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:4 }}>
                    <button className="btn-outline" style={{ flex:1, padding:'8px' }} onClick={() => openEdit(quiz)}>✏️ Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(quiz.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── CREATE / EDIT VIEW ── */}
      {(view === 'create' || view === 'edit') && (
        <div style={{ maxWidth:720 }}>
          {/* Quiz title */}
          <div className="qb-card">
            <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:8 }}>Quiz Title</label>
            <input style={inputStyle} placeholder="e.g. Cell Biology Quiz" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          {/* Questions */}
          {questions.map((q, qi) => (
            <div key={q.id} className="qb-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <span style={{ fontSize:12, fontWeight:700, color:'#0cb88a', letterSpacing:1 }}>QUESTION {qi + 1}</span>
                {questions.length > 1 && (
                  <button className="btn-danger" onClick={() => removeQuestion(q.id)}>Remove</button>
                )}
              </div>

              {/* Question text */}
              <textarea
                style={{ ...inputStyle, minHeight:72, resize:'vertical', marginBottom:16 }}
                placeholder="Enter your question..."
                value={q.question}
                onChange={e => setQuestion(q.id, e.target.value)}
              />

              {/* Options */}
              <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#6b9e8a', marginBottom:10, letterSpacing:0.5 }}>
                OPTIONS — click the circle to mark the correct answer
              </label>
              {q.options.map((opt, oi) => (
                <div key={oi} className="qb-opt-row">
                  <div
                    className={`qb-correct-dot ${q.correct === oi ? 'selected' : ''}`}
                    onClick={() => setCorrect(q.id, oi)}
                    title="Mark as correct answer"
                  />
                  <span style={{ fontSize:13, fontWeight:700, color:'#9ca3af', width:20 }}>{String.fromCharCode(65 + oi)}.</span>
                  <input
                    style={{ ...inputStyle, flex:1 }}
                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                    value={opt}
                    onChange={e => setOption(q.id, oi, e.target.value)}
                  />
                </div>
              ))}
              <p style={{ fontSize:12, color:'#6b9e8a', margin:'8px 0 0' }}>
                ✅ Correct answer: <strong style={{ color:'#0cb88a' }}>Option {String.fromCharCode(65 + q.correct)}</strong>
              </p>
            </div>
          ))}

          {/* Add question */}
          <button className="btn-outline" onClick={addQuestion} style={{ width:'100%', marginBottom:20, padding:'12px' }}>
            + Add Question
          </button>

          {error && <p style={{ color:'#dc2626', fontSize:13, marginBottom:12 }}>{error}</p>}
          {success && <p style={{ color:'#0cb88a', fontSize:13, fontWeight:700, marginBottom:12 }}>✓ {success}</p>}

          <button className="btn-main" onClick={handleSave} disabled={saving} style={{ width:'100%', padding:'14px' }}>
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Save Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}