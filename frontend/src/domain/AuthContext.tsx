/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthSuccess, User } from "./types";
import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AuthRepository } from "../data/auth.repository";
import { axiosRemoveToken, axiosSetToken } from "../core/api";
import { useNavigate } from "react-router-dom";

type ILoginPayload = {
  email: string;
  password: string;
};

type ISignUpPayload = {
  email: string;
  password: string;
  name: string;
  age: number;
};

const TOKEN_KEY = "ACCESS_TOKEN";

interface AuthContextType {
  user: User | null;
  useSignUp: () => UseMutationResult<
    AuthSuccess,
    Error,
    ISignUpPayload,
    unknown
  >;
  useLogin: () => UseMutationResult<AuthSuccess, Error, ILoginPayload, unknown>;
  signOut: () => Promise<void>;
  useSelf: () => UseQueryResult<User | undefined, Error>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const useLogin = () => {
    return useMutation({
      mutationFn: ({ email, password }: ILoginPayload) =>
        AuthRepository.login(email, password),
      onSuccess(data) {
        axiosSetToken(data.access_token);
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setUser(data.user);
      },
    });
  };

  const useSignUp = () => {
    return useMutation({
      mutationFn: ({ email, password, name, age }: ISignUpPayload) =>
        AuthRepository.signUp(email, password, name, age),
      onSuccess(data) {
        axiosSetToken(data.access_token);
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setUser(data.user);
      },
    });
  };

  const signOut = async () => {
    axiosRemoveToken();
    setUser(null);
    localStorage.removeItemItem(TOKEN_KEY);
    navigate("/", { replace: true });
  };

  const useSelf = () => {
    return useQuery({
      queryKey: ["SELF"],
      queryFn: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          axiosSetToken(token);
          const user = await AuthRepository.self();
          setUser(user);

          return user;
        }
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, useSignUp, useLogin, signOut, useSelf }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
