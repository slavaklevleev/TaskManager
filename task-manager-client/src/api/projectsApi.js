import axiosInstance from './axiosInstance';

export const fetchProjects = () => axiosInstance.get('/projects/');
export const createProject = (data) => axiosInstance.post('/projects/', data);
export const updateProject = (id, data) => axiosInstance.put(`/projects/${id}`, data);
export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`);

export const addComment = (projectId, content) =>
  axiosInstance.post(`/projects/${projectId}/comments`, { content });

export const deleteComment = (commentId) =>
  axiosInstance.delete(`/projects/comments/${commentId}`);

export const uploadFile = (projectId, file) => {
  const formData = new FormData();
  formData.append('uploaded_file', file);
  return axiosInstance.post(`/projects/${projectId}/files`, formData);
};

export const deleteFile = (fileId) => axiosInstance.delete(`/projects/files/${fileId}`);

export const fetchMonthlyTaskStats = () => axiosInstance.get('/projects/stats/tasks');
export const fetchActiveTaskStats = () => axiosInstance.get('/projects/stats/active');