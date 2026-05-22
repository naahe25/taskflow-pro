import API from "../api/axios";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getTasks = async () => {
  const response = await API.get(
    "/tasks",

    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const createTask = async (taskData) => {
  const response = await API.post(
    "/tasks",

    taskData,

    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await API.put(
    `/tasks/${id}`,

    { status },

    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const deleteTask = async (id) => {
  const response = await API.delete(
    `/tasks/${id}`,

    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};
