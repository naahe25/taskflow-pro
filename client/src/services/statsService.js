import API from "../api/axios";

const getToken = () => localStorage.getItem("token");

export const getDashboardStats = async () => {
  const response = await API.get("/stats", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
