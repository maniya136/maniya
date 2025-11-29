import React from 'react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>Evenza</h4>
          <p>Designing weddings, corporate experiences, festivals and celebrations that feel effortless and memorable.</p>
        </div>
        <div className="footer-col">
          <h5>Quick links</h5>
          <ul>
            <li>Home</li>
            <li>Upcoming events</li>
            <li>Categories</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <p>hello@evenza.com</p>
          <p>+91-98765-43210</p>
          <p>Mumbai · Pune · Bengaluru</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Evenza Events. All rights reserved.</span>
      </div>
    </footer>
  );
};
