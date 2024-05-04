import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import keys from "../../gs_key.json";

export default async function assistSubmit(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse("use POST", { status: 405 });
  }

  const body = req.body;
  const range = "asistencia!B1:G";

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: keys.client_email,
        private_key: keys.private_key,
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ auth, version: "v4" });

    const resources = body;

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: resources,
      },
    });

    return NextResponse.json({ message: "Information sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending information" },
      { status: 500 }
    );
  }
}
