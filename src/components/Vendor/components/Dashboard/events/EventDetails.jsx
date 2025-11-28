import React from 'react';
import './Events.css';

const EventDetails = ({ eventId, name, details }) => {
  if (!details) return null;
  return (
    <div className="vd-eventdetails">
      <div className="vd-eventdetails__section">
        <div className="vd-eventdetails__title">{name || 'Event'}</div>
        <p className="vd-eventdetails__text">{details.description}</p>
      </div>
      <div className="vd-eventdetails__section">
        <div className="vd-eventdetails__title">Reviews</div>
        {!details.reviews?.length && <div className="vd-empty">No reviews yet</div>}
        {details.reviews?.map((r, i) => (
          <div key={i} className="vd-review">
            <div className="vd-review__avatar">{r.user?.[0] || 'U'}</div>
            <div className="vd-review__body">
              <div className="vd-review__head">
                <span className="vd-review__user">{r.user}</span>
                <span className="vd-review__rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <div className="vd-review__comment">{r.comment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventDetails;
