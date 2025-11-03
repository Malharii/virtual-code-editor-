import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenu";
import "./FileContextMenu.css";
export const FileContextMenu = ({ x, y, path }) => {
  const { setIsOpen } = useFileContextMenuStore();
  const { editorSocket } = useEditorSocketStore();
  function handleFileDelete(e) {
    e.preventDefault();
    console.log("delete file", path);
    editorSocket.emit("deleteFile", { pathToFileorFolder: path });
  }
  return (
    <div
      onMouseLeave={() => {
        console.log("mouse left");
        setIsOpen(false);
      }}
      style={{
        left: x,
        top: y,
      }}
      className="fileContxtOptionsWrapper"
    >
      <button onClick={handleFileDelete} className="fileContextButton">
        Delete File
      </button>
      <button className="fileContextButton">Rename File</button>
    </div>
  );
};
