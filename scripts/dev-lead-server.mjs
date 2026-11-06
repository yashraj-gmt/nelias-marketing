// Local test server only. Never deploy. Does not store anything.
import http from "node:http";
import { URL } from "node:url";

const HOST = "127.0.0.1";
const PORT = 8787;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${HOST}:${PORT}`);

  if (req.method === "POST" && parsedUrl.pathname === "/lead") {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
      // Guard against massive payloads
      if (rawBody.length > 1e6) {
        req.destroy();
      }
    });

    req.on("end", () => {
      let payload = {};
      try {
        payload = JSON.parse(rawBody || "{}");
      } catch {
        // invalid JSON
      }

      // Log non-personal telemetry only: field names, type, language
      const fieldNames = Object.keys(payload);
      console.log(
        `[dev-lead-server] Received lead: type="${payload.type || "unknown"}", lang="${payload.language || "unknown"}", fields=[${fieldNames.join(", ")}]`,
      );

      const isFail = parsedUrl.searchParams.get("fail") === "1";
      const isSlow = parsedUrl.searchParams.get("slow") === "1";

      const sendResponse = () => {
        if (isFail) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        }
      };

      if (isSlow) {
        // Wait 20 seconds before answering to trigger client 15s timeout
        setTimeout(sendResponse, 20000);
      } else {
        sendResponse();
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, HOST, () => {
  console.log(`[dev-lead-server] Listening on http://${HOST}:${PORT}/lead`);
});
