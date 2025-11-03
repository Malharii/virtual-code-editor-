import { useQuery } from "@tanstack/react-query";
import { getProjectApi } from "../../../apis/projects";

export const useProjectTree = (projectId) => {
  const {
    isLoading,
    data: projectTree,
    error,
    isError,
  } = useQuery({
    queryFn: () => getProjectApi({ projectId }),
  });

  return { isLoading, projectTree, error, isError };
};
