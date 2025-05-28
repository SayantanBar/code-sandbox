import { useState, useEffect } from "react";
import FileIcon from "./FileIcon";
import { ChevronRight, ChevronDown, Folder as FolderIcon } from "lucide-react";
import { useEditorSocketStore } from "../../../stores/editorSocketStore";
import { useFileContextMenuStore } from "../../../stores/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../stores/folderContextMenuStore";
import { useCreatePromptStore } from "../../../stores/createPromptStore";
import { useActiveFileTabStore } from "../../../stores/activeFileTabStore";

export function Tree({ explorer, isVisible }) {
  const { editorSocket } = useEditorSocketStore();
  const [expand, setExpand] = useState(false);

  const {
    setX: setFileContextMenuX,
    setY: setFileContextMenuY,
    setIsOpen: setFileContextMenuIsOpen,
    setFile,
  } = useFileContextMenuStore();

  const {
    setX: setFolderContextMenuX,
    setY: setFolderContextMenuY,
    setIsOpen: setFolderContextMenuIsOpen,
    setFolder,
  } = useFolderContextMenuStore();
  const { setTargetPath } = useCreatePromptStore();
  const handleFileClick = (e, explorer) => {
    e.stopPropagation();
    console.log("Clicked file:", explorer.name);
    console.log("the path is", explorer.path);
    editorSocket.emit("readFile", {
      pathToFileOrFolder: explorer.path,
    });
  };

  function handleContextMenuForFile(e, path) {
    e.preventDefault();
    console.log("Right clicked on path", path);
    setFile(path);

    setFileContextMenuX(e.clientX);
    setFileContextMenuY(e.clientY);
    setFileContextMenuIsOpen(true);
  }

  function handleContextMenuForFolder(e, path) {
    e.preventDefault();
    setFolder(path);
    setTargetPath(path);
    setFolderContextMenuX(e.clientX);
    setFolderContextMenuY(e.clientY);
    setFolderContextMenuIsOpen(true);
    console.log(" right clicked on path ", path);
  }
  if (!explorer) {
    return <div>Loading...</div>;
  }
  if (!explorer.isFolder && !explorer.children) {
    const ext = explorer.name.startsWith(".")
      ? explorer.name.slice(1) // for .env, .gitignore
      : explorer.name.split(".").pop();
    return (
      <div
        className="flex min-w-[200px] items-center gap-2 ml-8 px-2 py-1 rounded hover:bg-gray-700 cursor-pointer"
        onClick={(e) => handleFileClick(e, explorer)}
        onContextMenu={(e) => handleContextMenuForFile(e, explorer.path)}
      >
        <FileIcon extension={ext} />
        <span className="min-w-[200px] truncate">{explorer.name}</span>
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-300 font-mono ">
      <div className="ml-2 mt-1">
        <div
          className="flex items-center justify-between px-2 py-1 rounded  hover:bg-gray-700 cursor-pointer"
          onClick={() => setExpand(!expand)}
          onContextMenu={(e) => handleContextMenuForFolder(e, explorer.path)}
        >
          <div className="flex items-center gap-1">
            {expand ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <FolderIcon className="w-4 h-4 text-yellow-500" />
            <span className="min-w-[100px] truncate">{explorer.name}</span>
          </div>
          <div className="flex gap-1" onClick={(e) => handleNew(e)}>
            {/* here is the file and folder button for adding file and do operations in folder */}
          </div>
        </div>

        {expand && (
          <div className="ml-4">
            {(explorer.children || [])
              .sort((a, b) => {
                // Folders come before files
                if (a.isFolder !== b.isFolder) return b.isFolder - a.isFolder;
                // If both are folders or both are files, sort alphabetically
                return a.name.localeCompare(b.name);
              })
              .map((child) => (
                <Tree key={child.path} explorer={child} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
