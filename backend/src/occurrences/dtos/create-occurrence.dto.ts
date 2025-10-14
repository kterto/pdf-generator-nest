import { OccurrenceStatus } from "../entities/occurrence.entity";

export class CreateOccurrenceDto {
  description: string;
  status?: OccurrenceStatus;
}
