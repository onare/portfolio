"use client";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

function EventCardDetails(props) {
  const { data } = props;
  return (
    <>
      <div className="preview flex w-full justify-left items-center">
        <Card className="rounded-lg border bg-card text-card-foreground shadow-sm w-[250px] h-[135px]">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col ">
                <Typography gutterBottom variant="h5" component="div">
                  {data?.event}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.horario}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function EventCard(props) {
  const { events, eventsDetails } = props;
  console.log(events);
  console.log(eventsDetails);

  const currentDay = format(new Date(), "EEEE");
  const eventsDay = [...events].filter((e) => e.day === "Saturday");
  const eventList = [...eventsDetails].filter(
    (ed) => eventsDay[0]?.events?.indexOf(ed.event) >= 0
  );
  console.log(eventList);

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
              <EventCardDetails data={event} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
