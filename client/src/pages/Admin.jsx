import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import Navbar from "../components/layout/Navbar";
import useAuth from "../hooks/useAuth";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useAuth();
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (id) => {
    try {
      await API.put(`/users/admin/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Promotion failed");
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <Navbar />
        <h1 className="text-4xl font-bold mb-6">Admin Panel</h1>
        <div className="bg-slate-900 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-800">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 capitalize">{user.role}</td>
                  <td className="p-4">
                    {currentUser?._id !== user._id && (
                      <button
                        onClick={() => makeAdmin(user._id)}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          user.role === "Admin"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-cyan-500 hover:bg-cyan-600"
                        }`}
                      >
                        {user.role === "Admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    )}
                    {currentUser?._id === user._id && (
                      <span className="text-slate-500 italic text-sm">Cannot modify own role</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;