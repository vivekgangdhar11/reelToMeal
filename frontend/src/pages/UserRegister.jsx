import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isPasswordStrong = (p) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(p);
  const isAlphaName = (n) => /^[A-Za-z ]+$/.test(n.trim());
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    setError("");
    setLoading(true);
    const formData = {
      fullname: form.name.value,
      email: form.email.value,
      password: form.password.value,
    };
    // Client-side validations
    if (!isAlphaName(formData.fullname)) {
      setError("Name must contain only letters and spaces.");
      setLoading(false);
      return;
    }
    if (!isPasswordStrong(formData.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      );
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/register",
        formData,
        { withCredentials: true },
      );
      console.log("Registration successful:", response.data);
      // You can redirect the user or show a success message here
      navigate("/reels");
    } catch (error) {
      const message = error?.response?.data?.message || "User already exists";
      console.error("Registration failed:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-wrap">
      <div className="container">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">Create User Account</h1>
            <p className="auth-subtitle">Join to get started</p>
          </header>

          {error ? (
            <div
              role="alert"
              style={{
                marginBottom: "16px",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "0.95rem",
              }}
            >
              {error}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="name">
                Full Name
              </label>
              <input
                className="input"
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                required
                pattern="[A-Za-z ]+"
                title="Use letters and spaces only"
                onInput={() => error && setError("")}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                onInput={() => error && setError("")}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
                onInput={() => error && setError("")}
              />
            </div>

            <div className="actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
              <p className="muted-link">
                Already have an account? <Link to="/user/login">Sign in</Link>
              </p>
              <p className="muted-link">
                Partner?{" "}
                <Link to="/food-partner/register">
                  Register as Food Partner
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
