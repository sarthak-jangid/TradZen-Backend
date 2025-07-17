const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 🔗 Links each order to a specific user
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mode: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { OrdersSchema };
