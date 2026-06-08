import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export interface ProjectRole {
  id: string;
  name: string;
}

export function useProjectRoles() {
  return useQuery<ProjectRole[]>({
    queryKey: ['projectRoles'],
    queryFn: async () => {
      const res = await api.get('/project-roles');
      return res.data;
    },
  });
}

export function useCreateProjectRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post('/project-roles', { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectRoles'] });
    },
  });
}

export function useDeleteProjectRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/project-roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectRoles'] });
    },
  });
}
