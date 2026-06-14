import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import { excelLogPath } from "./config";
import { logEntryToRow, type LogEntry } from "./log-entry";

const headers = [
  "Дата/время",
  "Telegram ID",
  "Username",
  "Имя",
  "Фамилия",
  "Действие",
  "Кнопка",
  "Практика",
  "Статус подписки"
];

export function appendExcelLog(entry: LogEntry) {
  fs.mkdirSync(path.dirname(excelLogPath), { recursive: true });

  const workbook = fs.existsSync(excelLogPath)
    ? XLSX.readFile(excelLogPath)
    : XLSX.utils.book_new();

  const sheetName = "actions";
  const sheet = workbook.Sheets[sheetName];
  const rows: unknown[][] = sheet ? XLSX.utils.sheet_to_json(sheet, { header: 1 }) : [headers];

  rows.push(logEntryToRow(entry));

  workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows);

  if (!workbook.SheetNames.includes(sheetName)) {
    workbook.SheetNames.push(sheetName);
  }

  XLSX.writeFile(workbook, excelLogPath);
}
