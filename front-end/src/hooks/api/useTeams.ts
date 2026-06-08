import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { User } from "@/types/api";

export interface Team {
  id: string;
  name: string;
  description?: string;
  users: (User & {
    rank?: {
      id: string;
      name: string;
      baseSalary: number;
    }
  })[];
  createdAt: string;
  updatedAt: string;
}

export const useTeams = () => {
  return useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await api.get("/teams");
      return data;
    },
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Team, Error, { name: string; description?: string }>({
    mutationFn: async (teamData) => {
      const { data } = await api.post("/teams", teamData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(`/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateTeamMembers = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { teamId: string; userIds: string[] }>({
    mutationFn: async ({ teamId, userIds }) => {
      await api.post(`/teams/${teamId}/members`, { userIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
