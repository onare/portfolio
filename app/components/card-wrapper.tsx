"use client";

import { useEffect, useState } from "react";
import { EventCard } from "./event-card";
import { PlayerCard } from "./player-card";
import { UserLogin } from "./user-login-";

export default function CardWrapper(props: any) {
  const { players, events, eventsDetails } = props;
  const [player, setPlayer] = useState<any>({});

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
  }, []);

  return (
    <>
      <UserLogin
        players={players}
        events={events}
        eventsDetails={eventsDetails}
      />
    </>
  );
}
