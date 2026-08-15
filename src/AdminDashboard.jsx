import React, { useState, useEffect } from 'react';

const getToken = () => localStorage.getItem('labforge_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

const GROUPS = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
const SUBJECTS = ['Cell Biology', 'Genetics', 'Microbiology', 'Anatomy', 'Plant Biology', 'Ecology'];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
  .ad-card { background:#fff; border-radius:16px; padding:24px; border:1.5px solid #e2f5ef; margin-bottom:16px; }
  .ad-card:hover { box-shadow: 0 8px 24px rgba(12,184,138,0.10); }
  .btn-main { background:linear-gradient(135deg,#0cb88a,#0891b2); color:#fff; border:none; border-radius:50px; padding:11px 26px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-main:hover { opacity:0.9; }
  .btn-main:disabled { opacity:0.5; cursor:not-allowed; }
  .btn-outline { background:transparent; color:#0cb88a; border:2px solid #0cb88a; border-radius:50px; padding:9px 22px; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.2s; }
  .btn-outline:hover { background:#0cb88a; color:#fff; }
  .btn-danger { background:transparent; color:#dc2626; border:1.5px solid #fca5a5; border-radius:8px; padding:5px 14px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; }
  .btn-danger:hover { background:#fee2e2; }
  .tag { border-radius:20px; padding:3px 12px; font-size:11px; font-weight:700; }
  .inp { width:100%; padding:10px 14px; borderRadius:10px; border:1.5px solid #e2f5ef; fontSize:14px; fontFamily:inherit; outline:none; boxSizing:border-box; color:#0f2920; background:#fff; border-radius:10px; }
`;

const inputStyle = { width:'100%', padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2f5ef', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box', color:'#0f2920', background:'#fff' };
const Label = ({ children }) => <label style={{ display:'block', fontSize:13, fontWeight:700, marginBottom:6, color:'#0f2920' }}>{children}</label>;

export default function AdminDashboard({ user, navigateTo }) {
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [profForm, setProfForm] = useState({ name:'', email:'', password:'' });
  const [newProfCreds, setNewProfCreds] = useState(null);
  const [profError, setProfError] = useState('');
  const [profSaving, setProfSaving] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // form state
  const [form, setForm] = useState({ title:'', subject:'', durationMonths:'', professorId:'', groups:[] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/courses', { headers: authHeaders() })
      .then(r => r.json()).then(setCourses).catch(() => {});
    fetch('http://localhost:5000/api/admin/professors', { headers: authHeaders() })
      .then(r => r.json()).then(setProfessors).catch(() => {});
    fetch('http://localhost:5000/api/students', { headers: authHeaders() })
      .then(r => r.json()).then(setStudents).catch(() => {});
  }, []);

  const resetForm = () => {
    setForm({ title:'', subject:'', durationMonths:'', professorId:'', groups:[] });
    setEditingCourse(null);
    setError('');
  };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const handleCreateProfessor = async () => {
    if (!profForm.name || !profForm.email || !profForm.password) { setProfError('All fields required.'); return; }
    setProfSaving(true); setProfError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/professors', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(profForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfessors(prev => [...prev, data]);
      setNewProfCreds({ name: profForm.name, email: profForm.email, password: profForm.password });
      setProfForm({ name:'', email:'', password:'' });
    } catch(err) { setProfError(err.message); }
    finally { setProfSaving(false); }
  };

  const openEdit = (course) => {
    setForm({
      title: course.title,
      subject: course.subject,
      durationMonths: course.durationMonths,
      professorId: String(course.professorId || ''),
      groups: course.groups || [],
    });
    setEditingCourse(course);
    setShowModal(true);
  };

  const toggleGroup = (g) => setForm(prev => ({
    ...prev,
    groups: prev.groups.includes(g) ? prev.groups.filter(x => x !== g) : [...prev.groups, g]
  }));

  const handleSave = async () => {
    if (!form.title || !form.subject || !form.durationMonths || !form.professorId || !form.groups.length) {
      setError('Please fill in all fields and select at least one group.'); return;
    }
    setSaving(true);
    try {
      const method = editingCourse ? 'PUT' : 'POST';
      const url = editingCourse
        ? `http://localhost:5000/api/admin/courses/${editingCourse.id}`
        : 'http://localhost:5000/api/admin/courses';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to save.');
      const saved = await res.json();
      if (editingCourse) setCourses(prev => prev.map(c => c.id === saved.id ? saved : c));
      else setCourses(prev => [...prev, saved]);
      setShowModal(false);
      resetForm();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? Students will lose access.')) return;
    await fetch(`http://localhost:5000/api/admin/courses/${id}`, { method:'DELETE', headers: authHeaders() });
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const getProfessorName = (id) => professors.find(p => String(p.id) === String(id))?.name || '—';
  const getGroupStudents = (group) => students.filter(s => s.group === group).length;

  const TABS = [['courses','Courses'], ['professors','Professors'], ['students','All Students']];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#f8fffd', minHeight:'100vh', color:'#0f2920' }}>
      <style>{styles}</style>

      {/* HEADER */}
      <div style={{ padding:'70px 24px 30px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'inline-block', background:'linear-gradient(135deg,#0f2920,#0cb88a)', borderRadius:50, padding:'4px 16px', fontSize:12, fontWeight:700, color:'#fff', marginBottom:16 }}>
          ⚡ Super Admin
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(28px,5vw,40px)', fontWeight:800, margin:'0 0 8px' }}>
          Admin Dashboard
        </h1>
        <p style={{ color:'#5a8070', fontSize:16, margin:'0 0 24px' }}>
          Manage courses, assign professors, and oversee the platform.
        </p>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn-main" onClick={openCreate}>+ Create Course</button>
          <button className="btn-outline" onClick={() => { setShowProfModal(true); setNewProfCreds(null); setProfError(''); }}>+ Add Professor</button>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
          {[
            ['📚', courses.length, 'Courses'],
            ['👩‍🏫', professors.length, 'Professors'],
            ['🎓', students.length, 'Students'],
            ['👥', GROUPS.length, 'Groups'],
          ].map(([icon, val, label]) => (
            <div key={label} style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:4 }}>{icon}</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, color:'#0cb88a' }}>{val}</div>
              <div style={{ fontSize:12, color:'#6b9e8a', fontWeight:600 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:'2px solid #e2f5ef' }}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              background:'none', border:'none', cursor:'pointer', fontFamily:'inherit',
              fontSize:15, fontWeight:700, padding:'10px 18px',
              color: tab === key ? '#0cb88a' : '#6b9e8a',
              borderBottom: tab === key ? '3px solid #0cb88a' : '3px solid transparent',
              marginBottom:-2, transition:'0.2s'
            }}>{label}</button>
          ))}
        </div>

        {/* COURSES TAB */}
        {tab === 'courses' && (
          courses.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#6b9e8a' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📚</div>
              <h3 style={{ fontWeight:700 }}>No courses yet</h3>
              <p style={{ fontSize:14, marginBottom:20 }}>Create your first course and assign it to a professor.</p>
              <button className="btn-main" onClick={openCreate}>+ Create Course</button>
          <button className="btn-outline" onClick={() => { setShowProfModal(true); setNewProfCreds(null); setProfError(''); }}>+ Add Professor</button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
              {courses.map(course => (
                <div key={course.id} className="ad-card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                    <div>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, margin:'0 0 4px' }}>{course.title}</h3>
                      <span style={{ background:'#e0faf4', color:'#0cb88a' }} className="tag">{course.subject}</span>
                    </div>
                    <span style={{ background:'#e0f0ff', color:'#0891b2' }} className="tag">{course.durationMonths} months</span>
                  </div>

                  <div style={{ fontSize:13, color:'#5a8070', marginBottom:10 }}>
                    👩‍🏫 <strong style={{ color:'#0f2920' }}>{getProfessorName(course.professorId)}</strong>
                  </div>

                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
                    {(course.groups || []).map(g => (
                      <span key={g} style={{ background:'#f0f4f8', color:'#0f2920', borderRadius:50, padding:'3px 10px', fontSize:11, fontWeight:600 }}>
                        {g} ({getGroupStudents(g)} students)
                      </span>
                    ))}
                  </div>

                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn-outline" style={{ flex:1, padding:'8px' }} onClick={() => openEdit(course)}>✏️ Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(course.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* PROFESSORS TAB */}
        {tab === 'professors' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {professors.length === 0
              ? <p style={{ color:'#9ca3af' }}>No professors registered yet.</p>
              : professors.map(p => {
                const assignedCourse = courses.find(c => String(c.professorId) === String(p.id));
                return (
                  <div key={p.id} className="ad-card">
                    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#0cb88a,#0891b2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:18, flexShrink:0 }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15 }}>{p.name}</div>
                        <div style={{ fontSize:12, color:'#6b9e8a' }}>{p.email}</div>
                      </div>
                    </div>
                    {assignedCourse
                      ? <span style={{ background:'#e0faf4', color:'#0cb88a' }} className="tag">📚 {assignedCourse.title}</span>
                      : <span style={{ background:'#f0f4f8', color:'#9ca3af' }} className="tag">No course assigned</span>
                    }
                  </div>
                );
              })
            }
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === 'students' && (
          <div>
            {GROUPS.map(group => {
              const gs = students.filter(s => s.group === group);
              const course = courses.find(c => (c.groups || []).includes(group));
              return (
                <div key={group} style={{ marginBottom:32 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                    <h3 style={{ fontWeight:800, fontSize:17, margin:0 }}>{group}</h3>
                    {course
                      ? <span style={{ background:'#e0faf4', color:'#0cb88a' }} className="tag">📚 {course.title}</span>
                      : <span style={{ background:'#fff8e0', color:'#c97c00' }} className="tag">⚠️ No course</span>
                    }
                    <span style={{ fontSize:12, color:'#6b9e8a' }}>({gs.length} students)</span>
                  </div>
                  {gs.length === 0
                    ? <p style={{ fontSize:13, color:'#9ca3af' }}>No students in this group yet.</p>
                    : (
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
                        {gs.map(s => (
                          <div key={s.id} style={{ background:'#fff', border:'1.5px solid #e2f5ef', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#0cb88a,#0891b2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:13, flexShrink:0 }}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight:700, fontSize:13 }}>{s.name}</div>
                              <div style={{ fontSize:11, color:'#6b9e8a' }}>{s.year} · {s.speciality || s.department || '—'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE PROFESSOR MODAL */}
      {showProfModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:36, width:'100%', maxWidth:440, boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, margin:'0 0 6px' }}>Add Professor</h2>
            <p style={{ color:'#6b9e8a', fontSize:14, margin:'0 0 24px' }}>Create an account then share credentials manually.</p>

            {newProfCreds ? (
              <div>
                <div style={{ background:'#e0faf4', border:'1.5px solid #0cb88a', borderRadius:14, padding:20, marginBottom:20 }}>
                  <p style={{ fontWeight:700, color:'#0f2920', margin:'0 0 12px' }}>✅ Account created! Share these credentials:</p>
                  <div style={{ fontSize:14, lineHeight:2 }}>
                    <div>👤 <strong>Name:</strong> {newProfCreds.name}</div>
                    <div>📧 <strong>Email:</strong> {newProfCreds.email}</div>
                    <div>🔑 <strong>Password:</strong> <code style={{ background:'#f0f4f8', padding:'2px 8px', borderRadius:6 }}>{newProfCreds.password}</code></div>
                  </div>
                </div>
                <button className="btn-main" style={{ width:'100%' }} onClick={() => { setShowProfModal(false); setNewProfCreds(null); }}>Done</button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div><Label>Full Name</Label><input style={inputStyle} placeholder="Dr. Smith" value={profForm.name} onChange={e => setProfForm(p => ({...p, name:e.target.value}))} /></div>
                <div><Label>Email</Label><input type="email" style={inputStyle} placeholder="professor@uni.dz" value={profForm.email} onChange={e => setProfForm(p => ({...p, email:e.target.value}))} /></div>
                <div><Label>Temporary Password</Label><input style={inputStyle} placeholder="Give them a temp password" value={profForm.password} onChange={e => setProfForm(p => ({...p, password:e.target.value}))} /></div>
                {profError && <p style={{ color:'#dc2626', fontSize:13, margin:0 }}>{profError}</p>}
                <div style={{ display:'flex', gap:10 }}>
                  <button className="btn-main" style={{ flex:1 }} onClick={handleCreateProfessor} disabled={profSaving}>{profSaving ? 'Creating...' : 'Create Account'}</button>
                  <button className="btn-outline" style={{ flex:1 }} onClick={() => setShowProfModal(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:36, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, margin:'0 0 6px' }}>
              {editingCourse ? 'Edit Course' : 'Create Course'}
            </h2>
            <p style={{ color:'#6b9e8a', fontSize:14, margin:'0 0 24px' }}>Fill in the details below.</p>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <Label>Course Title</Label>
                <input style={inputStyle} placeholder="e.g. Introduction to Cell Biology" value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} />
              </div>

              <div>
                <Label>Subject</Label>
                <select style={inputStyle} value={form.subject} onChange={e => setForm(p => ({...p, subject:e.target.value}))}>
                  <option value="">Select subject...</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <Label>Duration (months)</Label>
                <input type="number" min="1" max="24" style={inputStyle} placeholder="e.g. 4" value={form.durationMonths} onChange={e => setForm(p => ({...p, durationMonths:e.target.value}))} />
              </div>

              <div>
                <Label>Assign Professor</Label>
                <select style={inputStyle} value={form.professorId} onChange={e => setForm(p => ({...p, professorId:e.target.value}))}>
                  <option value="">Select professor...</option>
                  {professors.map(p => <option key={p.id} value={p.id}>{p.name} — {p.email}</option>)}
                </select>
              </div>

              <div>
                <Label>Assign Groups</Label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {GROUPS.map(g => (
                    <div key={g} onClick={() => toggleGroup(g)} style={{ border:`2px solid ${form.groups.includes(g) ? '#0891b2' : '#e2f5ef'}`, borderRadius:10, padding:'10px', textAlign:'center', cursor:'pointer', background:form.groups.includes(g)?'#e0f0ff':'#fff', fontWeight:700, fontSize:14, color:form.groups.includes(g)?'#0891b2':'#0f2920', transition:'0.2s' }}>
                      {g}
                    </div>
                  ))}
                </div>
              </div>

              {error && <p style={{ color:'#dc2626', fontSize:13, margin:0 }}>{error}</p>}

              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <button className="btn-main" style={{ flex:1 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
                <button className="btn-outline" style={{ flex:1 }} onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}