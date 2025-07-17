const mongoose = require("mongoose");
const { fundSchema } = require("../schemas/FundsSchema");

const FundsModel = mongoose.model("Funds", fundSchema);
module.exports = { FundsModel };
