import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Task } from "@/types/api";

export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get("/tasks");
      return data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask: {
      title: string;
      description?: string | null;
      status: string;
      projectId: string;
      userId?: string | null;
      dueDate: string;
    }) => {
      const { data } = await api.post("/tasks", newTask);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: string;
      updatedFields: {
        title?: string;
        description?: string | null;
        status?: string;
        projectId?: string;
        userId?: string | null;
        dueDate?: string;
      };
    }) => {
      const { data } = await api.put(`/tasks/${id}`, updatedFields);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
