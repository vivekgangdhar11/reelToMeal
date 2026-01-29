import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setError("");
    setLoading(true);
    const formdata = {
      email: form.email.value,
      password: form.password.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/foodpartner/login",
        formdata,
        { withCredentials: true },
      );
      console.log("Login successful:", response.data);
      // Persist basic partner info for later use (optional)
      if (response?.data?.foodPartner) {
        try {
          localStorage.setItem(
            "foodPartner",
            JSON.stringify(response.data.foodPartner),
          );
        } catch {}
      }
      // Redirect to dashboard after successful login
      navigate("/food-partner/dashboard");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Invalid email or password";
      console.error("Error during login:", message);
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
            <h1 className="auth-title">Food Partner Login</h1>
            <p className="auth-subtitle">Access your partner dashboard</p>
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
                placeholder="••••••••"
                autoComplete="current-password"
                required
                onInput={() => error && setError("")}
              />
            </div>

            <div className="actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
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
