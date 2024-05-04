"use client";

import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { format } from "date-fns";
import { useState } from "react";

export function PlayerCard(props: any) {
  const { players, events, eventsDetails } = props;
  const currentDay = format(new Date(), "EEEE");
  const eventsDay = [...events].filter((e) => e.day === currentDay);
  const eventList = [...eventsDetails].filter(
    (ed) => eventsDay[0]?.events?.indexOf(ed.event) >= 0
  );

  const [formData, setFormData] = useState([
    ...players.map((player: any) => {
      return { ...player, eventsDay: eventList || [] };
    }),
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState({});

  const handleChangeForm = (input: String, value: String, checked: Boolean) => {
    let newFormData = {};
    let newData;
    const checkedChar = checked ? "S" : "N";

    if (input === "events") {
      const newEvents = [];
      const data = formData?.find((fd) => fd.label === selectedPlayer?.label);
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
      data.label === selectedPlayer?.label ? newFormData : data
    );

    setFormData(newState);
    setSelectedPlayer({
      ...newState.find((p) => p.label === selectedPlayer?.label),
    });
  };

  const handleSubmit = async () => {
    if (!selectedPlayer) return;

    const newDataEvents: string[] = [];

    const today = format(new Date(), "dd/MM/yyyy");

    selectedPlayer?.events?.forEach((event: any) => {
      newDataEvents.push([
        selectedPlayer.label.toString(),
        event.e.toString(),
        event.a.toString(),
        today,
      ]);
    });

    await fetch("/api/assist-roo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDataEvents),
    });

    setFormData((prevState) =>
      prevState.map((player: any) =>
        player.label === selectedPlayer?.label
          ? { ...selectedPlayer, llenado: 1 }
          : player
      )
    );
    setSelectedPlayer({});
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
                    value={selectedPlayer?.label ?? ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Jugador" />
                    )}
                    onInputChange={(event, newInputValue: String) => {
                      setSelectedPlayer({
                        ...formData.find((p) => p.label === newInputValue),
                      });
                    }}
                  />
                </div>

                <FormGroup>
                  {selectedPlayer?.eventsDay?.length > 0 &&
                    selectedPlayer?.eventsDay?.map((playerEvent, i) => {
                      const playerInfoEvent = selectedPlayer?.events?.find(
                        (e) => e.e === playerEvent.event
                      );

                      return (
                        <>
                          <FormControlLabel
                            className="pl-2"
                            key={i}
                            required={playerEvent?.asistencia === "S"}
                            disabled={
                              playerEvent?.asistencia === "N" ||
                              selectedPlayer?.llenado === 1
                            }
                            checked={playerInfoEvent?.a === "S"}
                            control={<Switch />}
                            label={`${playerEvent?.event} (${playerEvent?.horario})`}
                            onChange={(event: any) => {
                              handleChangeForm(
                                "events",
                                playerEvent.event,
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
            <Button
              variant="contained"
              className="text-zinc-100"
              disabled={selectedPlayer?.llenado === 1 || !selectedPlayer?.label}
              onClick={handleSubmit}
            >
              {selectedPlayer?.llenado === 1
                ? "Assistencia Enviada"
                : "Enviar Asistencia"}
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  );
}
