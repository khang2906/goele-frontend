import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventListItem, Sport } from "@/types";

const SPORT_FILTERS: { value: Sport | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "bike", label: "Bike" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "run", label: "Run" },
];

async function getEvents(sport?: string): Promise<EventListItem[]> {
  const url = new URL("http://localhost:8000/api/events");
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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Göle</h1>
        <Button render={<Link href="/events/new" />} nativeButton={false}>+ New event</Button>
      </div>

      <div className="flex gap-2 mb-6">
        {SPORT_FILTERS.map(({ value, label }) => (
          <Link
            key={label}
            href={value ? `/?sport=${value}` : "/"}
            className={cn(
              "px-3 py-1 rounded-full text-sm border transition-colors",
              sport === value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground">No upcoming events.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
