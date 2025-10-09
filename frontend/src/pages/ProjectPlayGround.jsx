import { useParams } from "react-router-dom";

export const ProjectPlayGround = () => {
  const { projectId } = useParams();
  console.log(projectId);
  return <>projectId: {projectId}</>;
};
