import { NextResponse } from "next/server";
import { adminSecret } from "@/lib/config";
import { practicesKeyboard } from "@/lib/keyboards";
import { approveSubscription } from "@/lib/subscriptions";
import { formatRuDate } from "@/lib/practices";
import { sendMessage } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: number; secret?: string };

  if (!adminSecret || body.secret !== adminSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!body.userId) {
    return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });
  }

  const subscription = approveSubscription(body.userId);
  const activeUntil = new Date(subscription.activeUntil);

  await sendMessage(
    body.userId,
    `Я получила вашу оплату, теперь вам доступны практики до ${formatRuDate(activeUntil)} включительно!`,
    practicesKeyboard()
  );

  return NextResponse.json({ ok: true, subscription });
}
