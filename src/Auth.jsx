import React, { useState } from 'react';

const GROUPS = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1.5px solid #e2f5ef', fontSize: 14, fontFamily: 'inherit',
  outline: 'none', boxSizing: 'border-box', color: '#0f2920', background: '#fff'
};

const Label = ({ children }) => (
  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#0f2920' }}>{children}</label>
);

const Field = ({ label, children }) => (
  <div>
    <Label>{label}</Label>
    {children}
  </div>
);

export default function Auth({ onLoginSuccess, initialMode = 'login' }) {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [step, setStep] = useState(1); // registration is 2 steps
  const [formData, setFormData] = useState({
    // step 1 — account
    name: '', email: '', password: '', confirmPassword: '', role: 'student',
    // step 2 — profile (student only)
    sex: '', dob: '', studentNumber: '', group: '',
    faculty: '', department: '', speciality: '', year: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const handle = e => set(e.target.name, e.target.value);

  const validateStep1 = () => {
    if (!formData.name) return 'Please enter your name.';
    if (!formData.email) return 'Please enter your email.';

    if (!formData.password) return 'Please enter a password.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.sex) return 'Please select your sex.';
    if (!formData.dob) return 'Please enter your date of birth.';
    if (!formData.studentNumber) return 'Please enter your student number.';
    if (!formData.faculty) return 'Please enter your faculty.';
    if (!formData.department) return 'Please enter your department.';
    if (!formData.speciality) return 'Please enter your speciality.';
    if (!formData.year) return 'Please select your year.';
    if (!formData.group) return 'Please select your group.';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const submitForm = async () => {
    setLoading(true);
    const endpoint = isLoginMode ? 'login' : 'register';
    const payload = isLoginMode
      ? { email: formData.email, password: formData.password }
      : { ...formData };

    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      localStorage.setItem('labforge_token', data.token);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError('');
    await submitForm();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { setError('Please fill in all fields.'); return; }
    await submitForm();
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setStep(1);
    setError('');
    setFormData({ name:'',email:'',password:'',confirmPassword:'',role:'student',sex:'',dob:'',studentNumber:'',group:'',faculty:'',department:'',speciality:'',year:'' });
  };

  const cardBox = { background:'#fff', borderRadius:20, padding:'36px 40px', width:'100%', maxWidth: step === 2 ? 560 : 460, border:'1.5px solid #e2f5ef', boxShadow:'0 8px 40px rgba(12,184,138,0.08)' };

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', padding:'24px', background:'#f8fffd', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <div style={cardBox}>

        {/* HEADER */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🧬</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, margin:'0 0 6px', color:'#0f2920' }}>
            {isLoginMode ? 'Welcome Back' : step === 1 ? 'Create Account' : 'Complete Your Profile'}
          </h2>
          <p style={{ color:'#6b9e8a', fontSize:14, margin:0 }}>
            {isLoginMode ? 'Log in to your LabForge account' : step === 1 ? 'Step 1 of 2 — Account info' : 'Step 2 of 2 — Student details'}
          </p>
          {/* step indicator */}
          {!isLoginMode && (
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:14 }}>
              {[1,2].map(s => (
                <div key={s} style={{ width:32, height:4, borderRadius:4, background: step >= s ? '#0cb88a' : '#e2f5ef', transition:'0.3s' }} />
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{ background:'#fee2e2', color:'#dc2626', padding:'10px 14px', borderRadius:10, marginBottom:20, fontSize:13 }}>
            {error}
          </div>
        )}

        {/* ── LOGIN ── */}
        {isLoginMode && (
          <form onSubmit={handleLoginSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Field label="Email Address">
              <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handle} style={inputStyle} />
            </Field>
            <Field label="Password">
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handle} style={inputStyle} />
            </Field>
            <button type="submit" disabled={loading} style={{ width:'100%', marginTop:4, padding:'13px', background:'linear-gradient(135deg,#0cb88a,#0891b2)', color:'#fff', border:'none', borderRadius:50, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── REGISTER STEP 1 ── */}
        {!isLoginMode && step === 1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Role hidden - students only */}
            {/* Students only - professor accounts created by admin */}

            <Field label="Full Name">
              <input type="text" name="name" placeholder="Your full name" value={formData.name} onChange={handle} style={inputStyle} />
            </Field>
            <Field label="Email Address">
              <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handle} style={inputStyle} />
            </Field>
            <Field label="Password">
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handle} style={inputStyle} />
            </Field>
            <Field label="Confirm Password">
              <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handle} style={inputStyle} />
            </Field>

            <button onClick={handleNext} style={{ width:'100%', marginTop:4, padding:'13px', background:'linear-gradient(135deg,#0cb88a,#0891b2)', color:'#fff', border:'none', borderRadius:50, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              Next →
            </button>
          </div>
        )}

        {/* ── REGISTER STEP 2 (students only) ── */}
        {!isLoginMode && step === 2 && (
          <form onSubmit={handleStep2Submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Sex */}
            <Field label="Sex">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {['Male','Female'].map(s => (
                  <div key={s} onClick={() => set('sex', s)} style={{ border:`2px solid ${formData.sex===s?'#0cb88a':'#e2f5ef'}`, borderRadius:10, padding:'10px', textAlign:'center', cursor:'pointer', background:formData.sex===s?'#e0faf4':'#fff', fontWeight:600, fontSize:14, color:formData.sex===s?'#0cb88a':'#0f2920', transition:'0.2s' }}>
                    {s === 'Male' ? '👨 Male' : '👩 Female'}
                  </div>
                ))}
              </div>
            </Field>

            {/* DOB + Student Number */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Date of Birth">
                <input type="date" name="dob" value={formData.dob} onChange={handle} style={inputStyle} />
              </Field>
              <Field label="Student Number">
                <input type="text" name="studentNumber" placeholder="e.g. 220341" value={formData.studentNumber} onChange={handle} style={inputStyle} />
              </Field>
            </div>

            {/* Faculty + Department */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Faculty">
                <input type="text" name="faculty" placeholder="e.g. Sciences" value={formData.faculty} onChange={handle} style={inputStyle} />
              </Field>
              <Field label="Department">
                <input type="text" name="department" placeholder="e.g. Biology" value={formData.department} onChange={handle} style={inputStyle} />
              </Field>
            </div>

            {/* Speciality */}
            <Field label="Speciality">
              <input type="text" name="speciality" placeholder="e.g. Cellular Biology" value={formData.speciality} onChange={handle} style={inputStyle} />
            </Field>

            {/* Year */}
            <Field label="Academic Year">
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                {['L1','L2','L3','M1','M2'].map(y => (
                  <div key={y} onClick={() => set('year', y)} style={{ border:`2px solid ${formData.year===y?'#0891b2':'#e2f5ef'}`, borderRadius:10, padding:'10px 0', textAlign:'center', cursor:'pointer', background:formData.year===y?'#e0f0ff':'#fff', fontWeight:700, fontSize:14, color:formData.year===y?'#0891b2':'#0f2920', transition:'0.2s' }}>
                    {y}
                  </div>
                ))}
              </div>
            </Field>

            {/* Group */}
            <Field label="Group">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {GROUPS.map(g => (
                  <div key={g} onClick={() => set('group', g)} style={{ border:`2px solid ${formData.group===g?'#0891b2':'#e2f5ef'}`, borderRadius:10, padding:'10px', textAlign:'center', cursor:'pointer', background:formData.group===g?'#e0f0ff':'#fff', fontWeight:600, fontSize:14, color:formData.group===g?'#0891b2':'#0f2920', transition:'0.2s' }}>
                    {g}
                  </div>
                ))}
              </div>
            </Field>

            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <button type="button" onClick={() => { setStep(1); setError(''); }} style={{ flex:1, padding:'13px', background:'transparent', color:'#0cb88a', border:'2px solid #0cb88a', borderRadius:50, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                ← Back
              </button>
              <button type="submit" disabled={loading} style={{ flex:2, padding:'13px', background:'linear-gradient(135deg,#0cb88a,#0891b2)', color:'#fff', border:'none', borderRadius:50, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop:24, textAlign:'center', fontSize:13, color:'#6b9e8a' }}>
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color:'#0cb88a', cursor:'pointer', fontWeight:700 }} onClick={switchMode}>
            {isLoginMode ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}