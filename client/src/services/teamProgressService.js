import API from "../api/axios";

const getToken = () => localStorage.getItem("token");

export const getTeamProgress = async () => {
  const response = await API.get("/team-progress", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
