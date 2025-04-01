import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as projectsApi from '../api/projectsApi';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.fetchProjects,
    select: (res) => res.data,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => projectsApi.updateProject(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useAddProjectComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, content }) => projectsApi.addComment(projectId, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useDeleteProjectComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => projectsApi.deleteComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUploadProjectFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, file }) => projectsApi.uploadFile(projectId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useDeleteProjectFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId) => projectsApi.deleteFile(fileId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
};