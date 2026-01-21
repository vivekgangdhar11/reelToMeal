import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      email: form.email.value,
      password: form.password.value,
    };
    console.log("Login form data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/login",
        formData,
        { withCredentials: true },
      );
      console.log("Login successful:", response.data);
      navigate("/reels");
    } catch (error) {
      console.error("Login failed:", error.response.data);
    }
  };
  return (
    <div className="auth-wrap">
      <div className="container">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">User Login</h1>
            <p className="auth-subtitle">Welcome back, sign in to continue</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="actions">
              <button className="btn" type="submit">
                Sign In
              </button>
              <p className="muted-link">
                New here? <Link to="/user/register">Create an account</Link>
              </p>
              <p className="muted-link">
                Partner?{" "}
                <Link to="/food-partner/login">Sign in as Food Partner</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
