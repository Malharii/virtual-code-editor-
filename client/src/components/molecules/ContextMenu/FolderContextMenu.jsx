import { useEditorSocketStore } from "../../../store/editorSocketStore";

import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import "./FileContextMenu.css";

export const FolderContextMenu = ({ x, y, path }) => {
  const { setFolder } = useFolderContextMenuStore();
  const { editorSocket } = useEditorSocketStore();

  function handleFolderDelete(e) {
    e.preventDefault();
    console.log("delete folder:", path);
    editorSocket.emit("deleteFolder", { pathToFileorFolder: path });
  }

  return (
    <div
      onMouseLeave={() => {
        console.log("mouse left");
        setFolder(false);
      }}
      style={{
        left: x,
        top: y,
      }}
      className="fileContxtOptionsWrapper"
    >
      <button onClick={handleFolderDelete} className="fileContextButton">
        Delete Folder
      </button>
      <button className="fileContextButton">Rename Folder</button>
    </div>
  );
};
