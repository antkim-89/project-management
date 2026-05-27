import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Equipment, EquipmentSetting } from "@/types/api";

export const useEquipment = () => {
  return useQuery<Equipment[]>({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data } = await api.get("/equipments");
      return data;
    },
  });
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newAsset: {
      type: string;
      modelName: string;
      serialNumber: string;
      userId?: string | null;
      purchaseDate?: string;
    }) => {
      const { data } = await api.post("/equipments", newAsset);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: string;
      updatedFields: {
        type?: string;
        modelName?: string;
        serialNumber?: string;
        userId?: string | null;
        status?: string;
        purchaseDate?: string;
      };
    }) => {
      const { data } = await api.put(`/equipments/${id}`, updatedFields);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/equipments/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
};

// 장비 수명 설정 훅
export const useEquipmentSettings = () => {
  return useQuery<EquipmentSetting[]>({
    queryKey: ["equipmentSettings"],
    queryFn: async () => {
      const { data } = await api.get("/equipments/settings");
      return data;
    },
  });
};

export const useUpdateEquipmentSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (setting: { type: string; usefulLife: number }) => {
      const { data } = await api.put("/equipments/settings", setting);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipmentSettings"] });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
};
