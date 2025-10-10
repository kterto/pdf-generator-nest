import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { Injectable } from "@nestjs/common";
import { PdfGeneratorService } from "../pdf-generator/pdf-generator.service";
import { OccurrencesService } from "../occurrences/occurreces.service";

@Injectable()
@Processor("pdf-reports")
export class ReportsProcessor {
  constructor(
    private pdfGeneratorService: PdfGeneratorService,
    private occurrencesService: OccurrencesService
  ) {}

  @Process("generate-report")
  async generateReport(job: Job) {
    console.log("Processing job:", job.id, "with data:", job.data);
    const { userId, filters } = job.data;

    try {
      // Fetch occurrences based on filters
      const occurrences = await this.occurrencesService.findByFilters(
        userId,
        filters
      );

      console.log(`Found ${occurrences.length} occurrences for user ${userId}`);
      console.log("occurrences:", occurrences);

      // Prepare data for PDF generation
      const reportData = {
        status: filters.status || "all",
        totalOccurrences: occurrences.length,
        occurrences: occurrences.map((occ) => ({
          id: occ.id,
          created_at: occ.created_at.toISOString(),
          created_by: occ.created_by.name,
          closed_at: occ.closed_at?.toISOString() || null,
          description: occ.description,
          status: occ.status,
        })),
        dateRange: {
          start: filters.start,
          end: filters.end || new Date().toISOString(),
        },
      };

      // Generate PDF
      const pdfBuffer = await this.pdfGeneratorService.generateReportPdf(
        reportData
      );

      // In a real app, you'd save this to a file storage service
      // For now, we'll just return success
      console.log("Report generated successfully for job:", job.id);
      return { success: true, pdfSize: pdfBuffer.length };
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  }
}
