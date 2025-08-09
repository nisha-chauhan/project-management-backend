const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");
const UserModel = require("../models/userModel");

// CREATE Task
const createTask = async (req, res) => {
  try {
    const { projectId, title, description, status, dueDate, assign_to } =
      req.body;
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }
    const project = await ProjectModel.findOne({
      _id: projectId,
      // creater_id: req.user.id,
    });
    if (!project)
      return res.status(404).json({ message: "Project not found." });

    const task = await TaskModel.create({
      project_id: projectId,
      title,
      description,
      status: status?.toUpperCase(),
      dueDate,
      assign_to,
      creater_id: req.user.id,
    });
    res.status(201).json({ task: task, message: "Task created Successfully" });
  } catch (err) {
    console.error("Error in createProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      return res.status(404).json({ message: "User Not found" });
    }

    const task = await TaskModel.findById(id).populate("project_id");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.project_id.creater_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ updatedTask, message: "Task updated Successfully" });
  } catch (err) {
    console.error("Error in updateTask:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }

    const deletedTask = await TaskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error in deleteProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET Task by PROJECTS
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;
    // Find project and verify ownership
    const project = await ProjectModel.findOne({
      _id: projectId,
      creater_id: req.user.id,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find tasks with optional status filter
    const filter = { project_id: projectId };
    if (status) filter.status = status;

    const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });

    // Respond with project name + tasks
    res.status(200).json({
      projectName: project.title,
      project_id: project._id,
      tasks,
    });
  } catch (err) {
    console.error("Error in getTasksByProject:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
};
