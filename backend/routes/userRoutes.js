const express = require("express");
const { getMe, updateWallet } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/me", protect, getMe);
router.patch("/wallet", protect, updateWallet);

module.exports = router;
