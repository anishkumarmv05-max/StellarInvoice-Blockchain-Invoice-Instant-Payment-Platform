const Invoice = require("../models/Invoice");
const stellarService = require("../services/stellarService");

const generateInvoiceNumber = () => {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${Date.now().toString().slice(-6)}-${rand}`;
};

const createInvoice = async (req, res, next) => {
  try {
    if (req.user.role !== "freelancer" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only freelancers can create invoices" });
    }
    if (!req.user.walletAddress) {
      return res.status(400).json({ message: "Connect your Stellar wallet before creating invoices" });
    }
    const { clientWalletAddress, clientName, title, description, items, dueDate, companyLogoUrl } = req.body;
    if (!clientWalletAddress || !title || !items || !items.length || !dueDate) {
      return res.status(400).json({ message: "Missing required invoice fields" });
    }

    const invoice = await Invoice.create({
      invoiceNumber: generateInvoiceNumber(),
      freelancerId: req.user._id,
      freelancerWallet: req.user.walletAddress,
      clientWalletAddress,
      clientName: clientName || "Client",
      title,
      description,
      companyLogoUrl,
      items,
      dueDate,
    });

    try {
      await stellarService.create_invoice(invoice.invoiceNumber, req.user.walletAddress, 100, new Date(dueDate).getTime() / 1000);
    } catch (e) {
      console.error("Smart contract integration error:", e);
    }

    res.status(201).json({ invoice });
  } catch (err) {
    next(err);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === "freelancer") filter = { freelancerId: req.user._id };
    if (req.user.role === "client") {
      if (!req.user.walletAddress) {
        return res.json({ invoices: [], message: "Connect your wallet to see invoices sent to you." });
      }
      filter = { clientWalletAddress: req.user.walletAddress };
    }
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.json({ invoices });
  } catch (err) {
    next(err);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "freelancerId",
      "name email walletAddress"
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    try {
      const onchainData = await stellarService.get_invoice(invoice.invoiceNumber);
      console.log("On-chain invoice status:", onchainData.status);
    } catch (e) {
      console.error("Smart contract integration error:", e);
    }

    res.json({ invoice });
  } catch (err) {
    next(err);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    if (String(invoice.freelancerId) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this invoice" });
    }
    const allowedFields = ["title", "description", "items", "dueDate", "status"];
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) invoice[f] = req.body[f];
    });
    await invoice.save();

    try {
      if (req.body.status === "Paid") {
        await stellarService.mark_paid(invoice.invoiceNumber);
      }
    } catch (e) {
      console.error("Smart contract integration error:", e);
    }

    res.json({ invoice });
  } catch (err) {
    next(err);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    if (String(invoice.freelancerId) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this invoice" });
    }
    await invoice.deleteOne();

    try {
      await stellarService.cancel_invoice(invoice.invoiceNumber);
    } catch (e) {
      console.error("Smart contract integration error:", e);
    }

    res.json({ message: "Invoice deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
