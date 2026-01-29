import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isPasswordStrong = (p) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(p);
  const isAlphaText = (t) => /^[A-Za-z ]+$/.test(t.trim());
  const isDigitsPhone = (p) => /^[0-9]{7,15}$/.test(p.trim());
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setError("");
    setLoading(true);
    const formData = {
      name: form.brand.value,
      email: form.email.value,
      password: form.password.value,
      contactName: form.contactName.value,
      phone: form.phone.value,
      address: form.address.value,
    };
    console.log("Food Partner Registration form data:", formData);
    // Client-side validations
    if (!isAlphaText(formData.name)) {
      setError("Business/Brand name must contain only letters and spaces.");
      setLoading(false);
      return;
    }
    if (!isAlphaText(formData.contactName)) {
      setError("Contact name must contain only letters and spaces.");
      setLoading(false);
      return;
    }
    if (!isDigitsPhone(formData.phone)) {
      setError("Phone must contain only digits (7–15).");
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
    // Here you would typically send formData to the backend API
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/foodpartner/register",
        formData,
        { withCredentials: true },
      );
      console.log("Registration successful:", response.data);
      // Redirect to login page or dashboard after successful registration
      navigate("/createfood");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Food partner already exists";
      console.error("Error during registration:", message);
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
            <h1 className="auth-title">Register as Food Partner</h1>
            <p className="auth-subtitle">Grow with our partner network</p>
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
              <label className="label" htmlFor="brand">
                Business / Brand Name
              </label>
              <input
                className="input"
                id="brand"
                name="brand"
                type="text"
                placeholder="Your Restaurant"
                autoComplete="organization"
                required
                pattern="[A-Za-z ]+"
                title="Use letters and spaces only"
                onInput={() => error && setError("")}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="email">
                Business Email
              </label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder="contact@restaurant.com"
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

            <div className="field">
              <label className="label" htmlFor="contactName">
                Contact Name
              </label>
              <input
                className="input"
                id="contactName"
                name="contactName"
                type="text"
                placeholder="Primary contact person"
                autoComplete="name"
                required
                pattern="[A-Za-z ]+"
                title="Use letters and spaces only"
                onInput={() => error && setError("")}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="phone">
                Phone
              </label>
              <input
                className="input"
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g., +1 555 123 4567"
                autoComplete="tel"
                required
                inputMode="numeric"
                pattern="[0-9]{7,15}"
                title="Digits only, 7–15 characters"
                onInput={() => error && setError("")}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="address">
                Business Address
              </label>
              <textarea
                className="textarea"
                id="address"
                name="address"
                placeholder="Street, City, State, ZIP"
                rows={3}
                required
                onInput={() => error && setError("")}
              />
            </div>

            <div className="actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Partner Account"}
              </button>
              <p className="muted-link">
                Already a partner? <Link to="/food-partner/login">Sign in</Link>
              </p>
              <p className="muted-link">
                User instead?{" "}
                <Link to="/user/register">Create a user account</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
