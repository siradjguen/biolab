import React from 'react';
 
export default function LabCard({ lab, onClick, showEnroll = false, onEnroll }) {
  return (
    <div className="lab-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={`lab-banner ${lab.banner}`}>{lab.emoji}</div>
      <div className="lab-info">
        <div className="lab-title">{lab.title}</div>
        <div className="lab-meta">
          <span className={`badge ${lab.subColor || 'badge-blue'}`}>{lab.subject}</span>
          <span className="badge badge-gray">{lab.time}</span>
          {lab.level && <span className={`badge ${lab.lvlColor || 'badge-blue'}`}>{lab.level}</span>}
          {lab.due && <span className="badge badge-gray">{lab.due}</span>}
          {lab.score && <span className="badge badge-green">Score: {lab.score}</span>}
        </div>
        {lab.progress !== undefined && (
          <div className="lab-progress">
            <div className="prog-label">
              <span>Progress</span><span>{lab.progress}%</span>
            </div>
            <div className="prog-bar">
              <div className="prog-fill" style={{ width: `${lab.progress}%` }} />
            </div>
          </div>
        )}
        {showEnroll && (
          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%', marginTop: '10px' }}
            onClick={(e) => { e.stopPropagation(); onEnroll && onEnroll(); }}
          >
            Enroll Now
          </button>
        )}
        {!showEnroll && lab.progress !== undefined && lab.progress < 100 && (
          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%', marginTop: '10px' }}
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
          >
            {lab.progress > 0 ? 'Continue →' : 'Start →'}
          </button>
        )}
      </div>
    </div>
  );
}
 