const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const getDashboardStats = async () => {
  const [projects, tasks, users] = await Promise.all([
    Project.find().select("status"),
    Task.find().select("_id"),
    User.find().select("_id"),
  ]);

  // If you want to define what "active" means, adjust this filter.
  // Currently: projects with status not equal to "completed" are considered active.
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
