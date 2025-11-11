import { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenu";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";

export const TreeNode = ({ fileFolderData }) => {
  const [visibility, setVisibility] = useState({});
  const editorSocket = useEditorSocketStore();

  const {
    setFile,
    setIsOpen: setFileContextMenuIsOpen,
    setX: setFileContextMenuX,
    setY: setFileContextMenuY,
  } = useFileContextMenuStore();

  const {
    setFolder,
    setIsOpen: setFolderContextMenuIsOpen,
    setX: setFolderContextMenuX,
    setY: setFolderContextMenuY,
  } = useFolderContextMenuStore();

  const toggleVisibility = (name) => {
    setVisibility({
      ...visibility,
      [name]: !visibility[name],
    });
  };

  const computeExtension = (fileFolderData) => {
    const name = fileFolderData.name.split(".");
    return name[name.length - 1];
  };

  const handleDoubleClick = (fileFolderData) => {
    editorSocket.editorSocket.emit("readFile", {
      pathToFileorFolder: fileFolderData.path,
    });
  };

  const handleContextMenuForFile = (e, path) => {
    e.preventDefault();
    setFile(path);
    setFileContextMenuX(e.clientX);
    setFileContextMenuY(e.clientY);
    setFileContextMenuIsOpen(true);
  };

  const handleContextMenuForFolder = (e, path) => {
    e.preventDefault();
    setFolder(path);
    setFolderContextMenuX(e.clientX);
    setFolderContextMenuY(e.clientY);
    setFolderContextMenuIsOpen(true);
  };

  return (
    fileFolderData && (
      <div style={{ paddingLeft: "15px", color: "white" }}>
        {/* FOLDER NODE */}
        {fileFolderData.children ? (
          <div
            onContextMenu={(e) => handleContextMenuForFolder(e, fileFolderData.path)}
            onDoubleClick={() => handleDoubleClick(fileFolderData)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              padding: "4px 6px",
              userSelect: "none",
            }}
          >
            {visibility[fileFolderData.name] ? (
              <IoIosArrowDown size={16} />
            ) : (
              <IoIosArrowForward size={16} />
            )}
            <span
              onClick={() => toggleVisibility(fileFolderData.name)}
              style={{ fontSize: "15px" }}
            >
              {fileFolderData.name}
            </span>
          </div>
        ) : (
          // FILE NODE
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "4px 6px",
              userSelect: "none",
            }}
            onContextMenu={(e) => handleContextMenuForFile(e, fileFolderData.path)}
            onDoubleClick={() => handleDoubleClick(fileFolderData)}
          >
            <FileIcon extension={computeExtension(fileFolderData)} />
            <span
              style={{
                fontSize: "15px",
                color: "#bbbec7ff",
              }}
            >
              {fileFolderData.name}
            </span>
          </div>
        )}

        {/* CHILDREN */}
        {visibility[fileFolderData.name] &&
          fileFolderData.children &&
          fileFolderData.children.map((child) => (
            <TreeNode key={child.name} fileFolderData={child} />
          ))}
      </div>
    )
  );
};
