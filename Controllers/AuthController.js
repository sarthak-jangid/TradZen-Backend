const User = require("../model/userModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const { FundsModel } = require("../model/FundsModel");

module.exports.Signup = async (req, res) => {
  try {
    // console.log("work");
    const { email, password, username, createdAt } = req.body;

    // Check if required fields are provided
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      email,
      password: hash,
      username,
      createdAt: createdAt || new Date(),
    });

    // Generate token
    const token = createSecretToken(user._id);

    // Check if funds already exist
    const existingFund = await FundsModel.findOne({ user: user._id });

    if (!existingFund) {
      const newFund = await FundsModel.create({
        user: user._id,
        availableMargin: 0,
        usedMargin: 0,
        availableCash: 0,
        openingBalance: 0,
        payin: 0,
      });
      // console.log("New fund created:", newFund);
    }

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Lax",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send success response
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    //  Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const existingFund = await FundsModel.findOne({ user: user._id });

    if (!existingFund) {
      const newFund = await FundsModel.create({
        user: user._id,
        availableMargin: 0,
        usedMargin: 0,
        availableCash: 0,
        openingBalance: 0,
        payin: 0,
      });
      // console.log("New fund created:", newFund);
    }

    // Generate token
    const token = createSecretToken(user._id);

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Lax",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Lax",
      sameSite: "None",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ error: "Logout failed" });
  }
};
