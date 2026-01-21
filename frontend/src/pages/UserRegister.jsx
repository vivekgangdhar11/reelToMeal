import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = {
      fullname: form.name.value,
      email: form.email.value,
      password: form.password.value,
    };
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
      console.error("Registration failed:", error.response.data);
      // You can show an error message to the user here
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
              />
            </div>

            <div className="actions">
              <button className="btn" type="submit">
                Create Account
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
