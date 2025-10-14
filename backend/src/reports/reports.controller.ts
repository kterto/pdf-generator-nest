import {
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Body,
  Sse,
  Param,
  Get,
  StreamableFile,
  Res,
  NotFoundException,
} from "@nestjs/common";

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
} from "@nestjs/swagger";
import { ReportsService } from "./reports.service";
import { Observable } from "rxjs";
import { Response as ExpressResponse } from "express";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { createReadStream, existsSync } from "fs";
import { JwtAuthGuard } from "../auth/jwt-auth-guard";

@ApiTags("Reports")
@ApiBearerAuth()
@Controller("reports")
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    @InjectQueue("pdf-reports") private reportsQueue: Queue
  ) {}

  @ApiOperation({ summary: "Generate PDF report" })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["open", "closed", "abandoned", "all"],
  })
  @ApiQuery({ name: "start", required: true, type: "string" })
  @ApiQuery({ name: "end", required: false, type: "string" })
  @ApiBearerAuth("JWT")
  @UseGuards(JwtAuthGuard)
  @Post("create_report")
  async createReport(
    @Body("status") status: string,
    @Body("start") start: string,
    @Body("end") end: string,
    @Body("onlyOwnOccurrences") onlyOwnOccurrences: boolean,
    @Request() req
  ) {
    const filters = {
      status: status || "all",
      start,
      end: end || new Date().toISOString(),
      onlyOwnOccurrences: onlyOwnOccurrences,
    };
    return this.reportsService.requestPdfReport(req.user.email, filters);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Verificar status do relatório e obter o arquivo" })
  @ApiOkResponse({ description: "PDF report or job status" })
  @Get("file/:jobId")
  async getReportStatus(
    @Param("jobId") jobId: string,
    @Res({ passthrough: true }) res: ExpressResponse
  ): Promise<StreamableFile | { status: string; url?: string; error?: any }> {
    const job = await this.reportsQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException("Job not found");
    }

    const jobState = await job.getState();
    if (jobState === "completed") {
      const result = job.returnvalue;
      console.log("Job completed with result:", result);
      if (result?.filePath && existsSync(result.filePath)) {
        const fileStream = createReadStream(result.filePath);

        // Set response headers for a PDF file
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="report-${jobId}.pdf"`,
        });

        // Return file as a StreamableFile
        return new StreamableFile(fileStream);
      } else {
        return { status: "completed", error: "File not found on disk" };
      }
    } else if (jobState === "failed") {
      return { status: "failed", error: job.failedReason };
    } else {
      return { status: jobState };
    }
  }

  @Sse("status/:jobId")
  async streamJobStatus(
    @Param("jobId") jobId: string,
    @Response() res: ExpressResponse
  ): Promise<Observable<MessageEvent>> {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    console.log("Streaming job status for jobId:", jobId);
    return new Observable((observer) => {
      const checkStatus = async () => {
        try {
          const job = await this.reportsQueue.getJob(jobId);

          if (!job) {
            observer.next({
              data: JSON.stringify({ status: "not_found" }),
            } as MessageEvent);
            observer.complete();
            return;
          }

          const jobState = await job.getState();

          if (jobState === "completed") {
            const result = job.returnvalue;
            observer.next({
              data: JSON.stringify({
                status: "completed",
                key: result.filePath,
              }),
            } as MessageEvent);
            setTimeout(() => observer.complete(), 750);
          } else if (jobState === "failed") {
            observer.next({
              data: JSON.stringify({
                status: "failed",
                error: job.failedReason,
              }),
            } as MessageEvent);
            setTimeout(() => observer.complete(), 750);
          }
        } catch (error) {
          console.error("Error checking job status:", error);
          observer.next({
            data: JSON.stringify({
              status: "error",
              error: "Internal server error",
            }),
          } as MessageEvent);
          setTimeout(() => observer.complete(), 750);
        }
      };

      const keepAliveInterval = setInterval(() => {
        observer.next({ data: ": keep-alive" } as MessageEvent);
      }, 15000);

      const statusInterval = setInterval(checkStatus, 1000);

      return () => {
        clearInterval(statusInterval);
        clearInterval(keepAliveInterval);
        res.end();
      };
    });
  }
}
