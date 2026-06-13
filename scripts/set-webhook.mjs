import fs from "node:fs";

loadDotEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;
const publicBaseUrl = process.env.PUBLIC_BASE_URL;

async function main() {
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is required");
  }

  if (!publicBaseUrl) {
    throw new Error("PUBLIC_BASE_URL is required");
  }

  const webhookUrl = `${publicBaseUrl.replace(/\/$/, "")}/api/telegram`;
  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true
    })
  });

  const result = await response.json();
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

function loadDotEnv() {
  if (!fs.existsSync(".env")) {
    return;
  }

  const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    process.env[key] ??= value;
  }
}
