import { Controller, Post, Query, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ReportsService } from "./reports.service";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

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

    return this.reportsService.requestPdfReport(req.user.id, filters);
  }
}
