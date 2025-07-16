import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { deleteSelf, getAllUsers, getSelf, patchSelf } from "@/api/api";


const SELF_KEY = ["user", "self"];
const ALL_USERS_KEY = ["users", "all"];

export function useUser() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const selfQuery = useQuery({
    queryKey: SELF_KEY,
    queryFn: getSelf,
    enabled: !!user,
  });

  const patchSelfMutation = useMutation({
    mutationFn: patchSelf,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SELF_KEY }),
  });

  const deleteSelfMutation = useMutation({
    mutationFn: deleteSelf,
    onSuccess: () => queryClient.removeQueries({ queryKey: SELF_KEY }),
  });

  const allUsersQuery = useQuery({
    queryKey: ALL_USERS_KEY,
    queryFn: getAllUsers,
    enabled: !!user,
  });

  return {
    selfQuery,
    patchSelfMutation,
    deleteSelfMutation,
    allUsersQuery,
  };
}
