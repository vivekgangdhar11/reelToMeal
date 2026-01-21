const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { fullname, email, password } = req.body;

  const isUserExist = await userModel.findOne({ email: email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullname,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

async function registerFoodPartner(req, res) {
  const { name, email, password, phone, contactName, address } = req.body;
  const isPartnerExist = await foodPartnerModel.findOne({ email: email });
  if (isPartnerExist) {
    return res.status(400).json({ message: "Food partner already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const foodPartner = await foodPartnerModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    contactName,
    address,
  });
  const token = jwt.sign(
    { foodPartnerId: foodPartner._id },
    process.env.JWT_SECRET,
  );
  // Set both for backward compatibility; partner_token preferred by middleware
  res.cookie("token", token);
  res.cookie("partner_token", token);
  res.status(201).json({
    message: "Food partner registered successfully",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
      phone: foodPartner.phone,
      contactName: foodPartner.contactName,
      address: foodPartner.address,
    },
  });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;
  const foodPartner = await foodPartnerModel.findOne({ email: email });
  if (!foodPartner) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const token = jwt.sign(
    { foodPartnerId: foodPartner._id },
    process.env.JWT_SECRET,
  );
  // Set both for backward compatibility; partner_token preferred by middleware
  res.cookie("token", token);
  res.cookie("partner_token", token);
  res.status(200).json({
    message: "Login successful",
    foodPartner: {
      _id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
    },
  });
}

function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.clearCookie("partner_token");
  res.status(200).json({ message: "Logout successful" });
}

// Public store profile by ID (no password)
async function getFoodPartnerProfile(req, res) {
  try {
    const { id } = req.params;
    const partner = await foodPartnerModel.findById(id).select("-password");
    if (!partner) {
      return res.status(404).json({ message: "Store not found" });
    }
    return res.status(200).json({ foodPartner: partner });
  } catch (e) {
    return res.status(400).json({ message: "Invalid store id" });
  }
}

// Current logged-in food partner profile
async function getCurrentFoodPartner(req, res) {
  try {
    // req.foodPartner is set by authFoodPartnerMiddleware
    const partner = await foodPartnerModel
      .findById(req.foodPartner._id)
      .select("-password");
    return res.status(200).json({ foodPartner: partner });
  } catch (e) {
    return res.status(400).json({ message: "Unable to load partner profile" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getFoodPartnerProfile,
  getCurrentFoodPartner,
};
