const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const router = express.Router();

const JWT_SECRET = "SUPER_SECRET_KEY"; // Change in production

// Create default admin once
router.post("/init-admin", async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: "ebmadmin" });
    if (existing) return res.json({ message: "Admin already exists" });

    const randomPassword = "x@r}Np7a,ajoo>s%1vJ)";
    const admin = new Admin({ username: "ebmadmin", password: randomPassword });
    await admin.save();

    res.json({
      message: "Admin created (manual mode)",
      username: "ebmadmin",
      password: randomPassword,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating admin" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, username: admin.username });
});

module.exports = router;
