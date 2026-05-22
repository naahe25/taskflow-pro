import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import Layout from "../components/layout/Layout";
import Navbar from "../components/layout/Navbar";
import toast from "react-hot-toast";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
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

  return (
    <Layout>
      <div className="p-8">
        <Navbar />
        <h1 className="text-4xl font-bold mb-8">Projects</h1>
        <form onSubmit={createProject} className="bg-slate-900 p-6 rounded-2xl flex flex-col gap-4 mb-8">
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
            <label className="block mb-2 font-semibold">Assign Team Members</label>
            <div className="flex gap-2 flex-wrap">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
                  onClick={() => toggleMemberSelection(member._id)}
                  className={`cursor-pointer px-4 py-2 rounded-full border ${
                    selectedMembers.includes(member._id)
                      ? "bg-cyan-500 border-cyan-500 text-white"
                      : "bg-transparent border-slate-700 text-slate-400 hover:border-cyan-500"
                  }`}
                >
                  {member.name}
                </div>
              ))}
            </div>
          </div>
          <button className="bg-cyan-500 py-3 rounded-xl font-semibold mt-2">
            Create Project
          </button>
        </form>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-slate-900 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                  <span className="text-sm font-semibold bg-slate-800 px-3 py-1 rounded-full text-cyan-400">
                    {project.progress !== undefined ? `${project.progress}%` : '0%'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress !== undefined ? project.progress : 0}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 mb-4">{project.description}</p>
                <div className="mb-4">
                  <h3 className="font-semibold text-sm mb-2 text-slate-300">Assigned Team:</h3>
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.teamMembers.map(member => (
                        <div key={member._id} className="bg-slate-800 text-xs px-2 py-1 rounded-full flex items-center gap-2">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full" />
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
                    <p className="text-xs text-slate-500">No members assigned</p>
                  )}
                </div>
              </div>
              <Link to={`/projects/${project._id}`} className="mt-4 block w-full text-center bg-slate-800 hover:bg-cyan-500 hover:text-white transition-colors duration-300 text-cyan-400 py-2 rounded-xl font-semibold">
                View Project Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;