import { useParams } from "react-router-dom";
import { EditorComponet } from "../components/molecules/EditorComponet/EdditorComponet";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";

export const ProjectPlayGround = () => {
  const { projectId } = useParams();
  console.log(projectId);
  return (
    <>
      projectId: {projectId}
      <EditorComponet />
      <EditorButton isAcitve={true} />
      <EditorButton isAcitve={false} />
    </>
  );
};
