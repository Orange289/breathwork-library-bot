const token = process.env.TELEGRAM_BOT_TOKEN;
const publicBaseUrl = process.env.PUBLIC_BASE_URL;

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

export {};
