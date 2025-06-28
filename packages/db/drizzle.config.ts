import { defineConfig } from "drizzle-kit";

//@ts-ignore
const env = { DATABASE_URL: process.env.DATABASE_URL || null };
if (!env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL env variable");
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: { url: env.DATABASE_URL },
  casing: "snake_case",
});
