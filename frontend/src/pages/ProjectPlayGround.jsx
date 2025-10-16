import { useParams } from "react-router-dom";
import { EditorComponet } from "../components/molecules/EditorComponet/EdditorComponet";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreesStructure } from "../components/organisms/TreeStructure/TreesStructure";
import { useTreeStructuerStore } from "../store/treeStructuerStore";
import { useEffect } from "react";

export const ProjectPlayGround = () => {
  const { projectId: projectIdfromUrl } = useParams();

  const { setProjectId, projectId } = useTreeStructuerStore();

  useEffect(() => {
    setProjectId(projectIdfromUrl);
  }, [setProjectId, projectIdfromUrl]);

  return (
    <>
      {/* projectId: {projectIdfromUrl} */}
      {projectId && (
        <div
          style={{
            backgroundColor: "#333254",
            paddingRight: "10px",
            paddingTop: "0.3vh",
            minWidth: "250px",
            maxWidth: "20%",
            height: "99.7vh",
            overflow: "auto",
          }}
        >
          <TreesStructure />
        </div>
      )}
      <EditorComponet />
      <EditorButton isAcitve={true} />
      <EditorButton isAcitve={false} />
    </>
  );
};
