import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface ProjectCategory {
  id: string;
  name: string;
}

export function useProjectCategories() {
  return useQuery<ProjectCategory[]>({
    queryKey: ['projectCategories'],
    queryFn: async () => {
      const res = await api.get('/project-categories');
      return res.data;
    },
  });
}

export function useCreateProjectCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post('/project-categories', { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectCategories'] });
    },
  });
}

export function useDeleteProjectCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/project-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectCategories'] });
    },
  });
}
