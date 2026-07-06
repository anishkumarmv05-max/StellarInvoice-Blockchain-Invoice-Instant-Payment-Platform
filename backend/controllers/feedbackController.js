const Feedback = require("../models/Feedback");

const submitFeedback = async (req, res, next) => {
  try {
    const { rating, message, name, email } = req.body;
    if (!rating || !message) {
      return res.status(400).json({ message: "rating and message are required" });
    }
    const feedback = await Feedback.create({
      userId: req.user ? req.user._id : null,
      name: name || (req.user ? req.user.name : "Anonymous"),
      email: email || (req.user ? req.user.email : ""),
      rating,
      message,
    });
    res.status(201).json({ feedback });
  } catch (err) {
    next(err);
  }
};

const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitFeedback, getAllFeedback };
