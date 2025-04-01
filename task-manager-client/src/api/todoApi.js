// api/tasksApi.js
import axiosInstance from './axiosInstance';

export const fetchTodos = () => axiosInstance.get('/tasks');
export const createTodo = (data) => axiosInstance.post('/tasks', data);
export const updateTodo = (id, data) => axiosInstance.put(`/tasks/${id}`, data);
export const deleteTodo = (id) => axiosInstance.delete(`/tasks/${id}`);