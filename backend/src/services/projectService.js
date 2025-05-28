import { mkdir } from "fs/promises";
import uuid4 from "uuid4";
import { exec } from "child_process";
import util from "util";
import directoryTree from "directory-tree";

import path from "path";
const execPromisified = util.promisify(exec);

export const createProjectService = async () => {
  try {
    const projectId = uuid4();
    console.log("project Id is -> ", projectId);

    // Create directory safely
    await mkdir(`./projects/${projectId}`, { recursive: true });

    // Start Vite scaffolding in the background
    execPromisified(
      `npm create vite@latest sandbox -- --template react`,
      { cwd: `./projects/${projectId}`, timeout: 60000 } // 60-second timeout
    )
      .then(({ stdout, stderr }) => {
        console.log("Vite scaffolding complete. stdout:", stdout);
        if (stderr) console.warn("Vite stderr:", stderr);
      })
      .catch((err) => console.error("Vite scaffolding failed:", err));

    // Send immediate response
    return projectId;
  } catch (err) {
    console.error("❌ Backend error:", err);
    return;
  }
};

export const getProjectTreeService = (projectId) => {
  const projectPath = path.resolve(`./projects/${projectId}`);
  const tree = directoryTree(projectPath);
  const modifiedTree = addIsFolderProperty(tree);
  return modifiedTree;
};

function addIsFolderProperty(node) {
  const newNode = {
    ...node,
    isFolder: Array.isArray(node.children) && node.children.length > 0,
  };

  if (newNode.isFolder) {
    newNode.children = node.children.map((child) => addIsFolderProperty(child));
  }

  return newNode;
}
