import React from 'react';
import LabCard from './LabCard';

export default function Catalog({ triggerNotification }) {
  const CATALOG_LABS = [
    { title: 'Acid–Base Titration', banner: 'chem', emoji: '⚗', subject: 'Chemistry', time: '45 min', level: 'Intermediate', lvlColor: 'badge-blue' },
    { title: "Ohm's Law Circuit", banner: 'phys', emoji: '⚡', subject: 'Physics', time: '30 min', level: 'Beginner', lvlColor: 'badge-green' },
    { title: 'Binary Search Tree', banner: 'cs', emoji: '💻', subject: 'CS', time: '60 min', level: 'Intermediate', lvlColor: 'badge-blue' },
    { title: 'Cell Mitosis Observation', banner: 'bio', emoji: '🔬', subject: 'Biology', time: '50 min', level: 'Beginner', lvlColor: 'badge-green' },
    { title: 'Projectile Motion', banner: 'phys', emoji: '🚀', subject: 'Physics', time: '40 min', level: 'Advanced', lvlColor: 'badge-red' },
    { title: 'DNA Extraction', banner: 'bio', emoji: '🧬', subject: 'Biology', time: '55 min', level: 'Intermediate', lvlColor: 'badge-blue' },
  ];

  return (
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
            <LabCard 
              key={i} 
              lab={lab} 
              onClick={() => triggerNotification(`✓ Enrolled in: ${lab.title}`)}
              actionButton={
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: '10px' }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    triggerNotification(`✓ Enrolled in: ${lab.title}`); 
                  }}
                >
                  Enroll Now
                </button>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}