import { useQuery } from '@tanstack/react-query';
import * as userApi from '../api/userApi';

export const useProfile = () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: userApi.fetchProfile,
    });
  };