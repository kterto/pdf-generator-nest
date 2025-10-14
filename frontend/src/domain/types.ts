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
  id: string;
  user_id: string;
  description: string;
  status: OccurrenceStatus;
  created_at: string;
  updated_at: string;
}
