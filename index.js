require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3002;
const db = process.env.MONGO_ATLAS_URL;
const cors = require("cors");
const { PositionsModel } = require("./model/PositionsModel");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const User = require("./model/userModel");
const jwt = require("jsonwebtoken");
const orderRoutes = require("./Routes/orderRoute");
const fundsRoutes = require("./Routes/fundsRoute");
const paymentRoute = require("./Routes/paymentRoute");

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // ✅ allow both ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/", authRoute);
app.use("/api/funds", fundsRoutes); // base path for funds
app.use("/api/payments", paymentRoute);
app.use("/api", orderRoutes);

app.get("/allHoldings", async (req, res) => {
  // console.log(req.cookies)
  const token = req.cookies.token;

  if (!token) return res.status(401).send("Unauthorized: No token");

  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decoded.id; // You signed token with user._id
  let user = await User.findById(userId).populate("holdings");
  // console.log(user.holdings);
  res.status(200).json({ name: user.username, holdings: user.holdings });
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find();
  res.status(200).json(allPositions);
});



mongoose
  .connect(db)
  .then(() => {
    console.log("✅ MongoDB connection successful");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log("connection done");
});
