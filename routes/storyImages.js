const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../public/story-images");

const allowedTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const allowedExts = Object.values(allowedTypes);

function ensureDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Setup multer to handle multiple image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 20 }, // 10MB per image, 20 images per upload
  fileFilter: (req, file, cb) => {
    if (allowedTypes[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
    }
  },
});

// GET: list all story images
router.get("/", (req, res) => {
  try {
    ensureDir();

    const images = fs
      .readdirSync(uploadDir)
      .filter((file) => allowedExts.includes(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => ({
        filename: file,
        url: `/story-images/${file}`,
      }));

    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load images" });
  }
});

// POST: upload many story images at once
router.post("/", (req, res) => {
  upload.array("storyImages", 20)(req, res, (uploadErr) => {
    if (uploadErr) {
      console.error(uploadErr);
      return res.status(400).json({ error: uploadErr.message || "Upload failed" });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }

      ensureDir();

      const saved = req.files.map((file, index) => {
        const ext = allowedTypes[file.mimetype];
        const filename = `${Date.now()}-${index}-${Math.round(
          Math.random() * 1e6
        )}${ext}`;
        fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
        return { filename, url: `/story-images/${filename}` };
      });

      res.json({
        success: true,
        message: "Story images uploaded successfully",
        images: saved,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  });
});

// DELETE: remove one story image
router.delete("/:filename", (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(uploadDir, filename);

    if (!allowedExts.includes(path.extname(filename).toLowerCase())) {
      return res.status(400).json({ error: "Invalid file" });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Image not found" });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;