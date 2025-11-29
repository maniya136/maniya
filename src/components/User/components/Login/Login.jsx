import React, { useEffect, useState } from "react";
import Registration from "./Registration";
import "./Login.css";

export default function Login(props) {
  const [view, setView] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        props.onClose && props.onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [props]);

  const close = () => {
    setView("login");
    props.onClose && props.onClose();
  };

  const onOverlayClick = () => close();
  const stop = (e) => e.stopPropagation();

  const submitLogin = (e) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      setError("Invalid credentials");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    if (remember) localStorage.setItem("remember", "1"); else localStorage.removeItem("remember");

    // vendor -> vendor dashboard, user -> home (default)
    if (user.accountType === "vendor") {
      window.location.href = "/vendor-dashboard";
      return;
    }

    // close modal for regular users
    props.onClose && props.onClose();
  };

  if (view === "register") {
    return (
      <div className="modal-overlay" onClick={onOverlayClick}>
        <div className="login-card large" onClick={stop} role="dialog" aria-modal="true">
          <button className="modal-close" onClick={close} aria-label="Close">×</button>
          <Registration
            onSwitchToLogin={() => setView("login")}
            onClose={() => {
              setView("login");
              props.onClose && props.onClose();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onOverlayClick}>
      <div className="login-card" onClick={stop} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={close} aria-label="Close">×</button>

        <div className="login-top">
          <div className="logo-circle">⇢</div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-sub">Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          {error && <div style={{ color: "crimson", textAlign: "center" }}>{error}</div>}
          <label className="input-group">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="pwd-toggle" onClick={() => {
              const el = document.querySelector('.input-group input[type="password"], .input-group input[type="text"]');
              if (!el) return;
              el.type = el.type === 'password' ? 'text' : 'password';
            }}>👁️</button>
          </label>

          <div className="login-helpers">
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={() => setRemember(r => !r)} />
              Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button type="submit" className="primary large">Sign In</button>

          <div className="divider"><span>Don't have an account?</span></div>

          <button type="button" className="outline" onClick={() => setView("register")}>Create New Account</button>
        </form>
      </div>
    </div>
  );
}