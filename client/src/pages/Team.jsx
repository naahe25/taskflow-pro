import { useState, useEffect } from "react";
import API from "../api/axios";
import Layout from "../components/layout/Layout";
import Navbar from "../components/layout/Navbar";
import toast from "react-hot-toast";

const Team = () => {
  const [email, setEmail] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTeamMembers = async () => {
    try {
      const response = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch team members");
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const inviteMember = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        "/invites",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success(response.data.message || "Team member added successfully");
      setEmail("");
      fetchTeamMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add team member");
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <Navbar />
        <h1 className="text-4xl font-bold mb-8">Team Management</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Add Member</h2>
            <form onSubmit={inviteMember} className="bg-slate-900 p-6 rounded-2xl flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter Gmail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 rounded-xl bg-slate-800 outline-none w-full"
                required
              />
              <button type="submit" className="bg-cyan-500 py-3 rounded-xl font-semibold">
                Add Team Member
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Current Team</h2>
            <div className="bg-slate-900 rounded-2xl p-4 flex flex-col gap-4">
              {teamMembers.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-4">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${member.role === 'Admin' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {member.role}
                  </span>
                </div>
              ))}
              {teamMembers.length === 0 && <p className="text-slate-400 text-center py-4">No team members found.</p>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Team;