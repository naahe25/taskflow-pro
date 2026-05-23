import API from "../api/axios";

const getToken = () => localStorage.getItem("token");

export const loginSuccess = async () => {
  const response = await API.get("/auth/login/success", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};
