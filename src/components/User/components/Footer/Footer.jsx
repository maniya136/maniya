import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand / Logo */}
        <div className="footer-brand">
          <h2>Evenza</h2>
          <p>Your trusted event partner</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: evenza@gmail.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Surat, India</p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            {/* Facebook */}
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3
                c0-2 1.2-3.1 3-3.1 .9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12z"/>
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 
                4.26 0 0 0 1.88-2.35 8.49 8.49 0 0 1-2.7 
                1.03 4.24 4.24 0 0 0-7.4 2.9c0 .33.04.65.1.96A12 
                12 0 0 1 3 4.9a4.25 4.25 0 0 0 1.32 5.66 
                4.23 4.23 0 0 1-1.92-.53v.05a4.25 4.25 
                0 0 0 3.4 4.17 4.23 4.23 0 0 1-1.91.07 
                4.25 4.25 0 0 0 3.97 2.95A8.5 8.5 0 0 1 
                2 19.54a12 12 0 0 0 6.29 1.84c7.55 
                0 11.68-6.26 11.68-11.68 0-.18 
                0-.36-.01-.54A8.3 8.3 0 0 0 22.46 6z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2C4.2 2 2 4.2 2 
                7v10c0 2.8 2.2 5 5 
                5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 
                2h10c1.7 0 3 1.3 3 
                3v10c0 1.7-1.3 3-3 
                3H7c-1.7 0-3-1.3-3-3V7c0-1.7 
                1.3-3 3-3zm5 2a5 5 0 1 0 0 
                10 5 5 0 0 0 0-10zm0 
                2a3 3 0 1 1 0 6 3 3 
                0 0 1 0-6zm4.5-.9a1.1 
                1.1 0 1 0 0 2.2 1.1 
                1.1 0 0 0 0-2.2z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C4.98 
                4.88 3.87 6 2.5 
                6S0 4.88 0 3.5 1.12 
                1 2.5 1 4.98 2.12 4.98 
                3.5zM.5 8h4V24h-4V8zm7.5 
                0h3.8v2.2h.1c.5-1 1.8-2.2 
                3.7-2.2 3.9 0 4.6 2.6 
                4.6 6v9h-4v-8c0-1.9 0-4.3-2.6-4.3-2.6 
                0-3 2-3 4.1v8.2h-4V8z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Evenza. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
