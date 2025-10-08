import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class ReportsService {
  constructor(@InjectQueue("pdf-reports") private pdfQueue: Queue) {}

  async requestPdfReport(
    userId: number,
    filters: {
      status: string;
      start: string;
      end: string;
    }
  ) {
    const job = await this.pdfQueue.add("generate-report", {
      userId: userId,
      filters,
    });

    return {
      message: "Report generation queued successfully",
      jobId: job.id,
    };
  }
}
