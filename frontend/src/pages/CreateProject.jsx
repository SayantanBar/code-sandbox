import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../hooks/api/mutation/useCreateProject";

const CreateProject = () => {
  const { createProjectMutation, isPending } = useCreateProject();
  const navigate = useNavigate();
  const handleCreateProject = async () => {
    console.log("going to trigger the api");
    try {
      const response = await createProjectMutation();
      navigate(`/project/${response.data}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-xl font-semibold text-blue-700 animate-pulse">
          Creating your project...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center py-16 px-6">
      {/* Header */}
      <div className="text-center mb-12 ">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          Create a New Project
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">
          Choose a framework to start coding right in your browser. Build, test,
          and deploy in seconds.
        </p>
      </div>

      {/* Framework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* React Card */}
        <div className="bg-white rounded-3xl shadow-xl border-t-4 border-blue-500 p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <img
              src="https://reactjs.org/logo-og.png"
              alt="React Logo"
              className="w-14 h-14 mr-4"
            />
            <h2 className="text-2xl font-bold text-gray-800">React</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Create dynamic, component-based applications using React — one of
            the most popular JS libraries.
          </p>
          <button
            onClick={handleCreateProject}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl cursor-pointer hover:bg-blue-700 transition duration-200"
          >
            Create React Project
          </button>
        </div>

        {/* Next.js Placeholder */}
        <div className="bg-white rounded-3xl shadow-lg p-6 opacity-50 cursor-not-allowed border-t-4 border-gray-400">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 mr-4 bg-gray-200 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-600">Next.js</h2>
          </div>
          <p className="text-gray-500 mb-6">
            Coming soon! Build fullstack apps with server-rendering using
            Next.js.
          </p>
          <button
            disabled
            className="w-full bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-xl"
          >
            Coming Soon
          </button>
        </div>

        {/* Vue Placeholder */}
        <div className="bg-white rounded-3xl shadow-lg p-6 opacity-50 cursor-not-allowed border-t-4 border-gray-400">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 mr-4 bg-gray-200 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-600">Vue</h2>
          </div>
          <p className="text-gray-500 mb-6">
            Coming soon! Create intuitive UIs with Vue.js.
          </p>
          <button
            disabled
            className="w-full bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-xl"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
