import React, { useState, useEffect } from "react";
import "./PastEvents.css";

export const PastEvents = ({ events }) => {
  const pastEvents = events || [
    {
      id: 1,
      title: "Summer Music Festival 2023",
      date: "July 15, 2023",
      location: "Central Park, New York",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 2,
      title: "Tech Conference",
      date: "June 5, 2023",
      location: "Convention Center, San Francisco",
      image:
        "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      date: "May 20, 2023",
      location: "Downtown, Chicago",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 4,
      title: "Art Exhibition",
      date: "April 10, 2023",
      location: "Modern Art Museum, Miami",
      image:
        "https://images.unsplash.com/photo-1531913764164-f85c52d6e654?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === pastEvents.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? pastEvents.length - 1 : prev - 1
    );
  };

  const totalSlides = pastEvents.length;

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const openGallery = (event) => {
    setSelectedEvent(event);
  };

  const closeGallery = () => {
    setSelectedEvent(null);
  };

  // ✅ Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // change to 3000 for 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="past-events">
      <div className="container">
        <h2 className="section-title">Our Past Events</h2>
        <p className="section-subtitle">
          Relive the amazing moments from our previous events
        </p>

        <div className="events-slider-wrapper">
          <div
            className="events-slider"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.6s ease-in-out",
            }}
          >
            {pastEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <div className="event-date">{event.date}</div>
                </div>
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p className="event-location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {event.location}
                  </p>
                  <button className="view-gallery-btn" onClick={() => openGallery(event)}>View Gallery</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="slider-controls">
          <button className="slider-arrow prev" onClick={prevSlide}>
            ‹
          </button>

          <div className="slider-dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <span
                key={index}
                className={`dot ${currentIndex === index ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>

          <button className="slider-arrow next" onClick={nextSlide}>
            ›
          </button>
        </div>

        {selectedEvent && (
          <div className="pe-modal-overlay" onClick={closeGallery}>
            <div className="pe-modal" onClick={(e) => e.stopPropagation()}>
              <button className="pe-modal-close" onClick={closeGallery}>
                ✕
              </button>
              <div className="pe-modal-image-wrap">
                <img src={selectedEvent.image} alt={selectedEvent.title} />
              </div>
              <div className="pe-modal-body">
                <h3>{selectedEvent.title}</h3>
                <p className="pe-modal-meta">{selectedEvent.date} · {selectedEvent.location}</p>
                <p className="pe-modal-note">Relive highlights from this past event. You can later hook this to a real gallery.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

