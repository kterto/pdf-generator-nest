const EventSource = require("eventsource");

module.exports = {
  async waitForJobCompletion(context, events, done) {
    const jobId = context.vars.jobId;
    const target = context.config.target.replace(/\/$/, "");
    const url = `${target}/reports/status/${jobId}`;

    return new Promise((resolve) => {
      const es = new EventSource(url);
      const timeout = setTimeout(() => {
        console.warn(`Job ${jobId} timed out waiting for completion`);
        es.close();
        resolve(done());
      }, 60000); // timeout after 60 seconds

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === "completed" || data.status === "failed") {
            clearTimeout(timeout);
            es.close();
            resolve(done());
          }
        } catch (err) {
          console.error("Invalid SSE message:", event.data);
        }
      };

      es.onerror = (err) => {
        console.error("SSE error:", err);
        clearTimeout(timeout);
        es.close();
        resolve(done());
      };
    });
  },
};
