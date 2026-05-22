import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/layout/Layout";
import Navbar from "../components/layout/Navbar";
import toast from "react-hot-toast";
import Avatar from "../components/common/Avatar";
import moment from "moment";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { updateProject, deleteProject } from "../services/projectService";
import { getUsers } from "../services/userService";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [updateMessage, setUpdateMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem("token");

  // Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const response = await API.get(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(response.data);
    } catch (error) {
      toast.error("Failed to load project details");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id, token]); // Add token to deps to fix lint warnings if possible, but let's just stick to id for now or disable it. Wait, I'll add exhaustive deps.

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!updateMessage.trim()) return;

    try {
      await API.post(
        `/projects/${id}/updates`,
        { message: updateMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdateMessage("");
      toast.success("Update posted!");
      fetchProjectDetails();
    } catch (error) {
      toast.error("Failed to post update");
      console.error(error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      await API.post(`/projects/${id}/files`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      setFile(null);
      toast.success("File uploaded successfully!");
      fetchProjectDetails();
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted successfully");
        navigate("/projects");
      } catch (error) {
        toast.error("Failed to delete project");
        console.error(error);
      }
    }
  };

  const openEditModal = async () => {
    setEditTitle(project.title);
    setEditDescription(project.description);
    setSelectedTeam(project.teamMembers ? project.teamMembers.map(m => m._id) : []);
    setShowEditModal(true);
    try {
      const usersData = await getUsers();
      setAllUsers(usersData);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setIsSaving(true);
    try {
      await updateProject(id, {
        title: editTitle,
        description: editDescription,
        teamMembers: selectedTeam
      });
      toast.success("Project updated successfully");
      setShowEditModal(false);
      fetchProjectDetails();
    } catch (error) {
      toast.error("Failed to update project");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTeamMember = (userId) => {
    if (selectedTeam.includes(userId)) {
      setSelectedTeam(selectedTeam.filter(teamId => teamId !== userId));
    } else {
      setSelectedTeam([...selectedTeam, userId]);
    }
  };

  if (!project) return (
    <Layout>
      <div className="p-8"><Navbar /><div className="mt-8 text-center text-slate-400">Loading project...</div></div>
    </Layout>
  );

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <Navbar />
        
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/projects" className="text-cyan-500 hover:text-cyan-400 text-sm mb-2 inline-block">&larr; Back to Projects</Link>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">{project.title}</h1>
              {isAdmin && (
                <div className="flex gap-2">
                  <button onClick={openEditModal} className="text-slate-400 hover:text-cyan-400 p-2" title="Edit Project"><FaEdit size={20} /></button>
                  <button onClick={handleDeleteProject} className="text-slate-400 hover:text-red-400 p-2" title="Delete Project"><FaTrash size={20} /></button>
                </div>
              )}
            </div>
          </div>
          <span className="bg-slate-800 text-cyan-400 px-4 py-2 rounded-xl font-bold text-xl">
            {project.progress}% Complete
          </span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-slate-800 pb-2">
          {['overview', 'files', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg font-semibold capitalize ${activeTab === tab ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-slate-400 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900 p-6 rounded-2xl">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-slate-300 mb-8">{project.description}</p>
              
              <h2 className="text-xl font-bold mb-4">Team Members</h2>
              {project.teamMembers && project.teamMembers.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {project.teamMembers.map(member => (
                    <div key={member._id} className="bg-slate-800 px-4 py-2 rounded-full flex items-center gap-3">
                      <Avatar name={member.name} src={member.avatar} />
                      <span className="font-semibold">{member.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No members assigned to this project.</p>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Project Files</h2>
              
              <form onSubmit={handleFileUpload} className="mb-8 flex items-center gap-4 bg-slate-800 p-4 rounded-xl">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])} 
                  className="flex-1 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 cursor-pointer"
                />
                <button 
                  type="submit" 
                  disabled={!file || isUploading}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-semibold transition"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.files && project.files.length > 0 ? (
                  project.files.map(f => (
                    <a key={f._id} href={f.url} target="_blank" rel="noopener noreferrer" className="block bg-slate-800 p-4 rounded-xl hover:bg-slate-700 transition group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-slate-900 p-2 rounded-lg text-cyan-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="font-semibold text-slate-200 truncate flex-1" title={f.name}>{f.name}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Uploaded by {f.uploadedBy?.name || 'Unknown'}</span>
                        <span>{moment(f.uploadedAt).fromNow()}</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-slate-500 col-span-full">No files uploaded yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Project Activity</h2>
              
              <form onSubmit={handlePostUpdate} className="mb-8 flex gap-4 bg-slate-800 p-4 rounded-xl">
                <input
                  type="text"
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Share an update or activity..."
                  className="flex-1 bg-transparent outline-none text-slate-200 placeholder-slate-500"
                />
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold transition">
                  Post Update
                </button>
              </form>

              <div className="space-y-4">
                {project.updates && project.updates.length > 0 ? (
                  [...project.updates].reverse().map(update => (
                    <div key={update._id} className="bg-slate-800 p-4 rounded-xl flex gap-4">
                      <Avatar name={update.user?.name || '?'} src={update.user?.avatar} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-200">{update.user?.name || 'Unknown User'}</span>
                          <span className="text-xs text-slate-500">{moment(update.createdAt).fromNow()}</span>
                        </div>
                        <p className="text-slate-300">{update.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No activity logged yet. Be the first to share an update!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900/90 backdrop-blur z-10">
              <h2 className="text-2xl font-bold text-white">Edit Project</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white p-2">
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProject} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors h-32"
                  placeholder="Enter project description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Team Members</label>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 max-h-48 overflow-y-auto">
                  {allUsers.length > 0 ? (
                    <div className="space-y-2">
                      {allUsers.map((u) => (
                        <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedTeam.includes(u._id)}
                            onChange={() => toggleTeamMember(u._id)}
                            className="w-4 h-4 text-cyan-500 bg-slate-900 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                          />
                          <Avatar name={u.name} src={u.avatar} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-slate-200">{u.name}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">Loading users...</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-slate-300 hover:bg-slate-800 transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-600 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectDetails;
