import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function User(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(500).json({ message: "Only post available." });
  }

  const body = req.body;
  const playerId = body?.tableReference?.replace("B", "");
  const range = `playerdetails!C${playerId}:J${playerId}`;

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

    //@ts-ignore
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: body?.data,
      },
    });

    return res.status(200).json({ message: "Internal Server Error" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error sending information" });
  }
}
