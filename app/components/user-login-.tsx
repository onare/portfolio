"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { EventCard } from "./event-card";
import { PlayerCard } from "./player-card";

export function UserLogin(props: any) {
  const { players, events, eventsDetails } = props;
  const [username, setUsername] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let saved: string = "";

    if (typeof window !== "undefined") {
      // Perform localStorage action
      saved = (localStorage.getItem("freedomUser") as never) || "";
    }

    setUsername(saved);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const email: string = userEmail;

    if (
      !email ||
      !email?.includes("@") ||
      email?.length < 5 ||
      email?.length > 100
    ) {
      return toast.error("Invalidad email!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }

    const checkIfExist = players.find((player: any) => player.email === email);
    if (checkIfExist) {
      localStorage.setItem("freedomUser", checkIfExist?.label);
      setUsername(checkIfExist?.label);
      return toast.success("User found, welcome to FreedomRoo.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      return toast.error("You're not part of Freedom Guild.", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const handleChangeUser = () => {
    setShowInput(true);
    setUsername("");
  };

  return (
    <>
      {loading ? (
        <Box sx={{ my: "8px" }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <>
          <div className="flex w-full justify-left items-center ">
            {!username && !showInput && (
              <Button variant="outlined" onClick={() => setShowInput(true)}>
                Login with mail
              </Button>
            )}
            {username && (
              <>
                <Typography className="text-zinc-100" variant="h6">
                  Welcome, {username}
                </Typography>
                <Button
                  size="medium"
                  variant="text"
                  sx={{ ml: "8px" }}
                  onClick={handleChangeUser}
                  color="warning"
                >
                  CHANGE USER
                </Button>
              </>
            )}
            {!username && showInput && (
              <>
                <Box sx={{ alignItems: "center" }}>
                  <TextField
                    size="small"
                    id="username"
                    label="Email"
                    variant="outlined"
                    type="email"
                    onChange={(e: any) => setUserEmail(e.target.value)}
                  />
                  <Button
                    size="medium"
                    variant="text"
                    sx={{ ml: "8px" }}
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </Box>
              </>
            )}
          </div>
          <EventCard
            player={username}
            players={players}
            events={events}
            eventsDetails={eventsDetails}
          />

          <div className="grid grid-cols-1 gap-8 mx-auto">
            <PlayerCard
              player={username}
              players={players}
              events={events}
              eventsDetails={eventsDetails}
            />
          </div>
        </>
      )}
    </>
  );
}
