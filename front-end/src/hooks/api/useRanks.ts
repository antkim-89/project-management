import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Rank {
  id: string;
  name: string;
  baseSalary: number;
}

export const useRanks = () => {
  return useQuery<Rank[]>({
    queryKey: ["ranks"],
    queryFn: async () => {
      const { data } = await api.get("/ranks");
      return data;
    },
  });
};
