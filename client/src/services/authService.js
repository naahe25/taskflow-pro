import API from "../api/axios";

const getToken = () => localStorage.getItem("token");

export const loginSuccess = async () => {
  const response = await API.get("/auth/login/success", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const loginWithCredentials = async (loginData) => {
  const response = await API.post("/auth/login", loginData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};
