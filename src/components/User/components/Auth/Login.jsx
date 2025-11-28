import React, { useState } from 'react';
import './Auth.css';
import axios from 'axios';

// In login onsubmit bind login api and send data to  backend 
export const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const credentials = { email: email.trim().toLowerCase(), password };
      console.log('Sending login request:', credentials);

      const response = await axios.post('https://localhost:7253/api/Users/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response:', response.data);

      // If backend later returns a token, you can store it here
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      // Navigate to user dashboard on success
      if (onNavigate) {
        alert("Login Successful")
        onNavigate('user');
      }
    } catch (err) {
      console.error('Login failed:', err);
      let message = 'Login failed. Please check your credentials.';

      if (err.response) {
        // Server responded with a status outside 2xx
        message = err.response.data?.message || message;
      } else if (err.request) {
        // No response received
        message = 'No response from server. Please check your connection.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Evenza</h2>
        <p className="auth-subtitle">Access your events and bookings</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <button onClick={() => onNavigate('register')} className="link-btn">Register here</button></p>
        </div>

        {/* Demo accounts section removed now that real API login is used */}
      </div>
    </div>
  );
};
