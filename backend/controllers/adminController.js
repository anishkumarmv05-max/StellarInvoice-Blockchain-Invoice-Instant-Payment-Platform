const User = require("../models/User");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Feedback = require("../models/Feedback");

const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalFreelancers, totalClients, totalInvoices, paidInvoices, totalPayments, feedbackCount, feedbackAvg] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "freelancer" }),
        User.countDocuments({ role: "client" }),
        Invoice.countDocuments(),
        Invoice.countDocuments({ status: "paid" }),
        Payment.countDocuments({ status: "success" }),
        Feedback.countDocuments(),
        Feedback.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]),
      ]);

    const totalVolume = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      totalFreelancers,
      totalClients,
      totalInvoices,
      paidInvoices,
      unpaidInvoices: totalInvoices - paidInvoices,
      totalPayments,
      totalVolumeXLM: totalVolume[0]?.total || 0,
      feedbackCount,
      averageRating: feedbackAvg[0]?.avg?.toFixed(2) || null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
