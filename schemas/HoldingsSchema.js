const mongoose = require("mongoose");

const HoldingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 🔗 Each holding belongs to a user
    required: true,
  },
  name: {
    type: String, // e.g., "TATA"
    required: true,
  },
  qty: {
    type: Number, // quantity
    required: true,
    min: 1,
  },
  avg: {
    type: Number, // average purchase price
    required: true,
    min: 0,
  },
  price: {
    type: Number, // current market price
    required: true,
    min: 0,
  },
  net: {
    type: String, // total PnL or gain/loss
    default: 0,
  },
  day: {
    type: String, // today's gain/loss
    default: 0,
  },
  isLoss: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { HoldingsSchema };
