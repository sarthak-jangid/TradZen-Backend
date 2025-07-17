// routes/paymentRoutes.js
const express = require("express");
const {
  createOrder,
  getRazorpayKey,
  updateFunds,
} = require("../Controllers/paymentController");
const router = express.Router();
const cors = require("cors");
const verifyUser = require("../Middlewares/verifyUser");

router.use(
  cors({
    origin: ["https://tradzen-frontend-1.onrender.com", "https://tradzen-dashboard.onrender.com"], // allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

router.post("/create-order", createOrder);
router.get("/get-razorpay-key", verifyUser, getRazorpayKey);

router.post("/update-funds", verifyUser, updateFunds);

module.exports = router;
