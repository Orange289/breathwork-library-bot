import type { TelegramUser } from "./types";

export type LogEntry = {
  user: TelegramUser;
  action: string;
  label: string;
  practice?: string;
  subscriptionStatus?: string;
};

export function logEntryToRow(entry: LogEntry) {
  return [
    new Date().toLocaleString("ru-RU", { timeZone: "Europe/Lisbon" }),
    entry.user.id,
    entry.user.username ? `@${entry.user.username}` : "",
    entry.user.first_name ?? "",
    entry.user.last_name ?? "",
    entry.action,
    entry.label,
    entry.practice ?? "",
    entry.subscriptionStatus ?? ""
  ];
}
