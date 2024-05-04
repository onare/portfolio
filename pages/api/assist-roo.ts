import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function assistSubmit(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(500).json({ message: "Only post available." });
  }

  const body = req.body;
  const range = "asistencia!B1:G";

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEET_EMAIL,
        private_key: process.env.GOOGLE_SHEET_PK,
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ auth, version: "v4" });

    const resources = body;
    //@ts-ignore
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: resources,
      },
    });

    return res.status(200).json({ message: "Internal Server Error" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending information" });
  }
}
