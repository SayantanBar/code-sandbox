import { useParams } from "react-router-dom";
import { EditorComponent } from "../components/molecules/editorcomponent/EditorComponent";
import { EditorButton } from "../components/atoms/editorButton/EditorButton";
import { TreeStructure } from "../components/organisms/treeStructure/TreeStructure";
import { useTreeStructureStore } from "../stores/treeStructureStore";
import { useEffect } from "react";
import { useEditorSocketStore } from "../stores/editorSocketStore";
import { io } from "socket.io-client";
import { useFileContextMenuStore } from "../stores/fileContextMenuStore";
import { useFolderContextMenuStore } from "../stores/folderContextMenuStore";
import { BrowserTerminal } from "../components/molecules/terminal/BrowserTerminal";
import { useTerminalSocketStore } from "../stores/terminalSocketStore";
import { Browser } from "../components/organisms/browser/Browser";
import { FaFirefoxBrowser } from "react-icons/fa";
import { usePortStore } from "../stores/portStore";

import { useActiveFileTabStore } from "../stores/activeFileTabStore";

import { InstructionPopup } from "../components/atoms/InstructionPopUp";
// -----------------------------------------------Imports-------------------------------------------------------------------------------------------------

const ProjectPlayground = () => {
  const { projectId: projectIdFromUrl } = useParams();
  const { setProjectId, projectId } = useTreeStructureStore();
  const { setEditorSocket, editorSocket } = useEditorSocketStore();
  const { setTerminalSocket, terminalSocket } = useTerminalSocketStore();
  console.log("projectidFrom url ", projectIdFromUrl);
  const { port } = usePortStore();
  const { activeFileTab } = useActiveFileTabStore();

  const fetchPort = (e) => {
    e.preventDefault();
    console.log("This is editor socket store", editorSocket);

    editorSocket.emit("getPort", { containerName: projectIdFromUrl });
    console.log("fetching the port...");

    // Listen for the port once (cleaner than permanent .on)
    editorSocket.once("getPortSuccess", (data) => {
      const port = data?.port;
      if (port) {
        const url = `http://localhost:${port}/`;
        console.log("Opening browser at", url);
        window.open(url, "_blank");
      } else {
        console.error("Port not received or invalid:", data);
      }
    });
  };

  useEffect(() => {
    setProjectId(projectIdFromUrl);

    const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
      query: { projectId: projectIdFromUrl },
    });

    const ws = new WebSocket(
      "ws://localhost:3000/terminal?projectId=" + projectIdFromUrl
    );

    setTerminalSocket(ws);
    setEditorSocket(editorSocketConn);
  }, [setProjectId, projectIdFromUrl, setEditorSocket, setTerminalSocket]);

  const { setIsOpen } = useFileContextMenuStore();
  const { setIsOpen: setIsOpenFolderContextMenu } = useFolderContextMenuStore();

  return (
    <div
      className="flex h-screen bg-[#1e1e1e] text-white"
      onClick={() => {
        setIsOpen(false);
        setIsOpenFolderContextMenu(false);
      }}
    >
      {/* Sidebar */}
      {projectId && <TreeStructure />}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor buttons (like tabs) */}
        <div className="bg-[#252526]  border-b border-gray-700 flex justify-between">
          <EditorButton filename={activeFileTab?.fileName} />

          <div className="flex mr-6">
            <InstructionPopup />
            <div className="relative group inline-block p-2">
              <button onClick={(e) => fetchPort(e)} className="text-white">
                <FaFirefoxBrowser className="cursor-pointer" />
              </button>
              <div className=" absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                Browser
              </div>
            </div>
          </div>
        </div>
        {/* Editor and Terminal Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor */}
          <div className="flex-1 overflow-auto p-4">
            <EditorComponent />
          </div>

          {/* Terminal */}

          {true && (
            <div className="h-[250px] border-2 border-gray-700 bg-[#1e1e1e] overflow-auto p-2 ">
              <BrowserTerminal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPlayground;
