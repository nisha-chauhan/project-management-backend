const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");
const UserModel = require("../models/userModel");

// CREATE Task
const createTask = async (req, res) => {
  try {
    const { projectId, title, description, status, dueDate } = req.body;
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }
    const project = await ProjectModel.findOne({
      _id: projectId,
      user_id: req.user.id,
    });
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found or not owned" });

    const task = await TaskModel.create({
      project_id: projectId,
      title,
      description,
      status,
      dueDate,
    });
    res.status(200).json({ task: task, message: "Task created Successfully" });
  } catch (err) {
    console.error("Error in createProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }

    const task = await TaskModel.findById(id).populate("project_id");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.project_id.user_id.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error in updateProject:", err);
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

    const task = await TaskModel.findById(id).populate("project_id");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.project_id.user_id.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error in deleteProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET Task by PROJECTS
const getTasksByProject = async (req, res) => {
  try {
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }
    const { projectId } = req.params;
    const { status } = req.query;

    // verify ownership
    const project = await ProjectModel.findOne({
      _id: projectId,
      user_id: req.user.id,
    });
    if (!project)
      return res
        .status(404)
        .json({ message: "Project not found or not owned" });

    const filter = { project_id: projectId };
    if (status) filter.status = status;
    const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    console.error("Error in getAllProjects:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
};
