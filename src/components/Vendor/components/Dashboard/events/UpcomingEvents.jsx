import React from 'react';
import './Events.css';

const UpcomingEvents = ({ events = [], onOpen = () => {} }) => {
  return (
    <div className="vd-eventlist">
      {events.map((e) => (
        <div key={e.id} className="vd-event">
          <div className="vd-event__head">
            <div>
              <div className="vd-event__name">{e.name}</div>
              <div className="vd-event__meta">{e.date} • {e.venue}</div>
            </div>
            <button className="vd-event__btn" onClick={() => onOpen(e.id)}>View</button>
          </div>
        </div>
      ))}
      {!events.length && <div className="vd-empty">No upcoming events</div>}
    </div>
  );
};

export default UpcomingEvents;
