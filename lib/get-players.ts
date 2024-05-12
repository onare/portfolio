import { google } from "googleapis";

interface EventList {
  email: string;
  label: string;
  events: Array<any>;
  llenado: number;
  playerId: string;
}

export default async function getPlayers() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEET_EMAIL,
      private_key: process.env.GOOGLE_SHEET_PK,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  //@ts-ignore
  const sheets = google.sheets({ auth, version: "v4" });
  const range = "players!A2:H";

  try {
    const list: string[] = [];
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });

    if (response?.data?.values) {
      response.data.values?.forEach((value) => {
        const newObject = {
          email: value[0],
          label: value[1],
          events: [
            { e: "Phantom Hunt", a: value[2] },
            { e: "Guild League", a: value[3] },
            { e: "War of Emperium", a: value[4] },
            { e: "Time-Space Anomaly", a: value[5] },
          ],
          llenado: +value[6],
          playerId: value[7],
        } as EventList;
        list.push(newObject as never);
      });
    }

    return list;
  } catch (error) {
    return [];
  }
}
