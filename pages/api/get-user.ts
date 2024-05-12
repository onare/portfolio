import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
  data: any;
};

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(500).json({ message: "Only post available.", data: "" });
  }

  let dataResponse;

  const body = req.body;
  const range = `playerdetails!${body?.userCell}:I${body?.userCell?.replace(
    "B",
    ""
  )}`;

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
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });

    if (response?.status === 200) {
      //@ts-ignore
      const data = response.data.values[0];

      dataResponse = {
        username: data[0] || "",
        whatsapp: data[1] || "",
        discord: data[2] || "",
        idioma: data[3] || "",
        job: data[4] || "",
        horario: { desde: data[5] || "00:00", hasta: data[6] || "23:30" },
        players: data[7]?.split(",").map((p: any) => ({ label: p })) || [],
      };
    }

    return res.status(200).json({ message: "ok", data: dataResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error sending information", data: {} });
  }
}
