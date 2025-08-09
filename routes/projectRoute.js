const express = require("express");
const {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
} = require("../controllers/projectController");
const { userTokenCheck } = require("../middleware/authmiddleware");
const { getTasksByProject } = require("../controllers/taskController");
const router = express.Router();

// router.use(protect);

router.post("/", userTokenCheck, createProject);
router.get("/", userTokenCheck, getAllProjects);
router.get("/:id", userTokenCheck, getProjectById);
router.put("/:id", userTokenCheck, updateProject);
router.delete("/:id", userTokenCheck, deleteProject);
router.get("/:projectId/tasks", userTokenCheck, getTasksByProject);

module.exports = router;
