import { status } from "./db.js";

async function main() {
  const { error, status: stat } = await status();
  stat === "connected"
    ? console.log("> Database connection status: ✅ Connected")
    : console.log("> Database connection status: ❌ Failed to connect", error);
  return;
}

main();
