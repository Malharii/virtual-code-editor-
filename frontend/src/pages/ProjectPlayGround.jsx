import { useParams } from "react-router-dom";
import { EditorComponet } from "../components/molecules/EdditerComponet/EdditorComponet";

export const ProjectPlayGround = () => {
  const { projectId } = useParams();
  console.log(projectId);
  return (
    <>
      projectId: {projectId}
      <EditorComponet />
    </>
  );
};
