require("dotenv").config();
const mongoose = require("mongoose");
const db = process.env.MONGO_ATLAS_URL;
const { HoldingsModel } = require("../model/HoldingsModel");
const User = require("../model/userModel");

mongoose
  .connect(db)
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const initDB = async () => {
  // Use dynamic import for ES module
  const holdingData = [
    {
      user: "68722e87af90027f99a58686",
      name: "BHARTIARTL",
      qty: 2,
      avg: 538.05,
      price: 541.15,
      net: "+0.58%",
      day: "+2.99%",
    },
    {
      user: "68722e87af90027f99a58686",
      name: "HDFCBANK",
      qty: 2,
      avg: 1383.4,
      price: 1522.35,
      net: "+10.04%",
      day: "+0.11%",
    },
    {
      user: "68722e87af90027f99a58686",
      name: "HINDUNILVR",
      qty: 1,
      avg: 2335.85,
      price: 2417.4,
      net: "+3.49%",
      day: "+0.21%",
    },
    {
      user: "68722e87af90027f99a58686",
      name: "INFY",
      qty: 1,
      avg: 1350.5,
      price: 1555.45,
      net: "+15.18%",
      day: "-1.60%",
      isLoss: true,
    },
    {
      user: "68722e87af90027f99a58686",
      name: "ITC",
      qty: 5,
      avg: 202.0,
      price: 207.9,
      net: "+2.92%",
      day: "+0.80%",
    },
    {
      user: "68722e87af90027f99a58686",
      name: "KPITTECH",
      qty: 5,
      avg: 250.3,
      price: 266.45,
      net: "+6.45%",
      day: "+3.54%",
    },
    {
      user: "68722e87af90027f99a58686",
      name: "M&M",
      qty: 2,
      avg: 809.9,
      price: 779.8,
      net: "-3.72%",
      day: "-0.01%",
      isLoss: true,
    },
    {
      user: "68722e87af90027f99a58686",
      name: "RELIANCE",
      qty: 1,
      avg: 2193.7,
      price: 2112.4,
      net: "-3.71%",
      day: "+1.44%",
    },
    {
      user: "68722e87af90027f99a58686",
      name: "SBIN",
      qty: 4,
      avg: 324.35,
      price: 430.2,
      net: "+32.63%",
      day: "-0.34%",
      isLoss: true,
    },
    {
      user: "68722e87af90027f99a58686",
      name: "SGBMAY29",
      qty: 2,
      avg: 4727.0,
      price: 4719.0,
      net: "-0.17%",
      day: "+0.15%",
    },
    {
      user: "68722e87af90027f99a58686",
      name: "TATAPOWER",
      qty: 5,
      avg: 104.2,
      price: 124.15,
      net: "+19.15%",
      day: "-0.24%",
      isLoss: true,
    },
    {
      user: "68722e87af90027f99a58686",
      name: "TCS",
      qty: 1,
      avg: 3041.7,
      price: 3194.8,
      net: "+5.03%",
      day: "-0.25%",
      isLoss: true,
    },
    {
      user: "68722e87af90027f99a58686",
      name: "WIPRO",
      qty: 4,
      avg: 489.3,
      price: 577.75,
      net: "+18.08%",
      day: "+0.32%",
    },
  ];
  await HoldingsModel.deleteMany();
  // console.log("All holdings deleted");
  const data = holdingData.default || holdingData;
  const insertedHoldings = await HoldingsModel.insertMany(data);

  // Extract IDs of inserted holdings
  const holdingIds = insertedHoldings.map((h) => h._id);

  await User.findByIdAndUpdate("68734fc6c0010c19bc2f2fce", {
    $addToSet: { holdings: { $each: holdingIds } },
  });
  // console.log("Data inserted!");
  process.exit(0); // Exit after insertion
};
initDB();
