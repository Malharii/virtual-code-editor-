import { useEffect } from "react";
import { useTreeStructuerStore } from "../../../store/treeStructuerStore";
import { TreeNode } from "../../molecules/TreeNode/TreeNode";
import { useFileContextMenuStore } from "../../../store/fileContextMenu";
import { FileContextMenu } from "../../molecules/ContextMenu/FileContextMenu";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import { FolderContextMenu } from "../../molecules/ContextMenu/FolderContextMenu";

export const TreesStructure = () => {
  const { treeStructuer, setTreeStructuer } = useTreeStructuerStore();
  const {
    x: fileContextX,
    y: fileContextY,
    isOpen: isFileContextMenuOpen,
    file,
  } = useFileContextMenuStore();
  const {
    x: folderContextX,
    y: folderContextY,
    isOpen: isFolderContextMenuOpen,
  } = useFolderContextMenuStore;
  useEffect(() => {
    if (treeStructuer) {
      // console.log("tree:", treeStructuer);
    } else {
      setTreeStructuer();
    }
  }, [setTreeStructuer, treeStructuer]);

  return (
    <>
      {isFileContextMenuOpen && (
        <FileContextMenu x={fileContextX} y={fileContextY} path={file} />
      )}
      {isFolderContextMenuOpen && (
        <FolderContextMenu
          fileContextMenu
          x={folderContextX}
          y={folderContextY}
          path={file}
        />
      )}
      <TreeNode fileFolderData={treeStructuer} />
    </>
  );
};
