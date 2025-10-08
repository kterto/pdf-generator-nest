import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ReportsProcessor } from "./reports.processor";
import { OccurrencesModule } from "../occurrences/occurrences.module";
import { PdfGeneratorModule } from "../pdf-generator/pdf-generator.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "pdf-reports",
    }),
    OccurrencesModule,
    PdfGeneratorModule,
  ],
  providers: [ReportsProcessor],
  exports: [],
})
export class ReportsModule {}
