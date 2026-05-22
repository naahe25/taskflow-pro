import API from "../api/axios";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getUsers = async () => {
  const response = await API.get("/users", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.data;
};
