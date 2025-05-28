import { useTreeStructureStore } from "../../../stores/treeStructureStore";
import { useEffect, useState } from "react";
import { Tree } from "../../molecules/tree/Tree";
import { useFileContextMenuStore } from "../../../stores/fileContextMenuStore";
import { FileContextMenu } from "../../molecules/ContextMenu/FileContextMenu";
import { useFolderContextMenuStore } from "../../../stores/folderContextMenuStore";
import { FolderContextMenu } from "../../molecules/ContextMenu/FolderContextMenu";
import { CreatePromptModal } from "../CreatePromptModal";
import { useCreatePromptStore } from "../../../stores/createPromptStore";

export const TreeStructure = () => {
  const { treeStructure, setTreeStructure } = useTreeStructureStore();
  const { isFolder, targetPath } = useCreatePromptStore();
  const {
    file,
    isOpen: isFileContextOpen,
    x: fileContextX,
    y: fileContextY,
  } = useFileContextMenuStore();
  const {
    folder,
    isOpen: isFolderContextOpen,
    x: folderContextX,
    y: folderContextY,
  } = useFolderContextMenuStore();

  useEffect(() => {
    if (treeStructure) {
      console.log("tree ", treeStructure);
    } else {
      setTreeStructure();
    }
  }, [setTreeStructure, treeStructure]);
  console.log("the target path is ", targetPath);
  return (
    <div>
      <CreatePromptModal isFolder={isFolder} path={targetPath} />
      {isFileContextOpen && fileContextX && fileContextY && (
        <FileContextMenu x={fileContextX} y={fileContextY} path={file} />
      )}
      {isFolderContextOpen && folderContextX && folderContextY && (
        <FolderContextMenu
          x={folderContextX}
          y={folderContextY}
          path={folder}
        />
      )}
      {treeStructure && <Tree explorer={treeStructure.data.children[0]} />}
    </div>
  );
};
