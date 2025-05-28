import { useState, useEffect } from "react";
import { useEditorSocketStore } from "../../stores/editorSocketStore";
import { useCreatePromptStore } from "../../stores/createPromptStore";

export const CreatePromptModal = ({ isFolder, path }) => {
  const [name, setName] = useState("");
  const { setIsVisible, isVisible } = useCreatePromptStore();
  const { editorSocket } = useEditorSocketStore();

  useEffect(() => {
    if (!isVisible) {
      setName("");
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setName("");
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    const fullPath = `${path}/${name}`;

    if (isFolder) {
      editorSocket.emit("createFolder", { pathToFileOrFolder: fullPath });
    } else {
      editorSocket.emit("createFile", { pathToFileOrFolder: fullPath });
    }

    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-black p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">
          {isFolder ? "Create New Folder" : "Create New File"}
        </h2>
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder={isFolder ? "Folder name" : "File name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
