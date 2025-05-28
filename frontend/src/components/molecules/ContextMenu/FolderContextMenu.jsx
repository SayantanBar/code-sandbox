import { useCreatePromptStore } from "../../../stores/createPromptStore";
import { useEditorSocketStore } from "../../../stores/editorSocketStore";

export const FolderContextMenu = ({ x, y, path }) => {
  const { editorSocket } = useEditorSocketStore();
  const { setIsVisible, setIsFolder } = useCreatePromptStore();

  const handelCreteFilePrompt = (e) => {
    e.preventDefault();
    setIsVisible(true); // show the modal or UI to create file
    setIsFolder(false); // it's a file
  };

  const handleCreateFolderPropmt = (e) => {
    e.preventDefault();
    setIsVisible(true); // show the modal or UI to create folder
    setIsFolder(true);
  };

  const handleFolderDelete = (e) => {
    e.preventDefault();
    console.log("folder created");
    editorSocket.emit("deleteFolder", {
      pathToFileOrFolder: path,
    });
  };
  return (
    <div
      className="fixed z-50 w-48 p-2 rounded-xl shadow-xl backdrop-blur-md bg-white/10 border border-white/20"
      style={{ top: y, left: x }}
    >
      <button
        className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
        onClick={(e) => handelCreteFilePrompt(e)}
      >
        Create File
      </button>
      <button
        className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
        onClick={(e) => handleCreateFolderPropmt(e)}
      >
        Create Folder
      </button>

      <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer">
        Rename Folder
      </button>
      <button
        className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
        onClick={(e) => handleFolderDelete(e)}
      >
        Delete Folder
      </button>
    </div>
  );
};
