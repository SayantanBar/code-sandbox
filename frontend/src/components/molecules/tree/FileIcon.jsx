// FileIcon.jsx
import React from "react";
import { FileText, FileJson, FileCode } from "lucide-react";
import { SiReact } from "react-icons/si";
import { IoLogoCss3 } from "react-icons/io";
import { IoLogoHtml5 } from "react-icons/io5";
import { FaJsSquare } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { FaGitAlt } from "react-icons/fa6";
const FileIcon = ({ extension }) => {
  const ext = extension?.toLowerCase();

  const renderIcon = () => {
    switch (ext) {
      case "js":
        return <FaJsSquare className="w-4 h-4 text-[#fed200]" />;
      case "jsx":
        return <SiReact className="w-4 h-4 text-[#0c8da2]" />;
      case "json":
        return <FileJson className="w-4 h-4 text-[#c52d08]" />;
      case "html":
        return <IoLogoHtml5 className="w-4 h-4 text-[#c52d08]" />;
      case "css":
        return <IoLogoCss3 className="w-4 h-4 text-blue-400" />;
      case "gitignore":
        return <FaGitAlt className="w-4 h-4 text-blue-400" />;
      case "md":
      case "env":
        return <FileText className="w-4 h-4 text-gray-300" />;
      default:
        return <FaRegFileAlt className="w-4 h-4 text-gray-400" />;
    }
  };

  return <>{renderIcon()}</>;
};

export default FileIcon;
