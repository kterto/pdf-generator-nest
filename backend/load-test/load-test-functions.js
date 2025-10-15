module.exports = {
  pollForJobCompletion: async function (context, events, done) {
    const jobId = context.vars.jobId;
    const token = context.vars.token;
    const maxAttempts = 20;
    const pollInterval = 2000; // 2 seconds

    let attempts = 0;

    const poll = async () => {
      attempts++;

      try {
        const response = await fetch(
          `http://localhost:3000/reports/file/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Job completed successfully
          events.emit("counter", "reports.success", 1);
          events.emit(
            "histogram",
            "reports.completion_time",
            attempts * pollInterval
          );
          return done();
        } else if (response.status === 202 || response.status === 404) {
          // Job still processing
          if (attempts >= maxAttempts) {
            events.emit("counter", "reports.timeout", 1);
            return done(new Error("Job timed out"));
          }
          setTimeout(poll, pollInterval);
        } else {
          // Unexpected error
          events.emit("counter", "reports.error", 1);
          return done(new Error(`Unexpected status: ${response.status}`));
        }
      } catch (error) {
        events.emit("counter", "reports.error", 1);
        return done(error);
      }
    };

    poll();
  },
};
