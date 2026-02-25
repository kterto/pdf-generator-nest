import axios from "axios";
import type { OccurrenceStatus, ReportRequest } from "../domain/types";

async function requestReport(
  start: string,
  end: string,
  status: OccurrenceStatus | "all",
  onlyOwnOccurrences: boolean
): Promise<ReportRequest> {
  return (
    await axios.post("/reports/create_report/", {
      start,
      end,
      status,
      onlyOwnOccurrences,
    })
  ).data;
}

function reportJobStatusEventSource(jobId: number): EventSource {
  return new EventSource(
    `${import.meta.env.VITE_API_URL}/reports/status/${jobId}`
  );
}

async function getReportFile(jobId: number): Promise<Blob> {
  return (await axios.get(`/reports/file/${jobId}`, { responseType: "blob" }))
    .data;
}

export const ReportRepository = {
  requestReport,
  reportJobStatusEventSource,
  getReportFile,
};
