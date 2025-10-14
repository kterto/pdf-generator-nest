import axios from "axios";
import type { Occurrence, OccurrenceStatus } from "../domain/types";

async function create(
  description: string,
  status: OccurrenceStatus
): Promise<Occurrence> {
  return (await axios.post("/occurrences", { description, status })).data;
}

export const OccurrenceRepository = { create };
