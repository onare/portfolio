import { Navigation } from "../components/nav";
import getSheetData from "../../lib/getSheetData";
import { PlayerCard } from "../components/player-card";
import { Redis } from "@upstash/redis";
import { EventCard } from "../components/event-card";
import { format } from "date-fns";
import { UserLogin } from "../components/user-login-";

const redis = Redis.fromEnv();

export default async function FreedomRoo() {
  const playerList = await getSheetData();
  const today = format(new Date(), "EEEE do, yyyy");

  const events = await redis.get("freedomroo:events");
  const eventsDetails = await redis.get("freedomroo:eventsdetails");

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Freedom - ROO LNA
          </h2>
          <p className="mt-3 text-xl text-zinc-200">{today}</p>
          <p className="mt-1 text-zinc-400">
            Calendario de Eventos y Asistencia
          </p>
          <UserLogin players={playerList} />
        </div>

        <EventCard
          players={playerList}
          events={events}
          eventsDetails={eventsDetails}
        />

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
