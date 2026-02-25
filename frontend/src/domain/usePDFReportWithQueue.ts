import { useEffect, useState } from "react";
import type { OccurrenceStatus } from "./types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReportRepository } from "../data/report.repository";

export interface IPDFReportFilters {
  startDate: string;
  endDate: string;
  onlyOwnOccurrences: boolean;
  status: OccurrenceStatus | "all";
}

const usePDFReportWithQueue = () => {
  const [taskId, setTaskId] = useState<number | null>(null);
  const [statusEventSource, setStatusEventSource] =
    useState<EventSource | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [openedFile, setOpenedFile] = useState<boolean>(false);
  const taskMutation = useMutation({
    mutationFn: ({
      startDate,
      endDate,
      status,
      onlyOwnOccurrences,
    }: IPDFReportFilters) =>
      ReportRepository.requestReport(
        startDate,
        endDate,
        status,
        onlyOwnOccurrences
      ),
    onSuccess: (data) => {
      setTaskId(data.jobId);
      setOpenedFile(false);
    },
  });

  useEffect(() => {
    if (taskId) {
      setStatusEventSource(ReportRepository.reportJobStatusEventSource(taskId));
    }
  }, [taskId]);

  useEffect(() => {
    if (statusEventSource) {
      statusEventSource.onmessage = async (event) => {
        const { status } = JSON.parse(event.data);

        setTaskStatus(status);

        if (status === "completed" || status === "failed") {
          statusEventSource.close();
        }
      };
    }
    return () => {
      statusEventSource?.close();
    };
  }, [statusEventSource]);
  const reportQuery = useQuery({
    queryKey: [`report-${taskId}`, taskStatus],
    enabled: !!taskStatus && taskStatus === "completed",
    queryFn: async () => {
      if (!taskId) throw new Error("Task ID not found");

      const data = await ReportRepository.getReportFile(taskId);

      if (data) {
        const fileURL = window.URL.createObjectURL(data);
        if (!openedFile) {
          window.open(fileURL, "_blank");
          setOpenedFile(true);
        }
      }

      return data;
    },
  });

  return {
    startTask: taskMutation,
    isTaskStarting: taskMutation.isPending,
    reportQuery,
    setTaskStatus,
  };
};

export default usePDFReportWithQueue;
