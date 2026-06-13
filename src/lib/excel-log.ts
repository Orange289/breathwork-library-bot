import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import { excelLogPath } from "./config";
import type { TelegramUser } from "./types";

type LogEntry = {
  user: TelegramUser;
  action: string;
  label: string;
};

const headers = [
  "Дата/время",
  "Telegram ID",
  "Username",
  "Имя",
  "Фамилия",
  "Действие",
  "Кнопка"
];

export function appendExcelLog(entry: LogEntry) {
  fs.mkdirSync(path.dirname(excelLogPath), { recursive: true });

  const workbook = fs.existsSync(excelLogPath)
    ? XLSX.readFile(excelLogPath)
    : XLSX.utils.book_new();

  const sheetName = "actions";
  const sheet = workbook.Sheets[sheetName];
  const rows: unknown[][] = sheet ? XLSX.utils.sheet_to_json(sheet, { header: 1 }) : [headers];

  rows.push([
    new Date().toLocaleString("ru-RU", { timeZone: "Europe/Lisbon" }),
    entry.user.id,
    entry.user.username ? `@${entry.user.username}` : "",
    entry.user.first_name ?? "",
    entry.user.last_name ?? "",
    entry.action,
    entry.label
  ]);

  workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows);

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, excelLogPath);
}
