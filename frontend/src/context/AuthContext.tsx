import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "@/api/apiClient";
import type { AuthContextType, LoginRequest, User } from "@/utils/types";
import { getSelf } from "@/api/api";
import { deepEqual } from "@/utils/deepEqual";

type MfaState = {
  requiresMFA: boolean;
  userID: string;
  message: string;
};

const AuthContext = createContext<
  AuthContextType & {
    mfa: MfaState | null;
    verifyMfa: (payload: { code: string }) => Promise<void>;
  } | undefined
>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    try {
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });
  const [mfa, setMfa] = useState<MfaState | null>(null);
  const [skipMismatchCheck, setSkipMismatchCheck] = useState(false);

  const hasUserInStorage = !!localStorage.getItem("user");
  const selfQuery = useQuery({
    queryKey: ["user", "self"],
    queryFn: getSelf,
    enabled: hasUserInStorage,
  });
  const refetch = selfQuery.refetch;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // LOGIN (with MFA support)
  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res: any = await API.post("/auth/sign-in", data);
      if (res.requiresMFA) {
        setMfa({ requiresMFA: true, userID: res.userID, message: res.message });
        return null;
      }
      return res.user;
    },
    onSuccess: (user: User | null) => {
      if (!user) return;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setMfa(null);
      setSkipMismatchCheck(true);
      setTimeout(() => setSkipMismatchCheck(false), 1500); // <-- skip mismatch check for 1.5 seconds
    },
  });

  // MFA CODE VERIFICATION
  const verifyMfaMutation = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const res: any = await API.post("/auth/verify-mfa", { code });
      return res.user;
    },
    onSuccess: (user: User) => {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setMfa(null);
      setSkipMismatchCheck(true);
      setTimeout(() => setSkipMismatchCheck(false), 1500);
    },
  });

  // REGISTER
  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; username: string; password: string }) => {
      const res = await API.post("/auth/sign-up", data) as { data: { user: User; message: string } };
      return res.data;
    },
    onSuccess: (res) => {
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      setSkipMismatchCheck(true);
      setTimeout(() => setSkipMismatchCheck(false), 1500);
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);
    },
  });

  // LOGOUT
  const { mutate: logout } = useMutation({
    mutationFn: () => API.get("/auth/logout"),
    onSuccess: () => {
      localStorage.removeItem("user");
      setUser(null);
      setMfa(null);
      queryClient.clear();
      navigate("/sign-in", { replace: true });
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  // Sync user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Storage/user mismatch logic, skip when flag is true
  useEffect(() => {
    if (skipMismatchCheck) return;

    function handleStorageChange(e: StorageEvent) {
      if (e.key === "user") {
        const storedUser = localStorage.getItem("user");
        const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

        refetch().then((result) => {
          const backendUser = result.data;
          const isEqual = deepEqual(backendUser, parsedStoredUser);
          if (!isEqual) {
            // (optional) logout();
          }
        });
      }
    }

    window.addEventListener("storage", handleStorageChange);

    let prevUser = localStorage.getItem("user");
    const interval = setInterval(() => {
      if (skipMismatchCheck) return;
      const currentUser = localStorage.getItem("user");
      if (currentUser !== prevUser) {
        const parsedStoredUser = currentUser ? JSON.parse(currentUser) : null;

        refetch().then((result) => {
          const backendUser = result.data;
          const isEqual = deepEqual(backendUser, parsedStoredUser);
          if (!isEqual) {
            logout();
          }
        });
      }
      prevUser = currentUser;
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [refetch, logout, skipMismatchCheck]);

  const value: AuthContextType & {
    mfa: MfaState | null;
    verifyMfa: (payload: { code: string }) => Promise<void>;
  } = {
    user,
    login: async (data: LoginRequest) => {
      await loginMutation.mutateAsync(data);
    },
    register: async (data: { email: string; username: string; password: string }) => {
      await registerMutation.mutateAsync(data);
    },
    logout,
    isAuthenticated: !!user,
    setUser,
    mfa,
    verifyMfa: async ({ code }) => {
      await verifyMfaMutation.mutateAsync({ code });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
