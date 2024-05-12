"use client";

import {
  Autocomplete,
  Box,
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
import { useEffect } from "react";
import { useState } from "react";

export function PlayerCard(props: any) {
  const { player, players, events, eventsDetails } = props;
  const currentDay = format(new Date(), "EEEE");
  const eventsDay = [...events].filter((e) => e.day === currentDay);
  const playerData = players?.find((p: any) => p.label === player) || {
    events: [],
  };
  const eventList = [...eventsDetails]
    .filter((ed) => eventsDay[0]?.events?.indexOf(ed.event) >= 0)
    ?.filter((ewa) => ewa.asistencia === "S");

  const eventsFiltered = [...playerData?.events].filter((el) => {
    return eventList.some((f) => {
      return f.event === el.e;
    });
  });

  const playerInfo = {
    ...playerData,
    eventsDay: eventList || [],
    events: eventsFiltered || [],
    comentario: "",
  };

  const eventsWithAssist = eventList
    .map((event) => (event.asistencia === "S" ? 1 : 0))
    .reduce((acc, cur): any => acc + cur, 0);
  const [sending, setSending] = useState<boolean>(false);
  const [formData, setFormData] = useState([{ ...playerInfo }]);
  const [selectedPlayer, setSelectedPlayer] = useState({ ...playerInfo });

  useEffect(() => {
    setFormData([{ ...playerInfo }]);
    setSelectedPlayer({ ...playerInfo });
  }, [player]);

  const handleChangeForm = (input: String, value: String, checked: Boolean) => {
    let newFormData = {};
    let newData;
    const checkedChar = checked ? "S" : "N";
    const data = formData?.find((fd) => fd.label === player);

    if (input === "events") {
      const newEvents = [];

      const check = data.events?.findIndex((e: any) => e.e === value);

      if (check < 0) {
        newEvents.push({ e: value, a: checkedChar });
        newData = newEvents;
      } else {
        const newObject = { e: value, a: checkedChar };
        newData = data.events.map((obj: any) =>
          obj.e === value ? newObject : obj
        );
      }

      newFormData = { ...data, events: newData };
    }

    const newState = [...formData].map((data) =>
      data.label === player ? newFormData : data
    );

    setFormData(newState);
    setSelectedPlayer({
      ...newState.find((p) => p.label === player),
    });
  };

  const handleSubmit = async () => {
    if (!selectedPlayer) return;

    setSending(true);
    const newDataEvents: string[] = [];
    const today = format(new Date(), "dd/MM/yyyy");

    selectedPlayer?.events?.forEach((event: any) => {
      const newEvent: string[] = [
        selectedPlayer.label.toString(),
        event.e.toString(),
        event.a.toString(),
        today,
        selectedPlayer?.comentario,
      ];
      newDataEvents.push(newEvent as never);
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

    setSelectedPlayer({ ...selectedPlayer, llenado: 1 });

    setSending(false);
  };

  return (
    <>
      <Divider textAlign="left" className="mb-4">
        ASISTENCIA
      </Divider>
      <div className="preview flex w-full justify-left items-center">
        {eventsWithAssist > 0 ? (
          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm w-[350px]">
            <CardContent>
              {selectedPlayer?.llenado === 0 && (
                <form className="space-y-4  mt-4">
                  <div className="grid w-full items-center gap-4">
                    <Typography
                      variant="body2"
                      className="mb-1"
                      color="text.secondary"
                    >
                      Para poder poner tu asistencia, favor seleccionar jugador
                      y los eventos que participaras.
                    </Typography>
                    <div className="flex flex-col ">
                      <Autocomplete
                        disablePortal
                        id="player-list"
                        options={formData}
                        // defaultValue={}
                        sx={{ width: 300 }}
                        value={player ?? ""}
                        renderInput={(params) => (
                          <TextField {...params} label="Jugador" />
                        )}
                        // onInputChange={(event, newInputValue: String) => {}}
                      />
                    </div>

                    <FormGroup>
                      {selectedPlayer?.eventsDay?.length > 0 &&
                        selectedPlayer?.eventsDay?.map(
                          (playerEvent: any, i: any) => {
                            const playerInfoEvent =
                              selectedPlayer?.events?.find(
                                (e: any) => e.e === playerEvent.event
                              );

                            return (
                              <>
                                <FormControlLabel
                                  className="pl-2"
                                  key={`${i}-${selectedPlayer?.label}`}
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
                          }
                        )}
                    </FormGroup>

                    <TextField
                      id="comentario-multiline"
                      label="Comentario"
                      multiline
                      maxRows={4}
                      variant="outlined"
                      onChange={(event: any) => {
                        setSelectedPlayer((prevState: any) => ({
                          ...prevState,
                          comentario: event.target.value,
                        }));
                      }}
                    />
                  </div>
                </form>
              )}
              {selectedPlayer?.llenado === 1 && (
                <Box>
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ color: "#3cff3cc7", mt: "8px", fontWeight: "400" }}
                  >
                    Tu asistencia fue REGISTRADA.
                  </Typography>
                </Box>
              )}
            </CardContent>
            <CardActions className="flex justify-center p-2">
              {!selectedPlayer?.llenado && (
                <Button
                  variant="contained"
                  className="text-zinc-100"
                  disabled={
                    selectedPlayer?.llenado === 1 ||
                    !selectedPlayer?.label ||
                    (sending as never)
                  }
                  onClick={handleSubmit}
                >
                  {selectedPlayer?.llenado === 1
                    ? "Assistencia Enviada"
                    : sending
                    ? "Enviando..."
                    : "Enviar Asistencia"}
                </Button>
              )}
            </CardActions>
          </Card>
        ) : (
          <Typography>
            No hay eventos que requieran ASISTENCIA el día de hoy.
          </Typography>
        )}
      </div>
    </>
  );
}
