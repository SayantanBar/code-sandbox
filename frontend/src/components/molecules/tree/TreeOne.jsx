import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";

const TreeOne = ({ fileFolderData }) => {
  return (
    <div style={{ padding: "15px", color: "white" }}>
      {fileFolderData.children ? (
        <button className="border-4 border-amber-600">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {fileFolderData.name}
        </button>
      ) : (
        <p>{fileFolderData.name}</p>
      )}
    </div>
  );
};

export default TreeOne;
