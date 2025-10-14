import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { UsersService } from "../users/users.service";

@Injectable()
export class ReportsService {
  constructor(
    @InjectQueue("pdf-reports") private pdfQueue: Queue,
    private readonly usersService: UsersService
  ) {}

  async requestPdfReport(
    user: string,
    filters: {
      status: string;
      start: string;
      end: string;
      onlyOwnOccurrences: boolean;
    }
  ) {
    const userId = (await this.usersService.findByEmail(user)).id;
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
