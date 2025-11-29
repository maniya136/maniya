import React, { useState, useEffect } from "react";
import "./UpcomingEvents.css";

const UpcomingEvents = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Rock Music Night",
      date: "Oct 10, 2025 | 7:00 PM",
      location: "Madison Square Garden, New York",
      price: "$50",
      image:
        "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 2,
      title: "Startup Pitch Conference",
      date: "Nov 5, 2025 | 10:00 AM",
      location: "Tech Convention Center, San Francisco",
      price: "$120",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      title: "Food Carnival",
      date: "Dec 18, 2025 | 12:00 PM",
      location: "Downtown Plaza, Chicago",
      price: "$30",
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1350&q=80",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % upcomingEvents.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + upcomingEvents.length) % upcomingEvents.length
    );
  };

  // ✅ Auto sliding every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % upcomingEvents.length
      );
    }, 3000); // change to 5000 for 5 seconds

    return () => clearInterval(interval); // cleanup
  }, [upcomingEvents.length]);

  return (
    <section className="upcoming-events">
      <div className="container">
        <h2 className="section-title">Upcoming Events</h2>
        <p className="section-subtitle">
          Don’t miss our exciting upcoming events
        </p>

        {/* Slider */}
        <div className="events-slider-wrapper">
          <div
            className="events-slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <div className="event-price">{event.price}</div>
                </div>
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p className="event-date">{event.date}</p>
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
                  <button className="book-btn">Book Now</button>
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
          <button className="slider-arrow next" onClick={nextSlide}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
