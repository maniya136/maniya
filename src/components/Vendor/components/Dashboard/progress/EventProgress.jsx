import React from 'react';
import './EventProgress.css';

const steps = ['Planning', 'Vendors', 'Logistics', 'Execution'];

const EventProgress = ({ value = 0 }) => {
  return (
    <div className="vd-progress">
      <div className="vd-progress__header">
        <div className="vd-progress__title">Progress</div>
        <div className="vd-progress__val">{value}%</div>
      </div>
      <div className="vd-progress__bar">
        <div className="vd-progress__fill" style={{ width: `${value}%` }} />
      </div>
      <div className="vd-progress__steps">
        {steps.map((s, i) => (
          <div key={s} className={`vd-progress__step ${value >= ((i + 1) * 25) ? 'is-done' : ''}`}>
            <span className="vd-progress__dot" />
            <span className="vd-progress__label">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventProgress;
