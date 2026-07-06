const express = require("express");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/", protect, getInvoices);
router.get("/:id", getInvoiceById); // public - clients open via link without login
router.patch("/:id", protect, updateInvoice);
router.delete("/:id", protect, deleteInvoice);

module.exports = router;
