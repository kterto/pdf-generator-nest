import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Occurrence } from "./entities/occurrence.entity";
import { OccurrencesService } from "./occurreces.service";
import { OccurrencesController } from "./occurrences.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Occurrence]), UsersModule],
  controllers: [OccurrencesController],
  providers: [OccurrencesService],
  exports: [OccurrencesService],
})
export class OccurrencesModule {}
