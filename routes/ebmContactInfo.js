const express = require("express");
const ContactInfo = require("../models/ebmContactInfo");
const router = express.Router();

/* GET contact info */
router.get("/", async (req, res) => {
  try {
    const info = await ContactInfo.findOne();
    res.json(info);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* PUT: update entire contact info */
router.put("/", async (req, res) => {
  try {
    const { address, phone, email } = req.body;

    if (!address || !phone || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const info = await ContactInfo.findOne();
    if (!info) {
      return res.status(404).json({ message: "Contact info not found" });
    }

    // Update the full object
    info.address = address;
    info.phone = phone;
    info.email = email;

    const updated = await info.save();

    res.json({ message: "Contact info updated successfully", data: updated });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update contact info", error: error.message });
  }
});

module.exports = router;
