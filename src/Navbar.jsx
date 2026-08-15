import React, { useState, useEffect } from 'react';

export default function Navbar({ currentPage, navigateTo, user, onLogout, setAuthMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getPages = () => {
    if (!user) return ['home', 'labs'];
    if (user.role === 'admin') return ['admin'];
    if (user.role === 'professor') return ['home', 'dashboard'];
    return ['home', 'dashboard', 'labs'];
  };

  const labels = {
    home: 'Home',
    labs: 'Labs',
    dashboard: 'Dashboard',
    admin: 'Admin Panel',
    workspace: 'Workspace',
  };

  const roleConfig = {
    admin:     { label: 'Admin',     icon: '⚡', pill: '#7c3aed', pillBg: '#f3e8ff' },
    professor: { label: 'Professor', icon: '👩‍🏫', pill: '#0891b2', pillBg: '#e0f0ff' },
    student:   { label: 'Student',   icon: '🎓', pill: '#0cb88a', pillBg: '#e0faf4' },
  };

  const role = user ? (roleConfig[user.role] || roleConfig.student) : null;
  const pages = getPages();

  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 999,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.25s ease',
    background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderBottom: scrolled ? '1.5px solid #e2f5ef' : '1.5px solid transparent',
    boxShadow: scrolled ? '0 2px 20px rgba(12,184,138,0.08)' : 'none',
  };

  const innerStyle = {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px',
    height: 62,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  };

  const logoStyle = {
    fontWeight: 800,
    fontSize: 20,
    cursor: 'pointer',
    letterSpacing: '-0.5px',
    color: '#0f2920',
    userSelect: 'none',
    flexShrink: 0,
  };

  const linkBase = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeight: 600,
    padding: '6px 14px',
    borderRadius: 50,
    transition: 'all 0.18s',
    color: '#5a8070',
  };

  const linkActive = {
    ...linkBase,
    background: 'linear-gradient(135deg,#0cb88a18,#0891b218)',
    color: '#0cb88a',
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap');
    .nb-link:hover { background: #f0fdf9 !important; color: #0cb88a !important; }
    .nb-logout { background:#fff5f5; color:#dc2626; border:1.5px solid #fca5a5; border-radius:50px; padding:6px 16px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; transition:0.18s; }
    .nb-logout:hover { border-color:#ef4444; color:#b91c1c; background:#fee2e2; }
    .nb-login { background:transparent; color:#0f2920; border:1.5px solid #d1d5db; border-radius:50px; padding:6px 16px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; transition:0.18s; }
    .nb-login:hover { border-color:#0cb88a; color:#0cb88a; }
    .nb-signup { background:linear-gradient(135deg,#0cb88a,#0891b2); color:#fff; border:none; border-radius:50px; padding:7px 18px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; transition:0.18s; box-shadow:0 2px 10px rgba(12,184,138,0.25); }
    .nb-signup:hover { opacity:0.88; transform:translateY(-1px); }
    .nb-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:6px; border:none; background:none; }
    .nb-hamburger span { display:block; width:22px; height:2px; background:#0f2920; border-radius:2px; transition:0.2s; }
    .nb-mobile { display:none; position:fixed; top:62px; left:0; right:0; background:rgba(255,255,255,0.97); backdrop-filter:blur(14px); border-bottom:1.5px solid #e2f5ef; padding:16px 24px 24px; flex-direction:column; gap:8px; z-index:998; }
    .nb-mobile.open { display:flex; }
    .nb-mobile-link { background:none; border:none; cursor:pointer; font-family:inherit; font-size:15px; font-weight:600; padding:11px 16px; border-radius:12px; text-align:left; color:#5a8070; transition:0.15s; }
    .nb-mobile-link:hover, .nb-mobile-link.active { background:#e0faf4; color:#0cb88a; }
    .nb-mobile-divider { height:1px; background:#e2f5ef; margin:8px 0; }
    @media (max-width: 680px) {
      .nb-desktop-links { display:none !important; }
      .nb-desktop-right { display:none !important; }
      .nb-hamburger { display:flex !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <nav style={navStyle}>
        <div style={innerStyle}>
          {/* LOGO */}
          <div
            style={logoStyle}
            onClick={() => { navigateTo(user?.role === 'admin' ? 'admin' : 'home'); setMobileOpen(false); }}
          >
            biolab<span style={{ color: '#0cb88a' }}>dz</span>
            {role && (
              <span style={{
                marginLeft: 10, fontSize: 11, fontWeight: 700,
                background: role.pillBg, color: role.pill,
                borderRadius: 50, padding: '2px 9px',
                verticalAlign: 'middle', letterSpacing: 0.3,
              }}>
                {role.icon} {role.label}
              </span>
            )}
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="nb-desktop-links" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {pages.map(page => (
              <button
                key={page}
                className="nb-link"
                style={currentPage === page ? linkActive : linkBase}
                onClick={() => navigateTo(page)}
              >
                {currentPage === page && (
                  <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#0cb88a', marginRight:6, verticalAlign:'middle', marginTop:-2 }} />
                )}
                {labels[page] || page}
              </button>
            ))}
          </div>

          {/* DESKTOP RIGHT */}
          <div className="nb-desktop-right" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {user ? (
              <>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f2920', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <button className="nb-logout" onClick={onLogout}>Log out</button>
              </>
            ) : (
              <>
                <button className="nb-login" onClick={() => { setAuthMode('login'); navigateTo('auth'); }}>Log in</button>
                <button className="nb-signup" onClick={() => { setAuthMode('signup'); navigateTo('auth'); }}>Get Started</button>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button className="nb-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`nb-mobile${mobileOpen ? ' open' : ''}`}>
        {pages.map(page => (
          <button
            key={page}
            className={`nb-mobile-link${currentPage === page ? ' active' : ''}`}
            onClick={() => { navigateTo(page); setMobileOpen(false); }}
          >
            {labels[page] || page}
          </button>
        ))}
        <div className="nb-mobile-divider" />
        {user ? (
          <>
            <div style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#0f2920' }}>
              {role?.icon} {user.name}
            </div>
            <button className="nb-logout" style={{ width: '100%', textAlign: 'left', borderRadius: 12, padding: '11px 16px' }} onClick={() => { onLogout(); setMobileOpen(false); }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <button className="nb-login" style={{ width: '100%', textAlign: 'left', borderRadius: 12, padding: '11px 16px' }} onClick={() => { setAuthMode('login'); navigateTo('auth'); setMobileOpen(false); }}>
              Log in
            </button>
            <button className="nb-signup" style={{ width: '100%', textAlign: 'center', borderRadius: 12, padding: '11px 16px', marginTop: 4 }} onClick={() => { setAuthMode('signup'); navigateTo('auth'); setMobileOpen(false); }}>
              Get Started
            </button>
          </>
        )}
      </div>

      {/* Spacer so content doesn't hide under fixed nav */}
      <div style={{ height: 62 }} />
    </>
  );
}