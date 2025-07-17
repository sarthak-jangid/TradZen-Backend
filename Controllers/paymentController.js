const razorpayInstance = require("../util/razorpayPaymentConfig");

module.exports.getRazorpayKey = (req, res) => {
  // console.log("get key work in backend");

  const key = process.env.RAZORPAY_API_KEY;

  if (!key) {
    return res
      .status(500)
      .json({ success: false, message: "Razorpay key not found" });
  }
  res.status(200).json({ key });
};

exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  // console.log("create order work in backend");

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid amount provided",
    });
  }

  //  Handle case when instance is not initialized
  if (!razorpayInstance) {
    return res.status(500).json({
      success: false,
      message: "Razorpay is not configured on server",
    });
  }

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

const { FundsModel } = require("../model/FundsModel");

module.exports.updateFunds = async (req, res) => {
  // console.log("update fund work in backend");

  const { amount } = req.body;
  const userId = req.userId; // assuming populated from cookies

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    const funds = await FundsModel.findOne({ user: userId });

    if (!funds) {
      return res
        .status(404)
        .json({ success: false, message: "Funds not found" });
    }

    funds.availableCash += amount;
    funds.availableMargin += amount * 0.9; // example logic: 90% of amount is margin
    funds.payin += amount;

    await funds.save();

    return res.status(200).json({ success: true, message: "Funds updated" });
  } catch (err) {
    console.error("Error updating funds:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
