import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ReportsProcessor } from "./reports.processor";
import { OccurrencesModule } from "../occurrences/occurrences.module";
import { PdfGeneratorModule } from "../pdf-generator/pdf-generator.module";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "pdf-reports",
    }),
    OccurrencesModule,
    PdfGeneratorModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsProcessor, ReportsService],
  exports: [],
})
export class ReportsModule {}
