import axios from "axios";

export function axiosSetup() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

export function axiosSetToken(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function axiosRemoveToken() {
  delete axios.defaults.headers.common["Authorization"];
}

export function axiosGetToken(): string | undefined {
  return axios.defaults.headers.common["Authorization"] as string;
}
