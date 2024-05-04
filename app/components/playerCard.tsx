"use client";

import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { format } from "date-fns";
import { useState } from "react";

export function PlayerCard(props) {
  const { players, events, eventsDetails } = props;

  const [formData, setFormData] = useState([...players]);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  const currentDay = format(new Date(), "EEEE");
  const eventsDay = [...events].filter((e) => e.day === "Saturday");
  const eventList = [...eventsDetails].filter(
    (ed) => eventsDay[0]?.events?.indexOf(ed.event) >= 0
  );

  const handleChangeForm = (input: String, value: String, checked: Boolean) => {
    let newFormData = {};
    let newData;
    const checkedChar = checked ? "S" : "N";

    if (input === "events") {
      const newEvents = [];
      const data = formData?.find((fd) => fd.label === selectedPlayer);
      const check = data.events?.findIndex((e) => e.e === value);
      if (!check) {
        newEvents.push({ e: value, a: checkedChar });
        newData = newEvents;
      } else {
        const newObject = { e: value, a: checkedChar };
        newData = data.events.map((obj) => (obj.e === value ? newObject : obj));
      }

      newFormData = { ...data, events: newData };
    }

    const newState = [...formData].map((data) =>
      data.label === selectedPlayer ? newFormData : data
    );

    setFormData(newState);
  };

  return (
    <>
      <Divider textAlign="left" className="mb-4">
        ASISTENCIA
      </Divider>
      <div className="preview flex w-full justify-left items-center">
        <Card className="rounded-lg border bg-card text-card-foreground shadow-sm w-[350px]">
          <CardContent>
            <form className="space-y-4  mt-4">
              <div className="grid w-full items-center gap-4">
                <Typography
                  variant="body2"
                  className="mb-1"
                  color="text.secondary"
                >
                  Para poder poner tu asistencia, favor seleccionar jugador y
                  los eventos que participaras.
                </Typography>
                <div className="flex flex-col ">
                  <Autocomplete
                    disablePortal
                    id="player-list"
                    options={players}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Jugador" />
                    )}
                    // onChange={handleChangeForm}
                    onInputChange={(event, newInputValue: String) => {
                      setSelectedPlayer(newInputValue);
                    }}
                  />
                </div>

                <FormGroup>
                  {eventList?.length > 0 &&
                    eventList.map((e, i) => {
                      const checkEvent = players
                        .find((p) => p.label === selectedPlayer)
                        ?.events?.find((event) => event.e === e.event);

                      const checkAssist = eventList.find(
                        (event) => event.event === e.event
                      );

                      const playerInfo = players.find(
                        (player) => player.label === selectedPlayer
                      );

                      return (
                        <>
                          <FormControlLabel
                            className="pl-2"
                            key={i}
                            required={
                              checkAssist?.asistencia === "S" ? true : false
                            }
                            disabled={
                              checkAssist?.asistencia === "N"
                                ? true
                                : false || playerInfo?.llenado === 1
                                ? true
                                : false
                            }
                            // checked={checkEvent?.a === "S" ? true : false}
                            control={<Switch />}
                            label={`${e.event} (${e.horario})`}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChangeForm(
                                "events",
                                e.event,
                                event.target.checked
                              );
                            }}
                          />
                        </>
                      );
                    })}
                </FormGroup>
              </div>
            </form>
          </CardContent>
          <CardActions className="flex justify-center p-2">
            <Button variant="contained" className="text-zinc-100">
              Enviar Asistencia
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  );
}
