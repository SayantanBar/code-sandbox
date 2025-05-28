import { Route, Routes } from "react-router-dom";
import CreateProject from "./pages/CreateProject";
import ProjectPlayground from "./pages/ProjectPlayground";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<CreateProject />} />
      <Route path="/project/:projectId" element={<ProjectPlayground />} />
    </Routes>
  );
};

export default Router;
