import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as habitsApi from '../api/habitsApi';

export const useHabits = () => {
  return useQuery({
    queryKey: ['habits'],
    queryFn: habitsApi.fetchHabits,
    select: (data) => data.data,
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.createHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => habitsApi.updateHabit(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => habitsApi.deleteHabit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
};

export const useUpdateHabitLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date }) => habitsApi.updateHabitLog(habitId, date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });
};