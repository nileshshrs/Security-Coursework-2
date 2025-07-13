import React, { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "@/api/apiClient";
import type { AuthContextType, LoginRequest, User } from "@/utils/types";

type MfaState = {
  requiresMFA: boolean;
  userID: string;
  message: string;
};

const AuthContext = createContext<AuthContextType & {
  mfa: MfaState | null;
  verifyMfa: (payload: { code: string }) => Promise<void>;
} | undefined>(undefined);

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

  const navigate = useNavigate();

  // LOGIN (may require MFA)
  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res: any = await API.post("/auth/sign-in", data);
      // No .data -- just res
      if (res.requiresMFA) {
        setMfa({ requiresMFA: true, userID: res.userID, message: res.message });
        return null; // Don't set user
      }
      return res.user; // Only if login is successful (for normal logins)
    },
    onSuccess: (user: User | null) => {
      if (!user) return; // Handled by MFA flow
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setMfa(null); // Clean up any pending MFA
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
      navigate("/sign-in", { replace: true });
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

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
