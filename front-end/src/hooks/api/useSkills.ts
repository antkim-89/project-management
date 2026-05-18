import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { SkillSet } from '@/types/api';

export function useSkills() {
  return useQuery<SkillSet[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await api.get('/skill-sets');
      return data;
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, category }: { name: string; category: string }) => {
      const { data } = await api.post('/skill-sets', { name, category });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/skill-sets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}
