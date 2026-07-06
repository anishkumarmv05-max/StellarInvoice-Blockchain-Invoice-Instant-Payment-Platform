const express = require("express");
const { getStats } = require("../controllers/adminController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", protect, requireRole("admin"), getStats);

module.exports = router;
