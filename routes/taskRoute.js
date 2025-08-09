const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { userTokenCheck } = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/", userTokenCheck, createTask);
router.put("/:id", userTokenCheck, updateTask);
router.delete("/:id", userTokenCheck, deleteTask);

module.exports = router;
