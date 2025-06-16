import { Controller, Post, Query, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("reports")
export class ReportsController {
  constructor(@InjectQueue("pdf-reports") private pdfQueue: Queue) {}

  @ApiOperation({ summary: "Generate PDF report" })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["open", "closed", "abandoned", "all"],
  })
  @ApiQuery({ name: "start", required: true, type: "string" })
  @ApiQuery({ name: "end", required: false, type: "string" })
  @Post("create_report")
  async createReport(
    @Query("status") status: string,
    @Query("start") start: string,
    @Query("end") end: string,
    @Request() req
  ) {
    const filters = {
      status: status || "all",
      start,
      end: end || new Date().toISOString(),
    };

    const job = await this.pdfQueue.add("generate-report", {
      userId: req.user.id,
      filters,
    });

    return {
      message: "Report generation queued successfully",
      jobId: job.id,
    };
  }
}
