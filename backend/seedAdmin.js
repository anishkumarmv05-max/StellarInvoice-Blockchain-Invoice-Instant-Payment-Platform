/**
 * Run once to create an admin account:
 *   node seedAdmin.js
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env, or falls back to defaults below.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL || "admin@stellarinvoice.dev";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  await User.create({ name: "Admin", email, password, role: "admin" });
  console.log("Admin created:", email, "password:", password);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
