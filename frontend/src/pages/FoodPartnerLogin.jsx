import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const form=e.target;
    const formdata={
      email:form.email.value,
      password:form.password.value
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/foodpartner/login",
        formdata,
        { withCredentials: true }
      );
      console.log("Login successful:", response.data);
      // Redirect to dashboard after successful login
      navigate("/createfood");
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error (e.g., show error message to user)
    }
  }
  return (
    <div className="auth-wrap">
      <div className="container">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">Food Partner Login</h1>
            <p className="auth-subtitle">Access your partner dashboard</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="email">
                Business Email
              </label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder="you@restaurant.com"
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
                New partner?{" "}
                <Link to="/food-partner/register">
                  Create a partner account
                </Link>
              </p>
              <p className="muted-link">
                Not a partner? <Link to="/user/login">Sign in as User</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
