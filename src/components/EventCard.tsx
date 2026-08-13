import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventListItem, Sport } from "@/types";

const SPORT_LABELS: Record<Sport, string> = {
  bike: "Bike",
  motorcycle: "Motorcycle",
  run: "Run",
};

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event }: { event: EventListItem }) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{SPORT_LABELS[event.sport]}</Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(event.date)}
            </span>
          </div>
          <CardTitle className="text-lg mt-1">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>📍 {event.meeting_point}</p>
          <p>⚡ {event.pace}</p>
          {event.max_participants && (
            <p>👥 Max {event.max_participants} participants</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
