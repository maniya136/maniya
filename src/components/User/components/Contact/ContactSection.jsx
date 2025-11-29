import React from 'react';
import './ContactSection.css';

export const ContactSection = () => {
  return (
    <main className="page">
      <section className="section contact">
        <h2>Contact us</h2>
        <p className="section-subtitle">Share your event idea and we will respond within 1 business day.</p>
        <form className="contact-form">
          <div className="form-row">
            <input placeholder="Your name" />
            <input type="email" placeholder="Email" />
          </div>
          <div className="form-row">
            <input placeholder="Phone number" />
            <input placeholder="City / Location" />
          </div>
          <textarea rows="4" placeholder="Tell us about your event (type, date, guests, budget)"></textarea>
          <button type="submit" className="primary">Submit enquiry</button>
        </form>
      </section>
    </main>
  );
};
