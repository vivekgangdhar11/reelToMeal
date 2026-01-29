const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid(),
  );

  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
    likedBy: [],
  });

  res.status(201).json({
    message: "Food item created successfully",
    foodItem: foodItem,
  });
}

async function getFoodItems(req, res) {
  const userId = req.user?._id?.toString();
  const foodItems = await foodModel.find({}).lean();
  const mapped = foodItems.map((item) => {
    const likeCount = Array.isArray(item.likedBy) ? item.likedBy.length : 0;
    const liked = userId
      ? Array.isArray(item.likedBy) &&
        item.likedBy.some((id) => id.toString() === userId)
      : false;
    return { ...item, likeCount, liked };
  });
  res.status(200).json({
    foodItems: mapped,
  });
}

async function getFoodItemsForPartner(req, res) {
  const partnerId = req.foodPartner?._id;
  const foodItems = await foodModel.find({ foodPartner: partnerId });
  res.status(200).json({
    foodItems,
  });
}

async function toggleLike(req, res) {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const item = await foodModel.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Reel not found" });
    }
    const hasLiked = (item.likedBy || []).some(
      (uid) => uid.toString() === userId.toString(),
    );
    if (hasLiked) {
      // Unlike: remove user from likedBy
      item.likedBy = (item.likedBy || []).filter(
        (uid) => uid.toString() !== userId.toString(),
      );
    } else {
      // Like: add user to likedBy
      item.likedBy = [...(item.likedBy || []), userId];
    }
    await item.save();
    return res.status(200).json({
      liked: !hasLiked,
      likeCount: item.likedBy.length,
      message: hasLiked ? "Unliked" : "Liked",
    });
  } catch (e) {
    return res.status(400).json({ message: "Unable to toggle like" });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  getFoodItemsForPartner,
  toggleLike,
};
