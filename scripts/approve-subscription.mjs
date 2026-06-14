import { loadDotEnv } from "./env.mjs";

loadDotEnv();

const userId = Number(process.argv[2]);
const publicBaseUrl = process.env.PUBLIC_BASE_URL;
const adminSecret = process.env.ADMIN_SECRET;

async function main() {
  if (!userId) {
    throw new Error("Usage: npm run approve-subscription -- TELEGRAM_USER_ID");
  }

  if (!publicBaseUrl) {
    throw new Error("PUBLIC_BASE_URL is required");
  }

  if (!adminSecret) {
    throw new Error("ADMIN_SECRET is required");
  }

  const response = await fetch(
    `${publicBaseUrl.replace(/\/$/, "")}/api/admin/approve`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        secret: adminSecret
      })
    }
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(`Approval failed: ${JSON.stringify(result)}`);
  }

  console.log("Subscription approved:");
  console.log(JSON.stringify(result.subscription, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
