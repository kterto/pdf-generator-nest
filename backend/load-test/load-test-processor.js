// Handle both CommonJS and ES module imports
let EventSource;
try {
  EventSource = require("eventsource");
  // Some versions export as .EventSource
  if (EventSource.EventSource) {
    EventSource = EventSource.EventSource;
  }
} catch (e) {
  console.error("Failed to load EventSource:", e.message);
  throw e;
}

/**
 * Wait for job completion using Server-Sent Events
 */
async function waitForJobCompletionSSE(context, events, done) {
  const jobId = context.vars.jobId;
  const token = context.vars.token;
  const maxWaitTime = 120000; // 120 seconds timeout
  const startTime = Date.now();

  if (!jobId) {
    events.emit("counter", "sse.missing_job_id", 1);
    return done(new Error("No jobId found in context"));
  }

  if (!EventSource) {
    events.emit("counter", "sse.library_not_loaded", 1);
    return done(new Error("EventSource library not loaded"));
  }

  console.log(`[${jobId}] Starting SSE connection...`);

  let eventSource;
  try {
    const sseUrl = `http://localhost:3000/reports/status/${jobId}`;
    eventSource = new EventSource(sseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`[${jobId}] Failed to create EventSource:`, error.message);
    events.emit("counter", "sse.creation_failed", 1);
    return done(error);
  }

  let completed = false;
  let timeout;

  // Set timeout
  timeout = setTimeout(() => {
    if (!completed) {
      console.log(`[${jobId}] SSE timeout after ${maxWaitTime}ms`);
      eventSource.close();
      events.emit("counter", "sse.timeout", 1);
      done(new Error("SSE timeout"));
    }
  }, maxWaitTime);

  // Handle SSE messages
  eventSource.onmessage = (event) => {
    // Skip keep-alive messages
    if (event.data === ": keep-alive") {
      return;
    }

    try {
      const data = JSON.parse(event.data);
      const elapsed = Date.now() - startTime;

      console.log(`[${jobId}] SSE event received:`, data.status);

      if (data.status === "completed") {
        completed = true;
        clearTimeout(timeout);
        eventSource.close();

        console.log(`[${jobId}] Job completed in ${elapsed}ms`);
        events.emit("counter", "reports.completed", 1);
        events.emit("histogram", "reports.completion_time_ms", elapsed);

        // Store the file path for potential use
        if (data.key) {
          context.vars.filePath = data.key;
        }

        done();
      } else if (data.status === "failed") {
        completed = true;
        clearTimeout(timeout);
        eventSource.close();

        console.error(`[${jobId}] Job failed:`, data.error);
        events.emit("counter", "reports.failed", 1);
        done(new Error(`Job failed: ${data.error}`));
      } else if (data.status === "not_found") {
        completed = true;
        clearTimeout(timeout);
        eventSource.close();

        console.error(`[${jobId}] Job not found`);
        events.emit("counter", "reports.not_found", 1);
        done(new Error("Job not found"));
      } else {
        // Job still processing (active, waiting, delayed, etc.)
        events.emit("counter", `reports.status.${data.status}`, 1);
      }
    } catch (error) {
      console.error(`[${jobId}] Error parsing SSE data:`, error.message);
      events.emit("counter", "sse.parse_error", 1);
    }
  };

  // Handle SSE errors
  eventSource.onerror = (error) => {
    if (!completed) {
      completed = true;
      clearTimeout(timeout);
      eventSource.close();

      console.error(`[${jobId}] SSE error:`, error.message || error);
      events.emit("counter", "sse.connection_error", 1);
      done(new Error(`SSE connection error: ${error.message || "Unknown"}`));
    }
  };

  // Handle connection open
  eventSource.onopen = () => {
    console.log(`[${jobId}] SSE connection opened`);
    events.emit("counter", "sse.connected", 1);
  };
}

/**
 * Log response details for debugging
 */
function logResponse(req, res, context, events, done) {
  const statusCode = res.statusCode;
  const url = req.url;

  if (statusCode >= 400) {
    console.error(`[ERROR] ${req.method} ${url} -> ${statusCode}`);
    console.error("Response body:", res.body?.substring(0, 500));
  } else {
    console.log(`[OK] ${req.method} ${url} -> ${statusCode}`);
  }

  return done();
}

/**
 * Log PDF download
 */
function logDownload(req, res, context, events, done) {
  const jobId = context.vars.jobId;
  const contentLength = res.headers["content-length"];

  if (res.statusCode === 200) {
    console.log(
      `[${jobId}] PDF downloaded successfully (${contentLength} bytes)`
    );
    events.emit("counter", "pdf.downloaded", 1);
    events.emit("histogram", "pdf.size_bytes", parseInt(contentLength) || 0);
  } else {
    console.error(`[${jobId}] PDF download failed: ${res.statusCode}`);
    events.emit("counter", "pdf.download_failed", 1);
  }

  return done();
}

module.exports = {
  waitForJobCompletionSSE,
  logResponse,
  logDownload,
};
