import React, { useEffect } from 'react';

const FEATURES = [
  { icon: '🔬', title: 'Virtual Microscopy', desc: 'Examine cells, tissues, and organisms at any magnification — from organelles to whole specimens.' },
  { icon: '🤖', title: 'AI Lab Assistant', desc: 'An intelligent tutor that explains biological concepts and guides your experiments step by step.' },
  { icon: '✏️', title: 'Auto-Graded Reports', desc: 'Submit lab reports and get instant rubric-based feedback with specific improvement suggestions.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Monitor your mastery across every lab, unit, and topic in your biology curriculum.' },
  { icon: '🌿', title: 'Ecology Simulations', desc: 'Model ecosystems, population dynamics, and environmental interactions in real time.' },
];

const LABS = [
  { emoji: '🔬', title: 'Cell Mitosis Observation', subject: 'Cell Biology', time: '50 min', level: 'Beginner', color: '#e0faf4' },
  { emoji: '🧬', title: 'DNA Extraction', subject: 'Genetics', time: '55 min', level: 'Intermediate', color: '#e0f0ff' },
  { emoji: '🫀', title: 'Human Circulatory System', subject: 'Anatomy', time: '40 min', level: 'Beginner', color: '#fff0f0' },
  { emoji: '🌱', title: 'Photosynthesis Rate', subject: 'Plant Biology', time: '45 min', level: 'Intermediate', color: '#f0ffe0' },
  { emoji: '🦠', title: 'Bacterial Growth Curves', subject: 'Microbiology', time: '60 min', level: 'Advanced', color: '#fff8e0' },
  { emoji: '🧫', title: 'Cell Membrane Diffusion', subject: 'Cell Biology', time: '35 min', level: 'Beginner', color: '#f0e8ff' },
];

const levelColor = {
  Beginner: '#0cb88a',
  Intermediate: '#0891b2',
  Advanced: '#7c3aed'
};

export default function Home({ navigateTo }) {

  useEffect(() => {
    const els = document.querySelectorAll('.bio-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('bio-visible');
      });
    }, { threshold: 0.1 });

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8fffd', color: '#0f2920' }}>

      {/* INTERNAL STYLES */}
      <style>{`
        .bio-reveal { opacity: 0; transform: translateY(24px); transition: 0.6s ease; }
        .bio-visible { opacity: 1; transform: translateY(0); }

        .lab-card-new {
          background: #fff;
          border-radius: 18px;
          padding: 22px;
          border: 1.5px solid #e2f5ef;
          transition: 0.2s ease;
          cursor: pointer;
        }

        .lab-card-new:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(12,184,138,0.13);
        }

        .feature-card-new {
          background: #fff;
          border-radius: 16px;
          padding: 28px 24px;
          border: 1.5px solid #e2f5ef;
          transition: 0.2s ease;
        }

        .feature-card-new:hover {
          border-color: #0cb88a;
          box-shadow: 0 4px 20px rgba(12,184,138,0.10);
        }

        .btn-main {
          background: linear-gradient(135deg, #0cb88a, #0891b2);
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-outline {
          background: transparent;
          color: #0cb88a;
          border: 2px solid #0cb88a;
          border-radius: 50px;
          padding: 13px 30px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-outline:hover {
          background: #0cb88a;
          color: #fff;
        }
      `}</style>

      {/* HERO */}
      <section style={{
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>

        <div style={{ maxWidth: 750, margin: '0 auto' }}>

          {/* LOGO */}
          <div style={{ marginBottom: 24 }}>
            <img
              src="/logo.jpg"
              alt="BioLab.DZ"
              style={{ height: '88px', width: 'auto', objectFit: 'contain' }}
            />
          </div>


          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#e0faf4,#e0f0ff)',
            border: '1px solid #b2edd8',
            borderRadius: 50,
            padding: '6px 18px',
            fontSize: 13,
            fontWeight: 600,
            color: '#0cb88a',
            marginBottom: 28
          }}>
            🧬 Biology Learning Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20
          }}>
            Biology labs,<br />no lab needed.
          </h1>

          <p style={{
            fontSize: 16,
            color: '#4a7566',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto 40px'
          }}>
            Run real biology experiments from your browser. Dissect, simulate, and discover — at your own pace.
          </p>

          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button className="btn-main" onClick={() => navigateTo('labs')}>
              Explore Labs →
            </button>

            <button className="btn-outline" onClick={() => navigateTo('workspace')}>
              Try Demo
            </button>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '70px 24px', maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0cb88a', letterSpacing: 1.5 }}>
            WHAT YOU GET
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>
            Everything to learn biology properly
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card-new bio-reveal">
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#5a8070', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LABS */}
      <section style={{ padding: '40px 24px 100px', maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 30 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0cb88a' }}>
            TRENDING
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>
            Popular Labs
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18
        }}>
          {LABS.map((lab, i) => (
            <div
              key={i}
              className="lab-card-new bio-reveal"
              onClick={() => navigateTo('workspace')}
            >
              <div style={{
                background: lab.color,
                borderRadius: 12,
                padding: 18,
                fontSize: 36,
                textAlign: 'center',
                marginBottom: 12
              }}>
                {lab.emoji}
              </div>

              <h3 style={{ marginBottom: 8 }}>{lab.title}</h3>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  background: '#e0faf4',
                  color: '#0cb88a',
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 12
                }}>
                  {lab.subject}
                </span>

                <span style={{
                  background: '#f1f5f9',
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 12
                }}>
                  {lab.time}
                </span>

                <span style={{
                  background: levelColor[lab.level] + '20',
                  color: levelColor[lab.level],
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 12
                }}>
                  {lab.level}
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}