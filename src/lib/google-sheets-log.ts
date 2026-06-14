import { google } from "googleapis";
import {
  googlePrivateKey,
  googleServiceAccountEmail,
  googleSheetsSheetName,
  googleSheetsSpreadsheetId
} from "./config";
import { logEntryToRow, type LogEntry } from "./log-entry";

export function isGoogleSheetsLogConfigured() {
  return Boolean(
    googleSheetsSpreadsheetId &&
      googleServiceAccountEmail &&
      googlePrivateKey
  );
}

export async function appendGoogleSheetLog(entry: LogEntry) {
  if (!isGoogleSheetsLogConfigured()) {
    return;
  }

  const auth = new google.auth.JWT({
    email: googleServiceAccountEmail,
    key: googlePrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: googleSheetsSpreadsheetId,
    range: `${googleSheetsSheetName}!A:H`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [logEntryToRow(entry)]
    }
  });
}
