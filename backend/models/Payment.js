const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    payerWallet: { type: String, required: true },
    receiverWallet: { type: String, required: true },
    amount: { type: Number, required: true },
    txHash: { type: String, required: true, unique: true },
    status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
