import { create } from "zustand";

import { QueryClient } from "@tanstack/react-query";
import { getProjectTree } from "../apis/projects";

export const useTreeStructuerStore = create((set, get) => {
  const queryClient = new QueryClient();

  return {
    projectId: null,
    treeStructuer: null,
    setTreeStructuer: async () => {
      const id = get().projectId;
      const data = await queryClient.fetchQuery({
        queryKey: [`projectTree- ${id}`],
        queryFn: () => getProjectTree({ projectId: id }),
      });
      console.log(data, "treeStructuer");
      set({ treeStructuer: data });
    },
    setProjectId: (projectId) => {
      set({ projectId: projectId });
    },
  };
});
