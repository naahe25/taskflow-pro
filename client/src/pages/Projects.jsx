import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import API from "../api/axios";
import Layout from "../components/layout/Layout";
import Navbar from "../components/layout/Navbar";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { deleteProject, updateProject } from "../services/projectService";

const Projects = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "admin";
  const canAdminManageProjects = isAdmin;

  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const token = localStorage.getItem("token");

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSelectedMembers, setEditSelectedMembers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirm state
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        "/projects",
        { title, description, teamMembers: selectedMembers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Project created");
      setTitle("");
      setDescription("");
      setSelectedMembers([]);
      fetchProjects();
    } catch (error) {
      toast.error("Project creation failed");
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProject(null);
    setEditTitle("");
    setEditDescription("");
    setEditSelectedMembers([]);
  };

  const resolveMembersFromIds = (memberIds) => {
    return teamMembers.filter((member) => memberIds.includes(member._id));
  };

  // ── Edit helpers ──────────────────────────────────────────────
  const openEditModal = (project) => {
    setEditingProject(project);
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditSelectedMembers(
      project.teamMembers ? project.teamMembers.map((m) => m._id) : []
    );
    setShowEditModal(true);
  };

  const toggleEditMember = (memberId) => {
    setEditSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    const nextTitle = editTitle.trim();
    const nextDescription = editDescription.trim();

    if (!nextTitle || !nextDescription) {
      toast.error("Title and description cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      await updateProject(editingProject._id, {
        title: nextTitle,
        description: nextDescription,
        teamMembers: editSelectedMembers,
      });

      const updatedProject = {
        ...editingProject,
        title: nextTitle,
        description: nextDescription,
        teamMembers: resolveMembersFromIds(editSelectedMembers),
      };

      setProjects((prev) =>
        prev.map((project) =>
          project._id === editingProject._id ? updatedProject : project
        )
      );

      toast.success("Project updated successfully");
      closeEditModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete helpers ────────────────────────────────────────────
  const confirmDelete = (projectId) => {
    setDeletingId(projectId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProject = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    try {
      await deleteProject(deletingId);
      setProjects((prev) => prev.filter((project) => project._id !== deletingId));
      toast.success("Project deleted successfully");
      setShowDeleteConfirm(false);
      setDeletingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <Navbar />
        <h1 className="text-4xl font-bold mb-8">Projects</h1>

        <form
          onSubmit={createProject}
          className="bg-slate-900 p-6 rounded-2xl flex flex-col gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 outline-none"
            required
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-4 rounded-xl bg-slate-800 outline-none"
            required
          />
          <div>
            <label className="block mb-2 font-semibold">
              Assign Team Members
            </label>
            <div className="flex gap-2 flex-wrap">
              {teamMembers.map((member) => (
                <button
                  key={member._id}
                  type="button"
                  onClick={() => toggleMemberSelection(member._id)}
                  className={`cursor-pointer px-4 py-2 rounded-full border transition-colors ${
                    selectedMembers.includes(member._id)
                      ? "bg-cyan-500 border-cyan-500 text-white"
                      : "bg-transparent border-slate-700 text-slate-400 hover:border-cyan-500"
                  }`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>
          <button className="bg-cyan-500 py-3 rounded-xl font-semibold mt-2">
            Create Project
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-slate-900 p-6 rounded-2xl flex flex-col justify-between border border-slate-800"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h2 className="text-2xl font-bold flex-1 pr-2">
                    {project.title}
                  </h2>
                  <span className="text-sm font-semibold bg-slate-800 px-3 py-1 rounded-full text-cyan-400 shrink-0">
                    {project.progress !== undefined
                      ? `${project.progress}%`
                      : "0%"}
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        project.progress !== undefined ? project.progress : 0
                      }%`,
                    }}
                  />
                </div>

                <p className="text-slate-400 mb-4">{project.description}</p>

                <div className="mb-4">
                  <h3 className="font-semibold text-sm mb-2 text-slate-300">
                    Assigned Team:
                  </h3>
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.teamMembers.map((member) => (
                        <div
                          key={member._id}
                          className="bg-slate-800 text-xs px-2 py-1 rounded-full flex items-center gap-2"
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-5 h-5 rounded-full"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {member.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No members assigned
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/projects/${project._id}`}
                  className="flex-1 text-center bg-slate-800 hover:bg-cyan-500 hover:text-white transition-colors duration-300 text-cyan-400 py-2.5 rounded-xl font-semibold"
                >
                  View Project Details
                </Link>

                {canAdminManageProjects && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(project)}
                      title="Edit Project"
                      className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-300 px-4 py-2.5 rounded-xl transition-colors duration-300 border border-slate-700"
                    >
                      <FaEdit size={16} />
                      <span className="whitespace-nowrap">Edit Project</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDelete(project._id)}
                      title="Delete Project"
                      className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 px-4 py-2.5 rounded-xl transition-colors duration-300 border border-slate-700"
                    >
                      <FaTrash size={16} />
                      <span className="whitespace-nowrap">Delete Project</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                <h2 className="text-2xl font-bold text-white">Edit Project</h2>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-all"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProject} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-500"
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-500 resize-none"
                    placeholder="Enter project description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Team Members
                    <span className="ml-2 text-slate-500 font-normal text-xs">
                      ({editSelectedMembers.length} selected)
                    </span>
                  </label>
                  <div className="bg-slate-800 rounded-xl border border-slate-700 max-h-52 overflow-y-auto divide-y divide-slate-700/50">
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member) => {
                        const isSelected = editSelectedMembers.includes(
                          member._id
                        );
                        return (
                          <label
                            key={member._id}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-cyan-500/10"
                                : "hover:bg-slate-700/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleEditMember(member._id)}
                              className="w-4 h-4 rounded accent-cyan-500"
                            />
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-7 h-7 rounded-full"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-200 truncate">
                                {member.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {member.email}
                              </p>
                            </div>
                            {isSelected && (
                              <span className="text-xs text-cyan-400 font-medium shrink-0">
                                ✓
                              </span>
                            )}
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-slate-500 text-sm text-center py-6">
                        No users found
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-300 hover:bg-slate-800 transition-colors border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-600 text-white transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FaTrash className="text-red-400" size={16} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Delete Project?
                </h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                This will permanently delete the project and all its tasks.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Projects;
