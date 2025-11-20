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

const upload = multer({ storage, fileFilter });

// ---------------------- Routes ----------------------

// GET /projects - get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch projects", error: error.message });
  }
});

// POST /projects - create a new project
router.post("/", upload.single("projectImage"), async (req, res) => {
  try {
    const { nameEN, nameAR, desEN, desAR } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Project image is required" });
    }

    const newProject = await Project.create({
      title: { en: nameEN, ar: nameAR },
      description: { en: desEN, ar: desAR },
      image: req.file.filename, // store filename
    });

    res.json({ message: "Project added successfully", project: newProject });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to add project", error: error.message });
  }
});

// PUT /projects/:id - update a project
router.put("/:id", upload.single("projectImage"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nameEN, nameAR, desEN, desAR } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.title.en = nameEN || project.title.en;
    project.title.ar = nameAR || project.title.ar;
    project.description.en = desEN || project.description.en;
    project.description.ar = desAR || project.description.ar;

    if (req.file) project.image = req.file.filename;

    const updated = await project.save();
    res.json({ message: "Project updated successfully", project: updated });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update project", error: error.message });
  }
});

// DELETE /projects/:id - delete a project
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete project", error: error.message });
  }
});

module.exports = router;
