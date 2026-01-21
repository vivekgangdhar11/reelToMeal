const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
// User Routes
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
// Food Partner Routes
router.post("/foodpartner/register", authController.registerFoodPartner);
router.post("/foodpartner/login", authController.loginFoodPartner);
router.get("/foodpartner/logout", authController.logoutFoodPartner);
// Public profile
router.get("/foodpartner/:id", authController.getFoodPartnerProfile);

// Current logged-in food partner profile
router.get(
  "/foodpartner/me",
  authMiddleware.authFoodPartnerMiddleware,
  authController.getCurrentFoodPartner,
);

module.exports = router;
