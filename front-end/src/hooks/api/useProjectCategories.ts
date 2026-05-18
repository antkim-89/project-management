import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'http://localhost:3001/api';

export interface ProjectCategory {
  id: string;
  name: string;
}

export function useProjectCategories() {
  return useQuery<ProjectCategory[]>({
    queryKey: ['projectCategories'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/project-categories`);
      if (!res.ok) throw new Error('Failed to fetch project categories');
      return res.json();
    },
  });
}

export function useCreateProjectCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${API_URL}/project-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to create project category');
      return res.json();
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
      const res = await fetch(`${API_URL}/project-categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete project category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectCategories'] });
    },
  });
}
