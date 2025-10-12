import "./Editor-button.css";
export const EditorButton = ({ isAcitve }) => {
  function handleClick() {
    // TODO :: implement the click handler
  }

  return (
    <>
      <button
        className="editor-button"
        style={{
          color: isAcitve ? "white" : "#959eba",

          backgroundColor: isAcitve ? "#959eba" : "#4b4d54ff",
          borderTop: isAcitve ? "2px solid #8b601b" : "none",
        }}
        onClick={handleClick}
      >
        edditor buton
      </button>
    </>
  );
};
