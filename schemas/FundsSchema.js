const mongoose = require("mongoose");

const fundSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availableMargin: {
      type: Number,
      default: 0,
    },
    usedMargin: {
      type: Number,
      default: 0,
    },
    availableCash: {
      type: Number,
      default: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    payin: {
      type: Number,
      default: 0,
    },
    collateralLiquid: {
      type: Number,
      default: 0,
    },
    collateralEquity: {
      type: Number,
      default: 0,
    },
    totalCollateral: {
      type: Number,
      default: 0,
    },
  },
  
);

module.exports = { fundSchema };
