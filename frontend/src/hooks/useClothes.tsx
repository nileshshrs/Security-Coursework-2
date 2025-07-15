import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createClothes,
  updateClothes,
  deleteClothes,
  getAllClothes,
  getClothesById,
} from "@/api/api";

export const CLOTHES_QUERY_KEY = ["clothes"];

// GET ALL
export const useGetAllClothes = () =>
  useQuery({
    queryKey: CLOTHES_QUERY_KEY,
    queryFn: getAllClothes,
  });

// GET BY ID
export const useGetClothesById = (id: string) =>
  useQuery({
    queryKey: [...CLOTHES_QUERY_KEY, id],
    queryFn: () => getClothesById(id),
    enabled: !!id,
  });

// CREATE
export const useCreateClothes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClothes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLOTHES_QUERY_KEY });
    },
  });
};

// UPDATE
export const useUpdateClothes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClothes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLOTHES_QUERY_KEY });
    },
  });
};

// DELETE
export const useDeleteClothes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClothes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLOTHES_QUERY_KEY });
    },
  });
};
