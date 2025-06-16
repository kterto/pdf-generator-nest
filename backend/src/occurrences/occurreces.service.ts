import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Occurrence, OccurrenceStatus } from "./entities/occurrence.entity";
import { CreateOccurrenceDto } from "./dtos/create-occurrence.dto";

@Injectable()
export class OccurrencesService {
  constructor(
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>
  ) {}

  async create(createOccurrenceDto: CreateOccurrenceDto, userId: number) {
    const occurrence = this.occurrenceRepository.create({
      ...createOccurrenceDto,
      created_by: { id: userId },
      status: OccurrenceStatus.OPEN,
    });
    return this.occurrenceRepository.save(occurrence);
  }

  async findAllByUser(userId: number) {
    return this.occurrenceRepository.find({
      where: { created_by: { id: userId } },
      relations: ["created_by"],
    });
  }

  async update(
    id: number,
    updateOccurrenceDto: CreateOccurrenceDto,
    userId: number
  ) {
    const occurrence = await this.findOneByUser(id, userId);
    Object.assign(occurrence, updateOccurrenceDto);
    return this.occurrenceRepository.save(occurrence);
  }

  async close(id: number, userId: number) {
    const occurrence = await this.findOneByUser(id, userId);
    occurrence.status = OccurrenceStatus.CLOSED;
    occurrence.closed_at = new Date();
    return this.occurrenceRepository.save(occurrence);
  }

  async remove(id: number, userId: number) {
    const occurrence = await this.findOneByUser(id, userId);
    return this.occurrenceRepository.remove(occurrence);
  }

  private async findOneByUser(id: number, userId: number) {
    const occurrence = await this.occurrenceRepository.findOne({
      where: { id, created_by: { id: userId } },
      relations: ["created_by"],
    });

    if (!occurrence) {
      throw new NotFoundException("Occurrence not found");
    }

    return occurrence;
  }
}
