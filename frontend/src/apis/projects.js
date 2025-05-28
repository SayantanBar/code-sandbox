import axiosInstance from "../config/axiosConfig";

export const createProjectApi = async () => {
  try {
    const response = await axiosInstance.post("/api/v1/projects");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProjectTree = async ({ projectId }) => {
  try {
    console.log("the project id isss ", projectId);
    const id = projectId;
    const response = await axiosInstance.get(`/api/v1/projects/${id}/tree`);
    console.log(response?.data);
    return response?.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
