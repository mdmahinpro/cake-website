import app from "./app";
import { logger } from "./lib/logger";
import { ensureSchema } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

/* Create the shops table if it doesn't exist yet (safe no-op otherwise) */
ensureSchema().catch((err) => {
  logger.warn({ err }, "ensureSchema failed — continuing anyway");
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
