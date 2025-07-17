const express = require("express");
const router = express.Router();
const cors = require("cors");
const { getOrdersByUser , placeOrder } = require("../Controllers/orderController");

router.use(
  cors({
    origin: ["https://tradzen-frontend-1.onrender.com", "https://tradzen-dashboard.onrender.com"], // ✅ allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// GET all orders for a user
router.get("/orders", getOrdersByUser);
// place BUY and SELL order
router.post("/newOrder", placeOrder);

module.exports = router;
