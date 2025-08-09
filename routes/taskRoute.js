const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
} = require("../controllers/taskController");
const { userTokenCheck } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/", userTokenCheck, createTask);
router.get("/project/:projectId", userTokenCheck, getTasksByProject);
router.put("/:id", userTokenCheck, updateTask);
router.delete("/:id", userTokenCheck, deleteTask);

module.exports = router;
