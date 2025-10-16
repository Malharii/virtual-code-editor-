import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
export const TreeNode = ({ fileFolderData }) => {
  const [visibility, setVisibilty] = useState({});

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
              paddingTop: "15px",
              fontSize: "16px",
            }}
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
                paddingTop: "3px",
                cursor: "pointer",
                marginLeft: "5px",
                color: "#bbbec7ff",
              }}
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
