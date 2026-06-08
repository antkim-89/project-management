import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { User } from "@/types/api";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, { email: string; name: string; rankId: string; avatarUrl?: string }>({
    mutationFn: async (userData) => {
      const { data } = await api.post("/users", userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
