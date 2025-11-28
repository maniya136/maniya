import React from "react";
import { FaSearch } from "react-icons/fa";  // ✅ Import search icon
import "./Hero.css";

const Hero = ({ bg }) => {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="hero-content">
        <h1>Your Event, Your Way</h1>
        <p>
          Welcome to Evenza, your premier event planning partner. Explore
          categories, book vendors, and make your events unforgettable.
        </p>

        <div className="search-bar">
          <select>
            <option>Select Category</option>
            <option>Wedding</option>
            <option>Birthday Party</option>
            <option>Corporate</option>
          </select>

          <select>
            <option>Select Location</option>
            <option>New York</option>
            <option>Los Angeles</option>
          </select>

          <button className="searchBtn">
             <FaSearch className="search-icon"/>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
