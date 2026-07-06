const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancerWallet: { type: String, required: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true },
    clientName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    companyLogoUrl: { type: String, default: "" },
    items: { type: [itemSchema], required: true, validate: (v) => v.length > 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "XLM" },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "sent",
    },
    paymentTxHash: { type: String, default: null },
    contractInvoiceId: { type: String, default: null },
  },
  { timestamps: true }
);

invoiceSchema.pre("validate", function (next) {
  if (this.items && this.items.length) {
    this.totalAmount = this.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  }
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
