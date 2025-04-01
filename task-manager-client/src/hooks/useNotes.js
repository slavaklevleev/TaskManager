import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notesApi from '../api/notesApi';

export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: notesApi.fetchNotes,
    select: (res) => res.data,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => notesApi.updateNote(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });
};