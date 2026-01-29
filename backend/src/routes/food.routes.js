const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood,
);

router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems);
router.get(
  "/my",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getFoodItemsForPartner,
);
// Toggle like for a food item (user)
router.post(
  "/:id/like",
  authMiddleware.authUserMiddleware,
  foodController.toggleLike,
);
module.exports = router;
