import Link from "next/link";
import { EventsExplorer } from "@/components/EventsExplorer";
import { Button } from "@/components/ui/button";
import type { EventListItem, Sport } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getEvents(sport?: string): Promise<EventListItem[]> {
  const url = new URL(`${API_URL}/api/events`);
  if (sport) url.searchParams.set("sport", sport);
  // no-store: always fetch fresh data, never use Next.js's cache
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export default async function Home({
  searchParams,
}: {
  // In Next.js 15+, searchParams is a Promise — must be awaited
  searchParams: Promise<{ sport?: string }>;
}) {
  const { sport } = await searchParams;
  const events = await getEvents(sport);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-4">
        <h1 className="text-3xl font-bold">Göle</h1>
        <Button render={<Link href="/events/new" />} nativeButton={false}>+ New event</Button>
      </header>

      {/* The map fills the rest of the viewport (Komoot-style); the event
          list, filter, and selected event's details all live in floating
          panels over it instead of separate pages/views. */}
      <EventsExplorer sport={sport as Sport | undefined} events={events} />
    </div>
  );
}
