import { useMutation } from "@tanstack/react-query";
import { createProjectApi } from "../../../apis/projects";

export const useCreateProject = () => {
  const { mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: createProjectApi,
    onSuccess: (data) => {
      console.log("Project create successfully", data);
    },
    onError: () => {
      console.log("Error in the project");
    },
  });
  return {
    createProjectMutation: mutateAsync,
    isPending,
    isError,
    error,
    isSuccess,
  };
};
