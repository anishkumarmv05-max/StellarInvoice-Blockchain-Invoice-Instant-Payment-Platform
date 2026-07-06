const express = require("express");
const { recordPayment, getPaymentsForInvoice } = require("../controllers/paymentController");

const router = express.Router();

router.post("/", recordPayment); // public - client may not be logged in
router.get("/:invoiceId", getPaymentsForInvoice);

module.exports = router;
