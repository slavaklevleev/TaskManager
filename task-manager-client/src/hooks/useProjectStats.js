import { useQuery } from '@tanstack/react-query';
import * as projectsApi from '../api/projectsApi';

export const useMonthlyTaskStats = () => {
  return useQuery({
    queryKey: ['projectStatsTasks'],
    queryFn: projectsApi.fetchMonthlyTaskStats,
    select: (res) => res.data,
  });
};

export const useActiveTaskStats = () => {
  return useQuery({
    queryKey: ['projectStatsActive'],
    queryFn: projectsApi.fetchActiveTaskStats,
    select: (res) => res.data,
  });
};