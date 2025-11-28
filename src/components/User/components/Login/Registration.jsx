import React, { useState } from "react";
import "./Registration.css";

export default function Registration({ onSwitchToLogin, onClose }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: "user",
    agree: false,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    let errs = {};
    if (!form.fullName.trim() || form.fullName.length < 3)
      errs.fullName = "Full name must be at least 3 characters";

    if (!form.email.trim())
      errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email format";

    if (form.phone && !/^\d{10}$/.test(form.phone))
      errs.phone = "Phone number must be 10 digits";

    if (!form.password)
      errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (!form.agree)
      errs.agree = "You must agree to terms";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); // clear specific field error
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.find((u) => u.email === form.email);
    if (exists) {
      setError("User with this email already exists");
      return;
    }

    const user = {
      id: Date.now(),
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      accountType: form.accountType || "user",
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.accountType === "vendor") {
      window.location.href = "/vendor-dashboard";
      return;
    }

    onClose && onClose();
  };

  return (
    <div className="registration-inner">
      <div className="reg-card">
        <div className="reg-header">
          <div className="reg-icon">👤</div>
          <h2>Create Account</h2>
          <p className="muted">Join us today and get started</p>
        </div>

        {error && (
          <div style={{ color: "crimson", textAlign: "center", marginBottom: 8 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reg-form">
          <label className="full-width">
            <small>Full name</small>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
            {fieldErrors.fullName && (
              <div className="error-text">{fieldErrors.fullName}</div>
            )}
          </label>

          <div className="row">
            <label>
              <small>Email</small>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {fieldErrors.email && (
                <div className="error-text">{fieldErrors.email}</div>
              )}
            </label>
            <label>
              <small>Phone</small>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              {fieldErrors.phone && (
                <div className="error-text">{fieldErrors.phone}</div>
              )}
            </label>
          </div>

          <div className="row">
            <label>
              <small>Password</small>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
              {fieldErrors.password && (
                <div className="error-text">{fieldErrors.password}</div>
              )}
            </label>
            <label>
              <small>Confirm password</small>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {fieldErrors.confirmPassword && (
                <div className="error-text">{fieldErrors.confirmPassword}</div>
              )}
            </label>
          </div>

          <small>Account Type</small>
          <div className="account-type">
            <button
              type="button"
              className={form.accountType === "user" ? "active" : ""}
              onClick={() => setForm((s) => ({ ...s, accountType: "user" }))}
            >
              User
            </button>
            <button
              type="button"
              className={form.accountType === "vendor" ? "active" : ""}
              onClick={() => setForm((s) => ({ ...s, accountType: "vendor" }))}
            >
              Vendor
            </button>
          </div>

          <label className="agree">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span> Agree to terms</span>
          </label>
          {fieldErrors.agree && (
            <div className="error-text">{fieldErrors.agree}</div>
          )}

          <div className="reg-actions">
            <button type="submit" className="primary">
              Create account
            </button>
            <button
              type="button"
              className="link"
              onClick={() => onSwitchToLogin && onSwitchToLogin()}
            >
              Sign in instead
            </button>
          </div>
        </form>

        <button className="close-x" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
