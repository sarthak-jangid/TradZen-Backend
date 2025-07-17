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
    origin: ["trad-zen-frontend.vercel.app", "trad-zen-dashboard.vercel.app"], // allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

router.get("/my-funds", verifyUser, getUserFunds);
router.post("/withdraw", verifyUser, withdrawFunds);

module.exports = router;
