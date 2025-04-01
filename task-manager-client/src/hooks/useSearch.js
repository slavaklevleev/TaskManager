import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useGlobalSearch = (query) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => axiosInstance.get(`/search?q=${query}`).then((res) => res.data),
    enabled: !!query,
  });
};