export type OccurrenceStatus = "open" | "closed" | "abandoned";

export interface User {
  id: number;
  created_at: string;
  name: string;
  age: number;
  email: string;
}

export interface AuthSuccess {
  access_token: string;
  user: User;
}

export interface Occurrence {
  id: number;
  description: string;
  status: OccurrenceStatus;
  created_at: string;
  closed_at?: string;
}
