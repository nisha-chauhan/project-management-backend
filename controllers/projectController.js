const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");
const UserModel = require("../models/userModel");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }
    const { title, description, status } = req.body;

    const project = await ProjectModel.create({
      title,
      description,
      status,
      user_id: req.user.id,
    });
    res.status(201).json(project);
  } catch (err) {
    console.error("Error in createProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }

    const project = await ProjectModel.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      req.body,
      { new: true }
    );

    if (!project)
      return res.status(404).json({ message: "Project not updated" });
    res.json(project);
  } catch (err) {
    console.error("Error in updateProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }

    const project = await ProjectModel.findOneAndDelete({
      _id: id,
      user_id: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const deletetask = await TaskModel.deleteMany({ project_id: project._id });
    res.json({ message: "Project and its tasks deleted" });
  } catch (err) {
    console.error("Error in deleteProject:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PROJECTS
const getAllProjects = async (req, res) => {
  try {
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const q = req.query.title
      ? { title: new RegExp(req.query.title, "i") }
      : {};

    const filter = { user_id: req.user.id, ...q };
    const total = await ProjectModel.countDocuments(filter);
    const projects = await ProjectModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ total, page, limit, projects });
  } catch (err) {
    console.error("Error in getAllProjects:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET PROJECT BY ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await UserModel.findById(req.user.id);
    if (!findUser) {
      res.status(404).json({ message: "User Not found" });
    }

    const project = await ProjectModel.findOne({
      _id: id,
      user_id: req.user.id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await TaskModel.find({ project_id: project._id });
    res.json({ project, tasks });
  } catch (err) {
    console.error("Error in getProjectById:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getAllProjects,
  getProjectById,
};
