import { Icon } from "@iconify-icon/react";
import { Navigation } from "../components/nav";
import { motion } from "framer-motion";
import getSheetData from "../../lib/getSheetData";
import { PlayerCard } from "../components/playerCard";
import { Redis } from "@upstash/redis";
import { EventCard } from "../components/event-card";

const redis = Redis.fromEnv();

export default async function FreedomRoo() {
  const playerList = await getSheetData();
  console.log(playerList);

  const events = await redis.get("freedomroo:events");
  const eventsDetails = await redis.get("freedomroo:eventsdetails");

  //   console.log(events);
  //   console.log(eventsDetails);

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Freedom - ROO LNA
          </h2>
          <p className="mt-4 text-zinc-400">
            Calendario de Eventos y Asistencia
          </p>
        </div>
        {/* <div className="w-full h-px bg-zinc-800" /> */}
        <div className="grid grid-cols-1 gap-2 mx-auto"></div>

        <EventCard events={events} eventsDetails={eventsDetails} />

        <div className="grid grid-cols-1 gap-8 mx-auto">
          <PlayerCard
            players={playerList}
            events={events}
            eventsDetails={eventsDetails}
          />
        </div>
        <div className="hidden w-full h-px md:block bg-zinc-800" />
      </div>
    </div>
  );
}
