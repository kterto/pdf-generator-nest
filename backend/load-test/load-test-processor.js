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
  const maxWaitTime = 300000; // 240s
  const startTime = Date.now();

  if (!jobId || !token) {
    return done(new Error("Missing jobId or token"));
  }

  const sseUrl = `http://localhost:3000/reports/status/${jobId}`;
  console.log(`[${jobId}] Connecting to ${sseUrl}`);

  try {
    return new Promise((resolve, reject) => {
      const es = new EventSource(sseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      timeout = setTimeout(() => {
        if (!completed) {
          console.log(`[${jobId}] SSE timeout after ${maxWaitTime}ms`);
          es.close();
          events.emit("counter", "sse.timeout", 1);
          reject(new Error("Timeout waiting for SSE event"));
        }
      }, maxWaitTime);

      es.onmessage = (event) => {
        if (!event.data || event.data.startsWith(":")) return;
        try {
          const data = JSON.parse(event.data);
          const elapsed = Date.now() - startTime;
          if (data.status === "completed") {
            clearTimeout(timeout);
            es.close();
            console.log(
              `[${jobId}] ✅ Job completed in ${Date.now() - startTime}ms`
            );
            events.emit("counter", "reports.completed", 1);
            events.emit("histogram", "reports.completion_time_ms", elapsed);

            context.vars.fileReady = true;
            resolve();
          } else if (data.status === "failed" || data.status === "not_found") {
            clearTimeout(timeout);
            events.emit("counter", "reports.not_found", 1);
            es.close();
            reject(new Error(`Job failed or not found: ${data.status}`));
          }
        } catch (err) {
          console.error(`[${jobId}] SSE parse error:`, err);
          events.emit("counter", "sse.parse_error", 1);
        }
      };

      es.onerror = (err) => {
        clearTimeout(timeout);
        es.close();
        reject(new Error(`SSE error: ${err.message || err}`));
      };
    });
  } catch (err) {
    console.error(`[${jobId}] ❌ ${err.message}`);
    done(err);
  }
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
  const contentLength =
    res.headers["content-length"] || Buffer.byteLength(res.body || "");

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
