require("dotenv").config();
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ status: false });

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      res.clearCookie("token"); // Clear token if verification fails
      return res.json({ status: false });
    }

    const user = await User.findById(data.id);
    if (user) {
      return res.json({
        status: true,
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
      });
    } else {
      res.clearCookie("token"); // Clear token if user not found
      return res.json({ status: false });
    }
  });
};
