const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  addProjectUpdate,
  uploadProjectFile,
  updateProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");
const AdminOnly = require("../middleware/adminMiddleware");
const upload = require("../utils/fileUpload");

router.post("/", protect, AdminOnly, createProject);

router.get("/", protect, getProjects);

router.get("/:id", protect, getProjectById);

router.post("/:id/updates", protect, addProjectUpdate);

router.post("/:id/files", protect, upload.single("file"), uploadProjectFile);

router.delete("/:id", protect, AdminOnly, deleteProject);

router.put("/:id", protect, AdminOnly, updateProject);

module.exports = router;
