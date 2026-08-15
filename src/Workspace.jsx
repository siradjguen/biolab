import React, { useState } from 'react';

const getToken = () => localStorage.getItem('labforge_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

const STEPS = ['Lesson', 'Quiz', 'Lab Report', 'Done'];

// Static lesson slides — same for every lab. Replace src paths with your own images.
const SLIDES = [

  { src: '/lessons/labos.png', caption: 'Slide 1 — Dress code in the lab .' },
      { src: '/lessons/imagi1.jpg', caption: 'slide3 Beaker.' },
  { src: '/lessons/imagi2.jpg', caption: 'Slide 2 — Graduated Cylinder.' },
  { src: '/lessons/imagi4.jpg', caption: 'Slide 3 — erlenmeyer flask.' },
    { src: '/lessons/imagi5.jpg', caption: 'Slide 3 — test tube diagram.' },

  
];

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
  .ws-step-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; cursor:pointer; transition:0.2s; }
  .ws-step-item:hover { background:#f0fdf8; }
  .ws-step-item.active { background:#e0faf4; }
  .ws-step-item.done { opacity:0.6; }
  .ws-dot { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; flex-shrink:0; }
  .ws-dot.done { background:#0cb88a; color:#fff; }
  .ws-dot.active { background:linear-gradient(135deg,#0cb88a,#0891b2); color:#fff; }
  .ws-dot.pending { background:#e2f5ef; color:#9ca3af; }
  .btn-main { background:linear-gradient(135deg,#0cb88a,#0891b2); color:#fff; border:none; border-radius:50px; padding:12px 28px; font-size:15px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-main:hover { opacity:0.9; transform:translateY(-1px); }
  .btn-main:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  .btn-outline { background:transparent; color:#0cb88a; border:2px solid #0cb88a; border-radius:50px; padding:10px 24px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-outline:hover { background:#0cb88a; color:#fff; }
  .quiz-opt { width:100%; text-align:left; padding:14px 18px; border-radius:12px; border:2px solid #e2f5ef; background:#fff; font-size:15px; font-family:inherit; cursor:pointer; transition:0.2s; margin-bottom:10px; font-weight:500; color:#0f2920; }
  .quiz-opt:hover:not(:disabled) { border-color:#0cb88a; background:#f0fdf8; }
  .quiz-opt.correct { border-color:#0cb88a; background:#e0faf4; color:#0cb88a; font-weight:700; }
  .quiz-opt.wrong { border-color:#f87171; background:#fee2e2; color:#dc2626; font-weight:700; }
  .quiz-opt:disabled { cursor:default; }
  .lesson-image-frame { width:100%; aspect-ratio:16/9; border-radius:14px; background:linear-gradient(135deg,#f0fdf8,#eef6ff); border:1.5px solid #e2f5ef; overflow:hidden; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(12,184,138,0.06); }
  .lesson-slide-img { width:100%; height:100%; object-fit:contain; }
  .lesson-image-placeholder { display:flex; flex-direction:column; align-items:center; gap:10px; color:#9bc9bb; }
  .lesson-nav-btn { background:#fff; border:2px solid #e2f5ef; border-radius:50%; width:48px; height:48px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:20px; font-weight:800; color:#0cb88a; transition:0.2s; flex-shrink:0; box-shadow:0 2px 8px rgba(12,184,138,0.08); }
  .lesson-nav-btn:hover:not(:disabled) { background:#0cb88a; border-color:#0cb88a; color:#fff; transform:scale(1.05); }
  .lesson-nav-btn:disabled { opacity:0.3; cursor:not-allowed; }
  .lesson-dot { width:8px; height:8px; border-radius:50%; background:#e2f5ef; transition:0.2s; cursor:pointer; }
  .lesson-dot.active { background:#0cb88a; width:24px; border-radius:4px; }
`;

// ── STEP 0: LESSON ──────────────────────────────────────────────────
function LessonStep({ lab, onNext }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#0cb88a', letterSpacing:1, marginBottom:6 }}>STEP 1 OF 3 — LESSON</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, margin:'0 0 6px', color:'#0f2920' }}>{lab?.labTitle || 'Lab'}</h2>
        <span style={{ background:'#e0faf4', color:'#0cb88a', borderRadius:50, padding:'4px 14px', fontSize:12, fontWeight:700 }}>{lab?.labSubject || 'Biology'}</span>
      </div>

      <div style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:16, padding:20, marginBottom:20 }}>
        <div className="lesson-image-frame">
          <img
            src={slide.src}
            alt={`Slide ${slideIndex + 1}`}
            className="lesson-slide-img"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div className="lesson-image-placeholder" style={{ display:'none' }}>
            <div style={{ fontSize:40 }}>🖼️</div>
            <div style={{ fontSize:13, fontWeight:600 }}>Image not found</div>
            <div style={{ fontSize:11, color:'#c2dcd2' }}>{slide.src}</div>
          </div>
        </div>
        {slide.caption && (
          <p style={{ marginTop:18, fontSize:15, color:'#0f2920', lineHeight:1.7, textAlign:'center', padding:'0 8px' }}>{slide.caption}</p>
        )}
      </div>

      {/* Navigation */}
      <div style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:50, padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, gap:16 }}>
        <button className="lesson-nav-btn" disabled={slideIndex === 0} onClick={() => setSlideIndex(i => i - 1)}>←</button>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div style={{ display:'flex', gap:6 }}>
            {SLIDES.map((_, i) => (
              <div key={i} className={`lesson-dot ${i === slideIndex ? 'active' : ''}`} onClick={() => setSlideIndex(i)} />
            ))}
          </div>
          <span style={{ fontSize:12, color:'#9ca3af', fontWeight:600 }}>{slideIndex + 1} / {SLIDES.length}</span>
        </div>

        <button className="lesson-nav-btn" disabled={isLast} onClick={() => setSlideIndex(i => i + 1)}>→</button>
      </div>

      {isLast ? (
        <button className="btn-main" onClick={onNext} style={{ width:'100%' }}>Done — Start Quiz →</button>
      ) : (
        <button className="btn-outline" onClick={() => setSlideIndex(i => i + 1)} style={{ width:'100%' }}>Next Slide →</button>
      )}
    </div>
  );
}

// ── STEP 1: QUIZ ────────────────────────────────────────────────────
function QuizStep({ lab, onNext }) {
  const questions = lab?.quiz?.questions || [];
  const hasQuestions = questions.length > 0;

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = hasQuestions && Object.keys(answers).length === questions.length;

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.correct).length
    : 0;

  if (!hasQuestions) return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#0cb88a', letterSpacing:1, marginBottom:6 }}>STEP 2 OF 3</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, margin:'0 0 6px', color:'#0f2920' }}>Quiz</h2>
      </div>
      <div style={{ background:'#f8fffd', border:'1.5px dashed #b2edd8', borderRadius:14, padding:32, textAlign:'center', color:'#6b9e8a' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
        <p style={{ fontSize:15, fontWeight:600, margin:'0 0 6px', color:'#0f2920' }}>No quiz attached to this lab</p>
        <p style={{ fontSize:13, margin:'0 0 20px' }}>Your professor hasn't attached a quiz to this assignment yet.</p>
        <button className="btn-main" onClick={() => onNext(null)}>Skip to Lab Report →</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#0cb88a', letterSpacing:1, marginBottom:6 }}>STEP 2 OF 3</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, margin:'0 0 6px', color:'#0f2920' }}>Quiz</h2>
        <p style={{ color:'#6b9e8a', fontSize:14, margin:0 }}>{questions.length} question{questions.length !== 1 ? 's' : ''} — select one answer per question</p>
      </div>

      {questions.map((q, qi) => (
        <div key={qi} style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:16, padding:24, marginBottom:16 }}>
          <p style={{ fontWeight:700, fontSize:15, color:'#0f2920', margin:'0 0 16px' }}>
            <span style={{ color:'#0cb88a' }}>Q{qi + 1}.</span> {q.question}
          </p>
          {q.options.map((opt, oi) => {
            let cls = '';
            if (submitted) {
              if (oi === q.correct) cls = 'correct';
              else if (answers[qi] === oi && oi !== q.correct) cls = 'wrong';
            } else if (answers[qi] === oi) cls = 'correct';
            return (
              <button
                key={oi}
                className={`quiz-opt ${cls}`}
                disabled={submitted}
                onClick={() => !submitted && setAnswers(prev => ({ ...prev, [qi]: oi }))}
              >
                <span style={{ marginRight:10, fontWeight:800, color:'#9ca3af' }}>{String.fromCharCode(65+oi)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      ))}

      {submitted ? (
        <div style={{ background: score === questions.length ? '#e0faf4' : '#fff8e0', border:`1.5px solid ${score === questions.length ? '#0cb88a' : '#fbbf24'}`, borderRadius:16, padding:24, marginBottom:24, textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>{score === questions.length ? '🎉' : '📝'}</div>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, margin:'0 0 6px' }}>
            Score: {score}/{questions.length}
          </h3>
          <p style={{ color:'#6b9e8a', fontSize:14, margin:0 }}>
            {score === questions.length ? 'Perfect score! Proceed to write your lab report.' : 'Good effort. Review the answers above, then proceed to your lab report.'}
          </p>
        </div>
      ) : (
        <button className="btn-main" disabled={!allAnswered} onClick={() => setSubmitted(true)} style={{ marginBottom:16 }}>
          Submit Quiz
        </button>
      )}

      {submitted && (
        <button className="btn-main" onClick={() => onNext(score)}>Continue to Lab Report →</button>
      )}
    </div>
  );
}

// ── STEP 2: LAB REPORT ──────────────────────────────────────────────
function ReportStep({ lab, user, onNext, quizScore }) {
  const [reportText, setReportText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (reportText.trim().length < 50) {
      setError('Please write a more complete report (at least 50 characters).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submit-report`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          labTitle: lab?.labTitle,
          labId: lab?.id,
          group: user?.group,
          reportText,
          quizScore: quizScore !== null && quizScore !== undefined ? quizScore : null,
          quizTotal: lab?.quiz?.questions?.length || null,
        })
      });
      if (!res.ok) throw new Error('Failed to submit report.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#0cb88a', letterSpacing:1, marginBottom:6 }}>STEP 3 OF 3</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, margin:'0 0 6px', color:'#0f2920' }}>Lab Report</h2>
        <p style={{ color:'#6b9e8a', fontSize:14, margin:0 }}>Write your conclusions and observations. This will be sent to your professor.</p>
      </div>

      {quizScore !== null && quizScore !== undefined && (
        <div style={{ background:'#e0faf4', border:'1.5px solid #0cb88a', borderRadius:14, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:24 }}>🎯</span>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:'#0f2920' }}>Quiz Score: {quizScore}/{lab?.quiz?.questions?.length}</div>
            <div style={{ fontSize:12, color:'#5a8070' }}>This score will be sent to your professor with your report.</div>
          </div>
        </div>
      )}
      <div style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:16, padding:24, marginBottom:20 }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, margin:'0 0 6px' }}>📝 Report Guidelines</h3>
        <ul style={{ color:'#6b9e8a', fontSize:14, lineHeight:1.8, margin:0, paddingLeft:20 }}>
          <li>Describe what you observed during the lab</li>
          <li>Explain the biological concepts involved</li>
          <li>State your conclusions and what you learned</li>
        </ul>
      </div>

      {!submitted ? (
        <>
          <textarea
            value={reportText}
            onChange={e => setReportText(e.target.value)}
            placeholder="Write your lab report here..."
            style={{ width:'100%', minHeight:200, padding:'16px', borderRadius:14, border:'1.5px solid #e2f5ef', fontSize:14, fontFamily:'inherit', resize:'vertical', outline:'none', boxSizing:'border-box', color:'#0f2920', lineHeight:1.7 }}
          />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, marginBottom:20 }}>
            <span style={{ fontSize:12, color: reportText.length < 50 ? '#f87171' : '#0cb88a', fontWeight:600 }}>
              {reportText.length} characters {reportText.length < 50 ? `(${50 - reportText.length} more needed)` : '✓'}
            </span>
          </div>
          {error && <p style={{ color:'#dc2626', fontSize:13, marginBottom:12 }}>{error}</p>}
          <button className="btn-main" onClick={handleSubmit} disabled={loading || reportText.trim().length < 50}>
            {loading ? 'Submitting...' : 'Submit Report to Professor →'}
          </button>
        </>
      ) : (
        <div style={{ background:'#e0faf4', border:'1.5px solid #0cb88a', borderRadius:16, padding:28, textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:42, marginBottom:10 }}>✅</div>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, margin:'0 0 6px', color:'#0f2920' }}>Report Submitted!</h3>
          <p style={{ color:'#5a8070', fontSize:14, margin:0 }}>Your professor can now see your lab report in their dashboard.</p>
          <button className="btn-main" onClick={onNext} style={{ marginTop:20 }}>Finish Lab →</button>
        </div>
      )}
    </div>
  );
}

// ── STEP 3: DONE ────────────────────────────────────────────────────
function DoneStep({ lab, navigateTo }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 0' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, margin:'0 0 10px', color:'#0f2920' }}>Lab Complete!</h2>
      <p style={{ color:'#6b9e8a', fontSize:16, marginBottom:32, maxWidth:400, margin:'0 auto 32px' }}>
        You've finished <strong>{lab?.labTitle}</strong>. Your report has been sent to your professor.
      </p>
      <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
        <button className="btn-main" onClick={() => navigateTo('dashboard')}>Back to Dashboard</button>
        <button className="btn-outline" onClick={() => navigateTo('labs')}>Explore More Labs</button>
      </div>
    </div>
  );
}

// ── MAIN WORKSPACE ──────────────────────────────────────────────────
export default function Workspace({ navigateTo, user, lab }) {
  const [step, setStep] = useState(0);
  const [quizScore, setQuizScore] = useState(null);

  const progressPct = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#f8fffd', minHeight:'100vh', color:'#0f2920' }}>
      <style>{sharedStyles}</style>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'70px 24px 80px', display:'grid', gridTemplateColumns:'260px 1fr', gap:32, alignItems:'start' }}>

        {/* SIDEBAR */}
        <div style={{ position:'sticky', top:24, background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:18, padding:24 }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#0cb88a', letterSpacing:1, marginBottom:16 }}>YOUR PROGRESS</div>

          {/* Progress bar */}
          <div style={{ background:'#e2f5ef', borderRadius:50, height:6, marginBottom:20 }}>
            <div style={{ background:'linear-gradient(135deg,#0cb88a,#0891b2)', borderRadius:50, height:6, width:`${progressPct}%`, transition:'width 0.4s ease' }} />
          </div>

          {STEPS.map((label, i) => {
            const status = i < step ? 'done' : i === step ? 'active' : 'pending';
            return (
              <div key={i} className={`ws-step-item ${status}`} onClick={() => i <= step && setStep(i)}>
                <div className={`ws-dot ${status}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize:14, fontWeight: i === step ? 700 : 500, color: i === step ? '#0f2920' : '#6b9e8a' }}>
                  {label}
                </span>
              </div>
            );
          })}

          <div style={{ marginTop:20, paddingTop:20, borderTop:'1.5px solid #e2f5ef', textAlign:'center' }}>
            <span style={{ fontSize:13, fontWeight:700, color:'#0cb88a' }}>{progressPct}% complete</span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:18, padding:36, minHeight:500 }}>
          {step === 0 && <LessonStep lab={lab} onNext={() => setStep(1)} />}
          {step === 1 && <QuizStep lab={lab} onNext={(score) => { setQuizScore(score); setStep(2); }} />}
          {step === 2 && <ReportStep lab={lab} user={user} quizScore={quizScore} onNext={() => setStep(3)} />}
          {step === 3 && <DoneStep lab={lab} navigateTo={navigateTo} />}
        </div>
      </div>
    </div>
  );
}