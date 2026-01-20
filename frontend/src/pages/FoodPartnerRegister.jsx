import React from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.brand.value,
      email: form.email.value,
      password: form.password.value,
      contactName: form.contactName.value,
      phone: form.phone.value,
      address: form.address.value,
    };
    console.log("Food Partner Registration form data:", formData);
    // Here you would typically send formData to the backend API
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/foodpartner/register",
        formData,
        { withCredentials: true }
      );
      console.log("Registration successful:", response.data);
      // Redirect to login page or dashboard after successful registration
      navigate("/createfood");
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error (e.g., show error message to user)
    }
    
  }
  return (
    <div className="auth-wrap">
      <div className="container">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">Register as Food Partner</h1>
            <p className="auth-subtitle">Grow with our partner network</p>
          </header>

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
              />
            </div>

            <div className="actions">
              <button className="btn" type="submit">
                Create Partner Account
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
