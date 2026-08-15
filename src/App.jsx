import React, { useState, useEffect } from 'react';
import './LabForge.css';
import Auth from './Auth';
import Navbar from './Navbar';
import Home from './Home';
import Dashboard from './Dashboard';
import Workspace from './Workspace';
import AdminDashboard from './AdminDashboard';


export default function LabForge() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [selectedLab, setSelectedLab] = useState(null);
  const [dashTab, setDashTab] = useState('inprog');
  const [wsActiveStep, setWsActiveStep] = useState(2);

  const [titrationVol, setTitrationVol] = useState(0);
  const [endpointReached, setEndpointReached] = useState(false);
  const [phVal, setPhVal] = useState(1.0);
  const [flaskColor, setFlaskColor] = useState('colorless');

  const [quizSelected, setQuizSelected] = useState(null);
  const [reportText, setReportText] = useState('');
  const [showReportFeedback, setShowReportFeedback] = useState(false);

  const [notifText, setNotifText] = useState('');
  const [showNotif, setShowNotif] = useState(false);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Restore session from localStorage token on first load
  useEffect(() => {
    const token = localStorage.getItem('labforge_token');
    if (!token) return;
    fetch('http://localhost:5000/api/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setUser(data.user); if (data.user.role === 'admin' && currentPage === 'home') navigateTo('admin'); })
      .catch(() => localStorage.removeItem('labforge_token')); // token expired/invalid
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') navigateTo('admin');
    else navigateTo('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('labforge_token');
    setUser(null);
    navigateTo('home');
  };

  const triggerNotification = (message) => {
    setNotifText(message);
    setShowNotif(true);
  };

  useEffect(() => {
    if (!showNotif) return;
    const t = setTimeout(() => setShowNotif(false), 2500);
    return () => clearTimeout(t);
  }, [showNotif]);

  const handleAddDrop = () => {
    if (endpointReached) return;
    const nextVol = Math.round((titrationVol + 0.05) * 100) / 100;
    setTitrationVol(nextVol);

    let ph;
    if (nextVol < 24) ph = 1 + nextVol * 0.08;
    else if (nextVol < 24.9) ph = 3 + (nextVol - 24) * 20;
    else if (nextVol < 25.1) ph = 7;
    else ph = 7 + (nextVol - 25) * 6;

    setPhVal(Math.min(ph, 13));

    if (nextVol >= 24.9 && nextVol <= 25.2) {
      setEndpointReached(true);
      setFlaskColor('pink (endpoint!)');
    } else {
      setFlaskColor('colorless');
    }
  };

  const handleResetTitration = () => {
    setTitrationVol(0);
    setEndpointReached(false);
    setPhVal(1.0);
    setFlaskColor('colorless');
  };

  const handleQuizAnswer = (index) => {
    if (quizSelected !== null) return;
    setQuizSelected(index);
  };

  const handleSubmitReport = () => {
    if (reportText.trim().length < 30) {
      alert('Please write a more complete report before submitting.');
      return;
    }
    setShowReportFeedback(true);
  };

  const workspaceProgressPct = Math.round((wsActiveStep / 4) * 100);

  const WS_STEPS = [
    { label: 'Introduction' },
    { label: 'Theory & Safety' },
    { label: 'Simulation' },
    { label: 'Quiz' },
    { label: 'Lab Report' },
  ];

  return (
    <div className="labforge-app">
      <h2 className="sr-only">LabForge — Virtual Lab Platform</h2>

      <div className={`notif${showNotif ? ' show' : ''}`}>{notifText}</div>

      {/* NAV */}
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
        user={user}
        onLogout={handleLogout}
        setAuthMode={setAuthMode}
      />

      {/* HOME */}
      {currentPage === 'home' && (
        <Home navigateTo={navigateTo} />
      )}

      {/* LABS CATALOG */}
      {currentPage === 'labs' && (
        <div className="page">
          <div className="section" style={{ paddingTop: '36px' }}>
            <div className="dash-header">
              <div>
                <div className="section-label">Catalog</div>
                <div className="section-title">All Labs</div>
              </div>
              <div className="filter-row">
                <select className="filter-select">
                  <option>All subjects</option>
                  <option>Chemistry</option>
                  <option>Physics</option>
                  <option>Biology</option>
                  <option>CS</option>
                </select>
                <select className="filter-select">
                  <option>All levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid-3">
              {CATALOG_LABS.map((lab, i) => (
                <div key={i} className="lab-card" onClick={() => triggerNotification(`✓ Enrolled in: ${lab.title}`)}>
                  <div className={`lab-banner ${lab.banner}`}>{lab.emoji}</div>
                  <div className="lab-info">
                    <div className="lab-title">{lab.title}</div>
                    <div className="lab-meta">
                      <span className="badge badge-blue">{lab.subject}</span>
                      <span className="badge badge-gray">{lab.time}</span>
                      <span className={`badge ${lab.lvlColor}`}>{lab.level}</span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', marginTop: '10px' }}
                      onClick={(e) => { e.stopPropagation(); triggerNotification(`✓ Enrolled in: ${lab.title}`); }}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD — protected, login required */}
      {currentPage === 'dashboard' && (
        user
          ? <Dashboard navigateTo={navigateTo} user={user} onOpenLab={(lab) => { setSelectedLab(lab); navigateTo('workspace'); }} />
          : (() => { navigateTo('auth'); setAuthMode('login'); return null; })()
      )}

      {/* WORKSPACE */}
      {currentPage === 'workspace' && (
        <Workspace navigateTo={navigateTo} user={user} lab={selectedLab} />
      )}

      {/* ADMIN */}
      {currentPage === 'admin' && user?.role === 'admin' && (
        <AdminDashboard user={user} navigateTo={navigateTo} />
      )}

      {/* AUTH */}
      {currentPage === 'auth' && (
        <Auth onLoginSuccess={handleLoginSuccess} initialMode={authMode} />
      )}

    </div>
  );
}