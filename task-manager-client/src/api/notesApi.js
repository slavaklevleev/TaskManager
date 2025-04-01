import axiosInstance from './axiosInstance';

export const fetchNotes = () => axiosInstance.get('/notes');
export const createNote = (data) => axiosInstance.post('/notes', data);
export const updateNote = (id, data) => axiosInstance.put(`/notes/${id}`, data);
export const deleteNote = (id) => axiosInstance.delete(`/notes/${id}`);