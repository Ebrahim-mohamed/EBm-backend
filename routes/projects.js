// backend/routes/projects.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Project = require("../models/project");

const router = express.Router();

// ---------------------- Multer setup ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ---------------------- Routes ----------------------

// GET /projects - get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().lean(); // .lean() for better performance
    return res.status(200).json(projects);
  } catch (error) {
    console.error("GET /projects error:", error);
    return res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});

// POST /projects - create a new project
router.post("/", upload.single("projectImage"), async (req, res) => {
  try {
    console.log("POST /projects - Request received");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { nameEN, nameAR, desEN, desAR } = req.body;

    // Validate required fields
    if (!nameEN || !nameAR || !desEN || !desAR) {
      return res.status(400).json({
        message: "All fields are required",
        missing: {
          nameEN: !nameEN,
          nameAR: !nameAR,
          desEN: !desEN,
          desAR: !desAR,
        },
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Project image is required" });
    }

    const newProject = new Project({
      title: { en: nameEN, ar: nameAR },
      description: { en: desEN, ar: desAR },
      image: req.file.filename,
    });

    const savedProject = await newProject.save();
    console.log("Project saved successfully:", savedProject._id);

    return res.status(201).json({
      message: "Project added successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error("POST /projects error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
        details: error.errors,
      });
    }

    return res.status(500).json({
      message: "Failed to add project",
      error: error.message,
    });
  }
});

// PUT /projects/:id - update a project
router.put("/:id", upload.single("projectImage"), async (req, res) => {
  try {
    console.log("PUT /projects/:id - Request received");
    console.log("ID:", req.params.id);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { id } = req.params;
    const { nameEN, nameAR, desEN, desAR } = req.body;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update fields only if provided
    if (nameEN) project.title.en = nameEN;
    if (nameAR) project.title.ar = nameAR;
    if (desEN) project.description.en = desEN;
    if (desAR) project.description.ar = desAR;
    if (req.file) project.image = req.file.filename;

    const updated = await project.save();
    console.log("Project updated successfully:", updated._id);

    return res.status(200).json({
      message: "Project updated successfully",
      project: updated,
    });
  } catch (error) {
    console.error("PUT /projects/:id error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
});

// DELETE /projects/:id - delete a project
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE /projects/:id - Request received");
    console.log("ID:", req.params.id);

    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Project deleted successfully:", id);

    return res.status(200).json({
      message: "Project deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("DELETE /projects/:id error:", error);
    return res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size too large. Maximum size is 5MB",
      });
    }
    return res.status(400).json({
      message: "File upload error",
      error: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
    });
  }

  next();
});

module.exports = router;
