const express = require("express");
const interContactInfo = require("../models/interContactInfo");
const router = express.Router();
const mongoose = require("mongoose");

// Function to create initial contact info
const interCreateInitialContact = async () => {
  try {
    const exists = await interContactInfo.findOne();
    if (!exists) {
      await interContactInfo.create({
        address: {
          en: "Default address",
          ar: "العنوان الافتراضي",
        },
        phone: {
          en: "+1 000 000 0000",
          ar: "+1 000 000 0000",
        },
        email: "info@example.com",
      });
      console.log("📌 Initial inter ContactInfo created");
    }
  } catch (err) {
    console.error("❌ Failed to create initial inter contact info:", err);
  }
};

// Wait until Mongoose is connected
mongoose.connection.once("open", () => {
  console.log("MongoDB connected - setting up initial inter contact info");
  interCreateInitialContact();
});

/**
 * @route GET /api/inter-contact-info
 * @desc Get the single InterContactInfo document
 */
router.get("/", async (req, res) => {
  try {
    const info = await interContactInfo.findOne();
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route PUT /api/inter-contact-info
 * @desc Update the single InterContactInfo document
 */
router.put("/", async (req, res) => {
  try {
    const info = await interContactInfo.findOne();

    if (!info) {
      return res.status(404).json({ message: "InterContactInfo not found" });
    }

    info.address = req.body.address || info.address;
    info.phone = req.body.phone || info.phone;
    info.email = req.body.email || info.email;

    const updated = await info.save();
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update inter contact info", error });
  }
});

module.exports = router;
