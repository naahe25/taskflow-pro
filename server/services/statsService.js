const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { buildWorkspaceQuery } = require("../utils/workspace");

const getDashboardStats = async (user) => {
  const workspaceQuery = buildWorkspaceQuery(user);

  const [projects, tasks, users] = await Promise.all([
    Project.find(workspaceQuery).select("status"),
    Task.find({
      project: {
        $in: await Project.find(workspaceQuery).select("_id"),
      },
    }).select("_id"),
    User.find(workspaceQuery).select("_id"),
  ]);

  const activeProjectsCount = projects.filter(
    (p) => p.status && p.status !== "completed",
  ).length;

  return {
    activeProjectsCount,
    tasksCount: tasks.length,
    teamMembersCount: users.length,
  };
};

module.exports = {
  getDashboardStats,
};
