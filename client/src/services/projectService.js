import API from "../api/axios";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getProjects = async () => {
  const response = await API.get(
    "/projects",

    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const createProject = async (projectData) => {
  const response = await API.post(
    "/projects",

    projectData,

    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(
    `/projects/${id}`,

    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await API.put(
    `/projects/${id}`,
    projectData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};
