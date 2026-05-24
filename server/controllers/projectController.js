const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { buildWorkspaceQuery } = require("../utils/workspace");

const getWorkspaceUserIds = async (user) => {
  const users = await User.find(buildWorkspaceQuery(user)).select("_id");
  return users.map((workspaceUser) => workspaceUser._id);
};

const getProjectCreatorId = (project) => {
  if (!project || !project.createdBy) {
    return "";
  }

  if (typeof project.createdBy === "object" && project.createdBy._id) {
    return project.createdBy._id.toString();
  }

  return project.createdBy.toString();
};

const canAccessProject = async (project, user) => {
  const workspaceUserIds = await getWorkspaceUserIds(user);
  const projectCreatorId = getProjectCreatorId(project);

  return workspaceUserIds.some(
    (workspaceUserId) => workspaceUserId.toString() === projectCreatorId,
  );
};

const createProject = async (req, res) => {
  try {
    const { title, description, teamMembers } = req.body;

    const workspaceUserIds = await getWorkspaceUserIds(req.user);
    const allowedTeamMembers = Array.isArray(teamMembers)
      ? teamMembers.filter((memberId) =>
          workspaceUserIds.some(
            (workspaceUserId) => workspaceUserId.toString() === memberId,
          ),
        )
      : [];

    const project = await Project.create({
      title,
      description,
      teamMembers: allowedTeamMembers,
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
    const workspaceUserIds = await getWorkspaceUserIds(req.user);

    const projects = await Project.find({
      createdBy: { $in: workspaceUserIds },
    })
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

    const accessible = await canAccessProject(project, req.user);
    if (!accessible) {
      return res.status(403).json({
        message: "Project not found in your workspace",
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

    const accessible = await canAccessProject(project, req.user);
    if (!accessible) {
      return res.status(403).json({ message: "Project not found in your workspace" });
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

    const accessible = await canAccessProject(project, req.user);
    if (!accessible) {
      return res.status(403).json({ message: "Project not found in your workspace" });
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

    const accessible = await canAccessProject(project, req.user);
    if (!accessible) {
      return res.status(403).json({ message: "Project not found in your workspace" });
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

    const accessible = await canAccessProject(project, req.user);
    if (!accessible) {
      return res.status(403).json({ message: "Project not found in your workspace" });
    }

    const workspaceUserIds = await getWorkspaceUserIds(req.user);

    project.title = title || project.title;
    project.description = description || project.description;

    // We allow setting teamMembers to empty array
    if (teamMembers !== undefined) {
      project.teamMembers = Array.isArray(teamMembers)
        ? teamMembers.filter((memberId) =>
            workspaceUserIds.some(
              (workspaceUserId) => workspaceUserId.toString() === memberId,
            ),
          )
        : [];
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
