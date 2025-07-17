const { OrdersModel } = require("../model/OrdersModel");
const jwt = require("jsonwebtoken");
const { HoldingsModel } = require("../model/HoldingsModel");
const { FundsModel } = require("../model/FundsModel");
const User = require("../model/userModel");

// GET /api/orders/:userId
module.exports.getOrdersByUser = async (req, res) => {
  try {
    // console.log("work b")
    const token = req.cookies.token; // or req.cookies.userToken, etc.
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    const orders = await OrdersModel.find({ user: userId }).sort({ date: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.placeOrder = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).send("Unauthorized: No token");

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id; // You signed token with user._id

    const { name, qty, price, mode, stock } = req.body;
    console.log(req.body);
    // 1. Save the order
    let newOrder = new OrdersModel({
      user: userId,
      name: name,
      qty: qty,
      price: price,
      mode: mode,
      date: new Date(),
    });
    await newOrder.save();

    // if the mode is Buy.

    if (mode == "BUY") {
      // console.log("work");
      const totalBuyCost = qty * price;

      const fund = await FundsModel.findOne({ user: userId });

      if (!fund || fund.availableCash < totalBuyCost) {
        return res
          .status(400)
          .send("Insufficient funds to complete this order");
      }

      const holding = await HoldingsModel.findOne({
        user: userId,
        name: name,
        price: price,
      });
      // console.log(holding);

      if (holding) {
        // console.log("okk");
        holding.qty += qty;
        await holding.save();
      } else {
        // 2. Always add a new holding (even if one exists)
        let newHolding = new HoldingsModel({
          user: userId,
          name: name,
          qty: qty,
          avg: price,
          price: price,
          net: ((stock.price - price) / price) * 100,
          day: stock.percent,
        });
        await newHolding.save();

        // 4. Push holding into user's holdings array
        await User.findByIdAndUpdate(userId, {
          $push: { holdings: newHolding._id },
        });
      }
      // Update funds: reduce available cash, increase used margin
      fund.availableCash -= totalBuyCost;
      fund.usedMargin += totalBuyCost;

      await fund.save();
      return res.send("order placed and holding added");
    }

    // if the mode is Sell
    if (mode == "SELL") {
      // console.log("work");
      const existing = await HoldingsModel.findOne({
        user: userId,
        name,
      });

      if (!existing) {
        return res.status(400).send("Cannot sell stock that you don't hold");
      }

      if (existing.qty < qty) {
        return res
          .status(400)
          .send("Cannot sell more than the quantity you hold");
      }

      const totalSellValue = qty * price;

      existing.qty -= qty;

      const fund = await FundsModel.findOne({ user: userId });

      // ✅ Always update funds
      fund.availableCash += totalSellValue;
      fund.usedMargin -= totalSellValue;
      if (fund.usedMargin < 0) fund.usedMargin = 0;

      await fund.save();

      if (existing.qty === 0) {
        await HoldingsModel.deleteOne({ _id: existing._id });

        // Remove it from the user's holdings array
        await User.findByIdAndUpdate(userId, {
          $pull: { holdings: existing._id },
        });
      } else {
        await existing.save();
      }

      return res.send("Sell order placed and holding updated");
    }
    res.status(400).send("Invalid order mode");
  } catch (err) {
    console.error(err); //  Log the real error
    res
      .status(500)
      .send(err.message || "Error placing order or adding holding");
  }
};
