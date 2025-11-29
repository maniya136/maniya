import React, { useState } from "react";
import {
  FaBirthdayCake,
  FaBriefcase,
  FaMusic,
  FaGraduationCap,
} from "react-icons/fa";
import { GiDiamondRing, GiCook } from "react-icons/gi";
import "./EventCategories.css";

const EventCategories = () => {
  const categories = [
    { id: 1, title: "Birthday Party", events: "120+ Events", icon: <FaBirthdayCake /> },
    { id: 2, title: "Wedding", events: "85+ Events", icon: <GiDiamondRing /> },
    { id: 3, title: "Corporate Party", events: "65+ Events", icon: <FaBriefcase /> },
    { id: 4, title: "Music Festival", events: "40+ Events", icon: <FaMusic /> },
    { id: 5, title: "Graduation", events: "30+ Events", icon: <FaGraduationCap /> },
    { id: 6, title: "Food Festival", events: "55+ Events", icon: <GiCook /> },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const nextSlide = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="event-categories">
      <div className="container">
        <h2 className="section-title">Event Categories</h2>
        <p className="section-subtitle">Find events that match your interests</p>

        {/* ✅ Slider Wrapper */}
        <div className="categories-slider-wrapper">
          <div
            className="categories-slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {categories.map((cat) => (
              <div key={cat.id} className="category-card">
                <div className="icon-circle">{cat.icon}</div>
                <h3>{cat.title}</h3>
                <p>{cat.events}</p>
                <button className="explore-btn">Explore</button>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Controls */}
        <div className="slider-controls">
          <button className="slider-arrow prev" onClick={prevSlide} disabled={currentIndex === 0}>
            &#10094;
          </button>

          <div className="slider-dots">
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>

          <button
            className="slider-arrow next"
            onClick={nextSlide}
            disabled={currentIndex === totalPages - 1}
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventCategories;
