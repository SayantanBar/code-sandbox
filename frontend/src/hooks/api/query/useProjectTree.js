import { useQuery } from "@tanstack/react-query";
import { getProjectTree } from "../../../apis/projects";

export const useProjectTree = (projectId) => {
  const {
    isError,
    isLoading,
    error,
    data: projectTree,
  } = useQuery({
    queryFn: () => getProjectTree(projectId),
  });
  return { isError, isLoading, error, projectTree };
};
