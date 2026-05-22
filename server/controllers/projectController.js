const Project = require("../models/Project");
const Task = require("../models/Task");

const createProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;

    const project = await Project.create({
      title,
      description,
      teamMembers: teamMembers || [],
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email avatar")
      .populate("teamMembers", "name email avatar")
      .sort({
        createdAt: -1,
      })
      .lean();

    for (let project of projects) {
      const totalTasks = await Task.countDocuments({ project: project._id });
      const completedTasks = await Task.countDocuments({
        project: project._id,
        status: "done",
      });
      project.progress =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Prevent orphan tasks when a project is deleted
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email avatar")
      .populate("teamMembers", "name email avatar")
      .populate("files.uploadedBy", "name email avatar")
      .populate("updates.user", "name email avatar");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({
      project: project._id,
      status: "done",
    });
    const progress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const projectObj = project.toObject();
    projectObj.progress = progress;

    res.status(200).json(projectObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProjectUpdate = async (req, res) => {
  try {
    const { message } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.updates.push({
      message,
      user: req.user._id,
    });

    await project.save();

    // populate user info before sending response
    await project.populate("updates.user", "name email avatar");

    res.status(201).json(project.updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProjectFile = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    project.files.push({
      url: fileUrl,
      name: req.file.originalname,
      uploadedBy: req.user._id,
    });

    await project.save();

    await project.populate("files.uploadedBy", "name email avatar");

    res.status(201).json(project.files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.title = title || project.title;
    project.description = description || project.description;

    // We allow setting teamMembers to empty array
    if (teamMembers !== undefined) {
      project.teamMembers = teamMembers;
    }

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  addProjectUpdate,
  uploadProjectFile,
  updateProject,
};
