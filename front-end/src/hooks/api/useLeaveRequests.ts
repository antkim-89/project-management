import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { LeaveRequest } from "@/types/api";

export const useLeaveRequests = () => {
  return useQuery<LeaveRequest[]>({
    queryKey: ["leaveRequests"],
    queryFn: async () => {
      const { data } = await api.get("/leave-requests");
      return data;
    },
  });
};

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRequest: Partial<LeaveRequest>) => {
      const { data } = await api.post("/leave-requests", newRequest);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRequests"] });
    },
  });
};
