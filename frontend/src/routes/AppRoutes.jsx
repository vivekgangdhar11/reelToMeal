import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "../pages/UserRegister";
import UserLogin from "../pages/UserLogin";
import FoodPartnerRegister from "../pages/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/FoodPartnerLogin";
import Home from "../pages/Home";
import CreateFood from "../pages/CreateFood";
import Profile from "../pages/Profile";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegister />}
        />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/" element={<UserLogin />} />
        <Route path="/reels" element={<Home />} />
        <Route path="/createfood" element={<CreateFood />} />
        <Route path="/food-partner/profile/:partnerId" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
