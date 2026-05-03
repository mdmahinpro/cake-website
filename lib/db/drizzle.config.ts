import { defineConfig } from "drizzle-kit";
import path from "path";

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const url = rawUrl.includes("sslmode=")
  ? rawUrl
  : rawUrl + (rawUrl.includes("?") ? "&" : "?") + "sslmode=require";

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: { url },
});
