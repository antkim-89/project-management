import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Equipment } from '@/types/api';

export const useEquipment = () => {
  return useQuery<Equipment[]>({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data } = await api.get('/equipment');
      return data;
    },
  });
};
