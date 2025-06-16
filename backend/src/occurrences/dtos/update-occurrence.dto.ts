import { OccurrenceStatus } from "../entities/occurrence.entity";

export class CreateOccurrenceDto {
  status: OccurrenceStatus;
  description: string;
}
