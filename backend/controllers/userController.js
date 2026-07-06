const User = require("../models/User");

const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

const updateWallet = async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress || !walletAddress.startsWith("G")) {
      return res.status(400).json({ message: "Valid Stellar public key required" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { walletAddress },
      { new: true }
    ).select("-password");
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateWallet };
