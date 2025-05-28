import { useEditorSocketStore } from "../../../stores/editorSocketStore";

export const FileContextMenu = ({ x, y, path }) => {
  const { editorSocket } = useEditorSocketStore();
  const hangleFileDelete = (e) => {
    e.preventDefault();
    console.log("delete the file", path);
    editorSocket.emit("deleteFile", {
      pathToFileOrFolder: path,
    });
  };
  const handleFileRename = (e) => {
    e.preventDefault();
    const newName = prompt("Enter new file name:");
    if (!newName) return;

    editorSocket.emit("renamePath", {
      oldPath: path,
      newName: newName,
    });
  };
  return (
    <div
      className="fixed z-50 w-48 p-2 rounded-xl shadow-xl backdrop-blur-md bg-white/10 border border-white/20"
      style={{ top: y, left: x }}
    >
      <button
        onClick={(e) => hangleFileDelete(e)}
        className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
      >
        Delete File
      </button>
      <button
        onClick={handleFileRename}
        className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
      >
        Rename File
      </button>
    </div>
  );
};
