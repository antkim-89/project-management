import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { User } from '@/types/api';

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });
};
