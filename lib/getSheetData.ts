import { google } from "googleapis";

interface EventList {
  label: string;
  events: Array<any>;
  llenado: number;
}

export default async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEET_EMAIL,
      private_key: process.env.GOOGLE_SHEET_PK,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
  const range = "players!B2:G";

  try {
    const list = [];
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });

    if (response?.data?.values?.length) {
      response.data.values?.forEach((value) => {
        const newObject = {
          label: value[0],
          events: [
            { e: "Phantom Hunt", a: value[1] },
            { e: "Guild League", a: value[2] },
            { e: "War of Emperium", a: value[3] },
            { e: "Time-Space Anomaly", a: value[4] },
          ],
          llenado: +value[5],
        } as EventList;
        list.push(newObject as never);
      });
    }

    return list;
  } catch (error) {
    return [];
  }
}
