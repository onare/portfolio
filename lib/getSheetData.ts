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
  //@ts-ignore
  const sheets = google.sheets({ auth, version: "v4" });
  const range = "players!B2:G";

  try {
    const list: string[] = [];
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });

    if (response?.data?.values) {
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
    console.log("data fetched");
    return list;
  } catch (error) {
    console.log(error);
    return [];
  }
}
