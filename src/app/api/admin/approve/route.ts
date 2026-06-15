import { NextResponse } from "next/server";
import { adminSecret } from "@/lib/config";
import { practicesKeyboard } from "@/lib/keyboards";
import { approveSubscription } from "@/lib/subscriptions";
import { formatRuDate } from "@/lib/practices";
import { sendMessage } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userId?: number; secret?: string };

    if (!adminSecret || body.secret !== adminSecret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!body.userId) {
      return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });
    }

    let subscription;

    try {
      subscription = await approveSubscription(body.userId);
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          stage: "approveSubscription",
          error: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    const activeUntil = new Date(subscription.activeUntil);

    try {
      await sendMessage(
        body.userId,
        `Я получила вашу оплату, теперь вам доступны практики до ${formatRuDate(activeUntil)} включительно!`,
        practicesKeyboard()
      );
    } catch (error) {
      return NextResponse.json(
        {
          ok: false,
          stage: "sendMessage",
          subscription,
          error: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, subscription });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "unexpected",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
