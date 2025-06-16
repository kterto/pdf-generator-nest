import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Occurrence } from "./entities/occurrence.entity";
import { OccurrencesService } from "./occurreces.service";
import { OccurrencesController } from "./occurrences.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Occurrence])],
  providers: [OccurrencesService, OccurrencesController],
  exports: [OccurrencesService],
})
export class OccurrencesModule {}
