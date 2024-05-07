"use client";

import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";

function EventCardDetails(props: any) {
  let assistColor;
  const { data, player } = props;
  console.log(data);

  const checkAssist = player?.events?.find(
    (event: any) => event.e === data?.event
  );

  console.log(checkAssist);
  if (checkAssist) {
    assistColor = "";
    if (checkAssist?.a === "S") assistColor = "#3ac14bc9";
    if (checkAssist?.a === "N") assistColor = "#ff0f0fb3";
  }

  console.log(assistColor);

  return (
    <>
      <div className="preview flex w-full justify-left items-center">
        <Card
          className="rounded-lg border bg-card text-card-foreground shadow-sm w-[250px] h-[135px]"
          sx={{ borderColor: assistColor }}
        >
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col ">
                <Typography gutterBottom variant="h5" component="div">
                  {data?.event}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.horario}
                </Typography>
                {checkAssist && (
                  <Typography
                    variant="body2"
                    align="left"
                    sx={{ color: assistColor }}
                  >
                    {checkAssist?.a === "S" ? "ASISTIRAS" : "NO PARTICIPARAS"}
                  </Typography>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function EventCard(props: any) {
  const { players, events, eventsDetails } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<any>({});

  const currentDay = format(new Date(), "EEEE");
  const eventsDay = [...events].filter((e) => e.day === currentDay);
  const eventList = [...eventsDetails].filter(
    (ed) => eventsDay[0]?.events?.indexOf(ed.event) >= 0
  );

  useEffect(() => {
    let saved: string = "";

    if (typeof window !== "undefined") {
      // Perform localStorage action
      saved = (localStorage.getItem("freedomUser") as never) || "";
    }

    if (saved) {
      const checkIfExist = players.find((p: any) => p.label === saved);
      if (checkIfExist) {
        setPlayer(checkIfExist);
      }
    }
    // setLoading(false);
  }, []);

  console.log(player);

  return (
    <>
      <Divider textAlign="left" className="mb-4">
        EVENTOS
      </Divider>
      <Grid
        container
        spacing={2}
        id="event-card-container"
        sx={{ display: "flex", flexDirection: "row" }}
      >
        {eventList.map((event) => {
          return (
            <Grid item xs={6} md={3} lg={3} sm={12}>
              <EventCardDetails data={event} player={player} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
