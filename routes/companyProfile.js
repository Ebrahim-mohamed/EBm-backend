const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Setup multer to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(), // store in memory temporarily
  limits: { fileSize: 20 * 1024 * 1024 }, // max 20MB
});

// POST: Upload company profile
router.post("/", upload.single("companyProfile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save the file into /public
    const uploadDir = path.join(__dirname, "../public");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, "company-profile.pdf");

    fs.writeFileSync(filePath, req.file.buffer);

    res.json({
      success: true,
      message: "Company Profile uploaded successfully",
      fileUrl: "/company-profile.pdf",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
