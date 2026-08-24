"use client";

import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { markerIcon } from "@/lib/leaflet-icon";
import { SPORT_LABELS, type EventListItem } from "@/types";

const MUNICH: [number, number] = [48.1374, 11.5755];

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventsMap({ events }: { events: EventListItem[] }) {
  // Events created before coordinates became mandatory can still have nulls —
  // this type guard both filters them out and tells TypeScript that everything
  // left over really does have real numbers, not `number | null`.
  const located = events.filter(
    (event): event is EventListItem & { lat: number; lng: number } =>
      event.lat != null && event.lng != null
  );

  const points: [number, number][] = located.map((event) => [event.lat, event.lng]);

  return (
    <MapContainer
      {...(points.length > 0
        ? { bounds: points, boundsOptions: { padding: [24, 24] as [number, number] } }
        : { center: MUNICH, zoom: 12 })}
      className="h-[28rem] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {located.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]} icon={markerIcon}>
          <Popup>
            <div className="space-y-1">
              <p className="font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {SPORT_LABELS[event.sport]} · {formatDate(event.date)}
              </p>
              <Link href={`/events/${event.id}`} className="text-xs text-primary hover:underline">
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
