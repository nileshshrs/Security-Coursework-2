import React, { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "@/api/apiClient";
import type { AuthContextType, LoginRequest, LoginResponse, User } from "@/utils/types";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    try {
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  // LOGIN
  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res: LoginResponse = await API.post("/auth/sign-in", data);
      return res.user;
    },
    onSuccess: (user: User) => {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    },
  });

  // REGISTER
  const registerMutation = useMutation({
    mutationFn: async (data: { email: string; username: string; password: string }) => {
      const res = await API.post("/auth/sign-up", data) as { user: User; message: string };
      return res;
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
      navigate("/sign-in", { replace: true });
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  const value: AuthContextType = {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
