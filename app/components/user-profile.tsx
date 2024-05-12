"use client";

import { Icon } from "@iconify-icon/react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const idiomas = [
  {
    label: "Español",
  },
  {
    label: "English",
  },
  {
    label: "Portugues",
  },
];

const jobs = [
  { label: "AssaCross" },
  { label: "Champ" },
  { label: "HP (DPS)" },
  { label: "HP (Support)" },
  { label: "HW" },
  { label: "LK (DPS)" },
  { label: "LK (Tank)" },
  { label: "Sniper" },
  { label: "WS" },
];

const toastStyle = {
  error: {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  },
  success: {
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  },
};

const playerDefault = {
  username: "",
  whatsapp: "",
  discord: "",
  idioma: "",
  job: "",
  horario: { desde: "00:00", hasta: "23:30" },
  players: [],
};

function getTimes(start: string, end: string) {
  // Convert to number of half-hours
  //@ts-ignore
  start = parseInt(start) * 2 + (+start.slice(-2) > 0);
  //@ts-ignore
  end = parseInt(end) * 2 + (+end.slice(-2) > 0) + 1;
  // Produce series
  //@ts-ignore
  return Array.from({ length: end - start }, (_, i) =>
    //@ts-ignore
    (((i + start) >> 1) + ":" + ((i + start) % 2) * 3 + "0").replace(
      /^\d:/,
      "0$&"
    )
  )?.map((time) => ({ label: time }));
}

export default function UserProfile(props: any) {
  const { player, players } = props;

  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>({
    ...playerDefault,
    player: player,
  });
  const playerId = players?.find((p: any) => p.label === player)?.playerId;

  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    const fetchingData = async () => {
      await fetch("/api/get-user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userCell: playerId }),
      })
        .then((res) => res.json())
        .then((resData) => {
          if (resData) {
            setUserData({ ...resData?.data });
          }
        });

      setLoading(false);
    };
    fetchingData();
  }, [player]);

  const handleUserUpdate = async () => {
    if (!userData) return;

    setSending(true);
    const today = format(new Date(), "dd/MM/yyyy HH:MM:ss");

    const dataToSend = {
      tableReference: playerId,
      data: [
        [
          userData.whatsapp,
          userData.discord,
          userData.idioma,
          userData.job,
          userData.horario.desde,
          userData.horario.hasta,
          userData?.players?.map((p: any) => p.label).join(","),
          today,
        ],
      ],
    };

    await fetch("/api/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    setSending(false);
    setShowInputs(!showInputs);
    return toast.success("Information updated!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <>
      {player && (
        <>
          <Divider textAlign="left">DATOS GENERALES</Divider>
          {loading ? (
            <CircularProgress />
          ) : (
            <Box
              sx={{
                mt: "-16px",
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
            >
              {showInputs ? (
                <Box sx={{ m: "8px" }}>
                  <Button disabled color="warning" variant="contained">
                    Editing profile...
                  </Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    disabled={sending}
                    sx={{ ml: "8px", my: "8px" }}
                    onClick={handleUserUpdate}
                  >
                    {sending ? "Saving..." : "SAVE"}
                  </Button>
                  {!sending && (
                    <Button
                      color="error"
                      variant="outlined"
                      disabled={sending}
                      sx={{ ml: "8px", my: "8px" }}
                      onClick={() => setShowInputs(!showInputs)}
                    >
                      CANCEL
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ m: "8px" }}>
                  <Button
                    color="warning"
                    variant="outlined"
                    onClick={() => setShowInputs(!showInputs)}
                  >
                    EDIT
                  </Button>
                </Box>
              )}
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <TextField
                  label="WhatsApp"
                  id="up-whatsapp"
                  size="small"
                  disabled={!showInputs}
                  value={userData?.whatsapp}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="logos:whatsapp-icon" />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e: any) => {
                    if (e.target.value?.length > 16) {
                      return toast.error(
                        "Max length reached for Whastapp.",
                        toastStyle.error
                      );
                    }

                    setUserData((prev: any) => ({
                      ...prev,
                      whatsapp: e.target.value,
                    }));
                  }}
                />
                <TextField
                  label="Discord"
                  id="up-discord"
                  size="small"
                  disabled={!showInputs}
                  value={userData?.discord}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon="logos:discord-icon" />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e: any) => {
                    if (e.target.value?.length > 15) {
                      return toast.error(
                        "Max length reached for Discord.",
                        toastStyle.error
                      );
                    }

                    setUserData((prev: any) => ({
                      ...prev,
                      discord: e.target.value,
                    }));
                  }}
                />
                <TextField
                  label="Idioma"
                  id="up-idioma"
                  size="small"
                  value={userData?.idioma}
                  disabled={!showInputs}
                  select
                  onChange={(e: any) => {
                    setUserData((prev: any) => ({
                      ...prev,
                      idioma: e.target.value,
                    }));
                  }}
                >
                  {idiomas.map((option: any) => (
                    <MenuItem key={option.label} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Job Actual"
                  id="up-job-actual"
                  size="small"
                  select
                  value={userData?.job}
                  disabled={!showInputs}
                  onChange={(e: any) => {
                    setUserData((prev: any) => ({
                      ...prev,
                      job: e.target.value,
                    }));
                  }}
                >
                  {jobs.map((option: any) => (
                    <MenuItem key={option.label} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <Box
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "10ch" },
                    maxWidth: "28ch",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                      border: "solid 1px #37373a",
                      borderRadius: "4px",
                      p: "8px",
                      m: "8px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align="left"
                      sx={{ ml: "8px" }}
                    >
                      Horario Actividades
                    </Typography>
                    <Box>
                      <TextField
                        label="desde"
                        id="up-horario-desde"
                        size="small"
                        value={userData?.horario?.desde}
                        disabled={!showInputs}
                        select
                        onChange={(e: any) => {
                          setUserData((prev: any) => ({
                            ...prev,
                            horario: {
                              ...userData?.horario,
                              desde: e.target.value,
                            },
                          }));
                        }}
                      >
                        {[...getTimes("00:00", "23:30")].map((option: any) => (
                          <MenuItem key={option.label} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        label="hasta"
                        id="up-horario-hasta"
                        value={userData?.horario?.hasta}
                        size="small"
                        disabled={!showInputs}
                        select
                        onChange={(e: any) => {
                          setUserData((prev: any) => ({
                            ...prev,
                            horario: {
                              ...userData?.horario,
                              hasta: e.target.value,
                            },
                          }));
                        }}
                      >
                        {[...getTimes("00:00", "23:30")].map((option: any) => (
                          <MenuItem key={option.label} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Box>
                </Box>

                <Autocomplete
                  multiple
                  id="party-players"
                  options={players}
                  size="small"
                  getOptionLabel={(option: any) => option.label}
                  value={userData?.players ?? []}
                  disabled={!showInputs}
                  onChange={(e, values) => {
                    if (values.length > 5) {
                      return toast.error(
                        "Max friends reached.",
                        toastStyle.error
                      );
                    }
                    setUserData((prev: any) => ({
                      ...prev,
                      players: values,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Party Friends (5 MAX)"
                      placeholder="players"
                    />
                  )}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}
