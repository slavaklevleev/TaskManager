import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as todoApi from '../api/todoApi';

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todoApi.fetchTodos,
    select: (data) => data.data, // получить только данные
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: todoApi.createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => todoApi.updateTodo(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => todoApi.deleteTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
};