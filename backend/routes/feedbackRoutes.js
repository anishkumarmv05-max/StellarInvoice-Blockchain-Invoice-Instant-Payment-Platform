const express = require("express");
const { submitFeedback, getAllFeedback } = require("../controllers/feedbackController");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", submitFeedback); // allow anonymous feedback too
router.get("/", protect, requireRole("admin"), getAllFeedback);

module.exports = router;
