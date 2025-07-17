// routes/fundsRoutes.js
const { FundsModel } = require("../model/FundsModel");

// @desc    Get current user's fund data
// @route   GET /api/funds/my-funds
// @access  Private
const getUserFunds = async (req, res) => {
  try {
    const userId = req.userId; //  set by middleware

    const funds = await FundsModel.findOne({ user: userId });
    if (!funds) {
      return res
        .status(404)
        .json({ success: false, message: "No funds found" });
    }

    res.status(200).json({ success: true, funds });
  } catch (error) {
    console.error("Error fetching funds:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update user funds (optional route for admin or user action)
// @route   PUT /api/funds/update
// @access  Private
const updateUserFunds = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      availableMargin,
      usedMargin,
      availableCash,
      openingBalance,
      payin,
    } = req.body;

    const updated = await FundsModel.findOneAndUpdate(
      { user: userId },
      { availableMargin, usedMargin, availableCash, openingBalance, payin },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Funds not found" });
    }

    res.status(200).json({ success: true, funds: updated });
  } catch (error) {
    console.error("Error updating funds:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const withdrawFunds = async (req, res) => {
  const userId = req.userId;
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid withdrawal amount" });
  }

  try {
    const userFunds = await FundsModel.findOne({ user: userId });

    if (!userFunds) {
      return res.status(404).json({ message: "Funds not found for user" });
    }

    if (userFunds.availableCash < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance to withdraw" });
    }

    // Deduct the amount
    userFunds.availableCash -= amount;
    userFunds.availableMargin -= amount;

    await userFunds.save();

    res
      .status(200)
      .json({ message: "Withdrawal successful", funds: userFunds });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ message: "Withdrawal failed" });
  }
};

module.exports = {
  getUserFunds,
  updateUserFunds,
  withdrawFunds,
};
