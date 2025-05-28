import {
  createProjectService,
  getProjectTreeService,
} from "../services/projectService.js";

export const createProjectController = async (req, res) => {
  const projectId = await createProjectService();
  console.log("this is my project id ->> ", projectId);
  return res.json({ message: "Project created", data: projectId });
};

export const getProjectTree = async (req, res) => {
  const tree = await getProjectTreeService(req.params.projectId);
  return res.status(200).json({
    data: tree,
    success: true,
    message: "successfully fetch the tree!",
  });
};
