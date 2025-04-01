import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as eventsApi from '../api/eventsApi';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventsApi.fetchEvents,
    select: (res) =>
      res.data.map((event) => ({
        ...event,
        id: event.id.toString(),
        start: `${event.date}T${event.start_time}`,
        end: `${event.date}T${event.end_time}`,
      })),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => eventsApi.updateEvent(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventsApi.deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
};