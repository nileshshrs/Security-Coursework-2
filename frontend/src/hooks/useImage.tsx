import { uploadImage } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export const useUploadImage = () => {
  return useMutation<string, Error, File>({
    mutationFn: uploadImage,
  });
};