import React, { useState } from 'react';
import './PastEventsCarousel.css';

const defaultImagesByCategory = {
  Wedding: ['Aisle decor', 'Couple entry', 'Reception stage', 'Family portraits', 'First dance'],
  'Corporate Party': ['Stage setup', 'Networking', 'Keynote moment', 'Team huddle', 'Awards night'],
  'Food Festival': ['Food stalls', 'Crowd', 'Live cooking', 'Dessert lane', 'Beverage bar'],
  'Birthday Party': ['Cake cutting', 'Decor', 'Games', 'Photo booth', 'Return gifts'],
};

export const PastEventsCarousel = ({ events }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const handleCardClick = (event) => {
    setActiveEvent(event);
  };

  const closeOverlay = () => {
    setActiveEvent(null);
    setActivePhotoIndex(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const imagesForEvent = (event) => {
    if (!event) return [];
    const base = defaultImagesByCategory[event.category] || ['Highlight 1', 'Highlight 2', 'Highlight 3'];
    return base.map((label, index) => ({ id: index, label }));
  };

  const openPhotoDetail = (index) => {
    setActivePhotoIndex(index);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const closePhotoDetail = () => {
    setActivePhotoIndex(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const showNextPhoto = () => {
    if (!activeEvent) return;
    const total = imagesForEvent(activeEvent).length;
    setActivePhotoIndex((prev) => (prev + 1) % total);
  };

  const showPrevPhoto = () => {
    if (!activeEvent) return;
    const total = imagesForEvent(activeEvent).length;
    setActivePhotoIndex((prev) => (prev - 1 + total) % total);
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.5));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 1));

  const handleMouseDown = (e) => {
    if (zoom === 1) return;
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <>
      <div className="past-carousel">
        <div className="past-track">
          {events.map((event) => (
            <article
              key={event.id}
              className="past-card"
              onClick={() => handleCardClick(event)}
            >
              <div
                className="past-card-image"
                style={event.coverImage ? { backgroundImage: `url(${event.coverImage})` } : undefined}
              />
              <div className="past-card-body">
                <div className="pill">{event.category}</div>
                <h3>{event.title}</h3>
                <p>{event.location}</p>
                <button className="view-gallery-btn" onClick={(e) => { e.stopPropagation(); handleCardClick(event); }}>View gallery</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeEvent && (
        <div className="gallery-overlay" onClick={closeOverlay}>
          <div className="gallery" onClick={(e) => e.stopPropagation()}>
            <header className="gallery-header">
              <div>
                <p className="pill pill-soft">{activeEvent.category}</p>
                <h3>{activeEvent.title}</h3>
                <p className="gallery-meta">{activeEvent.location}</p>
              </div>
              <button className="close" onClick={closeOverlay}>✕</button>
            </header>

            <div className="gallery-grid">
              {imagesForEvent(activeEvent).map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  className="gallery-tile"
                  onClick={() => openPhotoDetail(index)}
                >
                  <img
                    className="tile-photo"
                    src={`https://picsum.photos/400/300?random=${activeEvent.id}-${index}`}
                    alt={img.label}
                  />
                  <span>{img.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeEvent && activePhotoIndex !== null && (
        <div className="photo-detail-overlay" onClick={closePhotoDetail}>
          <div className="photo-detail" onClick={(e) => e.stopPropagation()}>
            <header className="photo-detail-header">
              <div>
                <p className="pill pill-soft">{activeEvent.category}</p>
                <h3>{activeEvent.title}</h3>
              </div>
              <button className="close" onClick={closePhotoDetail}>✕</button>
            </header>

            <div className="photo-main">
              <button className="nav-btn" onClick={showPrevPhoto}>{'‹'}</button>
              <div
                className="photo-frame"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {imagesForEvent(activeEvent)[activePhotoIndex] && (
                  <img
                    className="photo-zoomable"
                    src={`https://picsum.photos/800/600?random=${activeEvent.id}-${activePhotoIndex}`}
                    alt={imagesForEvent(activeEvent)[activePhotoIndex].label}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    }}
                  />
                )}
              </div>
              <button className="nav-btn" onClick={showNextPhoto}>{'›'}</button>
            </div>

            <div className="photo-controls">
              <button type="button" onClick={zoomOut}>-</button>
              <span>Zoom</span>
              <button type="button" onClick={zoomIn}>+</button>
              <button type="button" className="reset-btn" onClick={resetView}>Reset</button>
            </div>

            <div className="photo-thumbs">
              {imagesForEvent(activeEvent).map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  className={`thumb ${index === activePhotoIndex ? 'active' : ''}`}
                  onClick={() => openPhotoDetail(index)}
                >
                  <div className="thumb-photo" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
