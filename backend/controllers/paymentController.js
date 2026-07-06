const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

/**
 * Verifies a transaction actually happened on Stellar Horizon before trusting it.
 * This prevents a client from just POSTing a fake txHash to mark an invoice paid.
 */
const verifyTransactionOnHorizon = async (txHash) => {
  const horizonUrl = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
  const response = await fetch(`${horizonUrl}/transactions/${txHash}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.successful ? data : null;
};

const recordPayment = async (req, res, next) => {
  try {
    const { invoiceId, txHash, payerWallet } = req.body;
    if (!invoiceId || !txHash || !payerWallet) {
      return res.status(400).json({ message: "invoiceId, txHash, payerWallet are required" });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    if (invoice.status === "paid") {
      return res.status(409).json({ message: "Invoice already marked as paid" });
    }

    const existingPayment = await Payment.findOne({ txHash });
    if (existingPayment) {
      return res.status(409).json({ message: "This transaction hash was already recorded" });
    }

    const txRecord = await verifyTransactionOnHorizon(txHash);
    if (!txRecord) {
      return res.status(422).json({
        message: "Transaction could not be verified as successful on Stellar testnet",
      });
    }

    const payment = await Payment.create({
      invoiceId,
      payerWallet,
      receiverWallet: invoice.freelancerWallet,
      amount: invoice.totalAmount,
      txHash,
      status: "success",
    });

    invoice.status = "paid";
    invoice.paymentTxHash = txHash;
    await invoice.save();

    res.status(201).json({ payment, invoice });
  } catch (err) {
    next(err);
  }
};

const getPaymentsForInvoice = async (req, res, next) => {
  try {
    const payments = await Payment.find({ invoiceId: req.params.invoiceId }).sort({
      createdAt: -1,
    });
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};

module.exports = { recordPayment, getPaymentsForInvoice };
