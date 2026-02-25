import axios from "axios";
import type { AuthSuccess, User } from "../domain/types";

async function login(email: string, password: string): Promise<AuthSuccess> {
  return (await axios.post<AuthSuccess>("/auth/signin/", { email, password }))
    .data;
}

async function signUp(
  email: string,
  password: string,
  name: string,
  age: number
): Promise<AuthSuccess> {
  return (
    await axios.post<AuthSuccess>("/auth/signup/", {
      email,
      password,
      name,
      age,
    })
  ).data;
}

async function self(): Promise<User> {
  return (await axios.get<User>("/auth/self/")).data;
}

export const AuthRepository = {
  login,
  signUp,
  self,
};
