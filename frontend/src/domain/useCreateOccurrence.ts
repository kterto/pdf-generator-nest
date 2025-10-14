import { useMutation } from "@tanstack/react-query";
import type { OccurrenceStatus } from "./types";
import { OccurrenceRepository } from "../data/occurrence.repository";

export interface ICreateOccurrencePayload {
  description: string;
  status: OccurrenceStatus;
}

const useCreateOccurrence = () => {
  return useMutation({
    mutationFn: ({ description, status }: ICreateOccurrencePayload) =>
      OccurrenceRepository.create(description, status),
  });
};

export default useCreateOccurrence;
