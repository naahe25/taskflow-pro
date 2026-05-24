const normalizeEmail = (email) => {
  if (!email) {
    return "";
  }

  return email.trim().toLowerCase();
};

const getWorkspaceAdminEmail = (user) => {
  if (!user) {
    return "";
  }

  return normalizeEmail(user.workspaceAdminEmail || user.email);
};

const buildWorkspaceQuery = (user) => {
  const workspaceAdminEmail = getWorkspaceAdminEmail(user);

  if (!workspaceAdminEmail) {
    return {};
  }

  return { workspaceAdminEmail };
};

module.exports = {
  normalizeEmail,
  getWorkspaceAdminEmail,
  buildWorkspaceQuery,
};
