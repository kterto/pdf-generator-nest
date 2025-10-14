export type OccurrenceStatus = "open" | "closed" | "abandoned";

export interface Occurrence {
  id: string;
  user_id: string;
  description: string;
  status: OccurrenceStatus;
  created_at: string;
  updated_at: string;
}
