import { NextResponse } from "next/server";
import {
  adminSecret,
  googlePrivateKey,
  googleServiceAccountEmail,
  googleSheetsSheetName,
  googleSheetsSpreadsheetId
} from "@/lib/config";
import { appendGoogleSheetLog, isGoogleSheetsLogConfigured } from "@/lib/google-sheets-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const configured = {
    GOOGLE_SHEETS_SPREADSHEET_ID: Boolean(googleSheetsSpreadsheetId),
    GOOGLE_SHEETS_SHEET_NAME: googleSheetsSheetName,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: Boolean(googleServiceAccountEmail),
    GOOGLE_PRIVATE_KEY: Boolean(googlePrivateKey),
    GOOGLE_PRIVATE_KEY_HAS_BEGIN: googlePrivateKey?.includes("BEGIN PRIVATE KEY") ?? false
  };

  if (!isGoogleSheetsLogConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured,
        error: "Google Sheets logging is not fully configured."
      },
      { status: 500 }
    );
  }

  try {
    await appendGoogleSheetLog({
      user: {
        id: 0,
        first_name: "Google Sheets Test",
        username: "diagnostic"
      },
      action: "diagnostic",
      label: "test-google-sheets",
      practice: "diagnostic",
      subscriptionStatus: "diagnostic"
    });

    return NextResponse.json({
      ok: true,
      configured,
      message: "Test row was appended or Google Sheets logging is not configured."
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured,
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
