import API from "../api/axios";

export const loginSuccess = async () => {
  const response = await API.get("/auth/login/success");

  return response.data;
};
