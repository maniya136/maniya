import React, { useState } from "react";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    // Demo only: accept any non-empty credentials
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    localStorage.setItem("adminAuth", "true");
    window.location.assign("/admin");
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <h2>Admin Login</h2>
        <form onSubmit={onSubmit} className="login-form">
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@evenza.com" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
