import React from 'react';
import './Events.css';

const EventCard = ({ e, onOpen, compact }) => (
  <div className={`vd-event ${compact ? 'vd-event--compact' : ''}`}>
    <div className="vd-event__head">
      <div>
        <div className="vd-event__name">{e.name}</div>
        <div className="vd-event__meta">{e.date} • {e.venue}</div>
      </div>
      {!compact && (
        <button className="vd-event__btn" onClick={() => onOpen(e.id)}>View</button>
      )}
    </div>
    <div className="vd-event__bar">
      <div className="vd-event__bar__fill" style={{ width: `${e.progress || 0}%` }} />
    </div>
    {compact && (
      <button className="vd-event__btn" onClick={() => onOpen(e.id)}>Open</button>
    )}
  </div>
);

const OngoingEvents = ({ events = [], onOpen = () => {}, compact = false }) => {
  return (
    <div className="vd-eventlist">
      {events.map((e) => <EventCard key={e.id} e={e} onOpen={onOpen} compact={compact} />)}
      {!events.length && <div className="vd-empty">No events</div>}
    </div>
  );
};

export default OngoingEvents;
