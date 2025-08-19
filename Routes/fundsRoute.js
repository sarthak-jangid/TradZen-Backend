const express = require("express");
const router = express.Router();
const verifyUser = require("../Middlewares/verifyUser");
const {
  getUserFunds,
  withdrawFunds,
} = require("../Controllers/FundsController");
const cors = require("cors");

router.use(
  cors({
    origin: [
      "https://tradzen-frontend-1.onrender.com",
      "https://tradzen-dashboard.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ], // allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

router.get("/my-funds", verifyUser, getUserFunds);
router.post("/withdraw", verifyUser, withdrawFunds);

module.exports = router;
