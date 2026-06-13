import { NextResponse } from "next/server";
import { audioPaths } from "@/lib/config";
import { appendExcelLog } from "@/lib/excel-log";
import {
  backToMenuKeyboard,
  practicesKeyboard,
  subscriptionKeyboard,
  welcomeKeyboard
} from "@/lib/keyboards";
import { findPractice, subscribeText, welcomeText } from "@/lib/practices";
import { hasActiveSubscription, markPaymentPending } from "@/lib/subscriptions";
import { answerCallbackQuery, sendAudio, sendMessage } from "@/lib/telegram";
import type { TelegramUpdate, TelegramUser } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const update = (await request.json()) as TelegramUpdate;

  try {
    if (update.message) {
      await handleMessage(update);
    }

    if (update.callback_query) {
      await handleCallback(update);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "telegram-webhook" });
}

async function handleMessage(update: TelegramUpdate) {
  const message = update.message;
  const user = message?.from;

  if (!message || !user) {
    return;
  }

  if (message.text === "/start") {
    safeAppendExcelLog({ user, action: "command", label: "/start" });
    await sendMessage(message.chat.id, welcomeText, welcomeKeyboard());
    return;
  }

  await sendMessage(
    message.chat.id,
    "Чтобы открыть библиотеку, нажмите /start",
    welcomeKeyboard()
  );
}

async function handleCallback(update: TelegramUpdate) {
  const callback = update.callback_query;

  if (!callback?.data || !callback.message) {
    return;
  }

  const chatId = callback.message.chat.id;
  const user = callback.from;
  const data = callback.data;

  safeAppendExcelLog({
    user,
    action: "button",
    label: data
  });

  await answerCallbackQuery(callback.id);

  if (data === "start") {
    await sendMessage(chatId, welcomeText, welcomeKeyboard());
    return;
  }

  if (data === "menu") {
    await sendPracticesMenu(chatId);
    return;
  }

  if (data === "paid") {
    markPaymentPending(user);
    await sendMessage(
      chatId,
      "Я проверю оплату и скоро открою вам доступ к практикам!",
      backToMenuKeyboard()
    );
    return;
  }

  if (data.startsWith("practice:")) {
    await handlePractice(chatId, user, data.replace("practice:", ""));
  }
}

async function handlePractice(chatId: number, user: TelegramUser, practiceId: string) {
  const practice = findPractice(practiceId);

  if (!practice) {
    await sendMessage(chatId, "Практика не найдена.", practicesKeyboard());
    return;
  }

  if (practice.type === "subscription" && !hasActiveSubscription(user.id)) {
    await sendMessage(chatId, subscribeText, subscriptionKeyboard());
    return;
  }

  const audioPath = audioPaths[practice.audioKey];

  if (!audioPath) {
    if (practice.placeholder) {
      await sendMessage(
        chatId,
        `Здесь будет аудиозапись: ${practice.title}`,
        backToMenuKeyboard()
      );
      return;
    }

    await sendMessage(
      chatId,
      `Для практики "${practice.title}" пока не настроен AUDIO_*_PATH.`,
      backToMenuKeyboard()
    );
    return;
  }

  await sendAudio(chatId, audioPath, practice.title, backToMenuKeyboard());
}

async function sendPracticesMenu(chatId: number) {
  await sendMessage(
    chatId,
    "Выберите практику:",
    practicesKeyboard()
  );
}

function safeAppendExcelLog(entry: Parameters<typeof appendExcelLog>[0]) {
  try {
    appendExcelLog(entry);
  } catch (error) {
    console.error("Excel log failed", error);
  }
}
