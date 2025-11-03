import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenu";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";

export const TreeNode = ({ fileFolderData }) => {
  const [visibility, setVisibilty] = useState({});

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

  function ToggleVisibility(name) {
    setVisibilty({
      ...visibility,
      [name]: !visibility[name],
    });
  }
  function computeExtension(fileFolderData) {
    const name = fileFolderData.name.split(".");
    return name[name.length - 1];
  }
  function handleDubleClick(fileFolderData) {
    console.log("DubleClieked on this", fileFolderData);
    editorSocket.editorSocket.emit("readFile", {
      pathToFileorFolder: fileFolderData.path,
    });
  }
  function handleContextMenuForFile(e, path) {
    e.preventDefault();
    setFile(path);
    setFileContextMenuX(e.clientX);
    setFileContextMenuY(e.clientY);
    setFileContextMenuIsOpen(true);
    console.log("right click on this", path);
  }
  function habdleContextMenuForFolder(e, path) {
    e.preventDefault();
    setFolder(path);
    setFolderContextMenuX(e.clientX);
    setFolderContextMenuY(e.clientY);
    setFolderContextMenuIsOpen(true);
    console.log("right click on this", path);
  }
  return (
    fileFolderData && (
      <div
        style={{
          paddingLeft: "15px",
          //   paddingTop: "10px",

          color: "white",
        }}
      >
        {fileFolderData.children ? (
          <button
            onClick={() => ToggleVisibility(fileFolderData.name)}
            style={{
              border: "none",
              cursor: "pointer",
              outline: "none",
              color: "white",
              backgroundColor: "transparent",
              padding: "10px",
              margin: "7px",
              fontSize: "16px",
            }}
            onContextMenu={(e) => habdleContextMenuForFolder(e, fileFolderData.path)}
            onDoubleClick={() => handleDubleClick(fileFolderData)}
          >
            {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}
            {fileFolderData.name}
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FileIcon extension={computeExtension(fileFolderData)} />
            <p
              style={{
                fontSize: "16px",
                padding: "7px",
                cursor: "pointer",
                margin: "5px",
                color: "#bbbec7ff",
              }}
              onContextMenu={(e) => handleContextMenuForFile(e, fileFolderData.path)}
              onDoubleClick={() => handleDubleClick(fileFolderData)}
            >
              {fileFolderData.name}
            </p>
          </div>
        )}
        {visibility[fileFolderData.name] &&
          fileFolderData.children &&
          fileFolderData.children.map((child) => (
            <TreeNode key={child.name} fileFolderData={child} />
          ))}
      </div>
    )
  );
};
