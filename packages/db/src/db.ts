import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const env = { DATABASE_URL: process.env.DATABASE_URL || null };
if (!env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL env variable");
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
export const db = drizzle({ client: pool });

export async function status() {
  try {
    const res = await db.execute("SELECT 1");
    return { status: "connected", res };
  } catch (error) {
    return { status: "disconnected", error };
  }
}
