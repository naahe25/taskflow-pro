const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { buildWorkspaceQuery } = require("../utils/workspace");

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, project } = req.body;

    const workspaceQuery = buildWorkspaceQuery(req.user);
    const projectDoc = await Project.findOne({
      _id: project,
      ...workspaceQuery,
    });

    if (!projectDoc) {
      return res.status(403).json({
        message: "Project not found in your workspace",
      });
    }

    if (assignedTo) {
      const assignee = await User.findOne({
        _id: assignedTo,
        ...workspaceQuery,
      });

      if (!assignee) {
        return res.status(400).json({
          message: "Assigned user is not in your workspace",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      project,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const workspaceProjectIds = await Project.find(buildWorkspaceQuery(req.user)).select(
      "_id",
    );

    const tasks = await Task.find({
      project: { $in: workspaceProjectIds.map((project) => project._id) },
    })
      .populate("assignedTo", "name email avatar")
      .populate("project", "title")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project || project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Task not found in your workspace",
      });
    }

    task.status = req.body.status || task.status;

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project || project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Task not found in your workspace",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,

  getTasks,

  updateTaskStatus,

  deleteTask,
};
