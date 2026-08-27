"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet";

import { markerIcon } from "@/lib/leaflet-icon";
import type { EventListItem } from "@/types";

const MUNICH: [number, number] = [48.1374, 11.5755];
const SELECTED_ZOOM = 15;
const USER_LOCATION_ZOOM = 12;

// Browser geolocation resolves async (and needs a permission prompt), so the
// map always paints its Munich/bounds-fit fallback first, then recenters
// once (or never, if it's denied/unsupported) — see FlyToUserLocation below.
function useUserLocation(): [number, number] | null {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation([position.coords.latitude, position.coords.longitude]),
      () => {} // denied or failed — silently keep the fallback view
    );
  }, []);

  return location;
}

// Leaflet measures its container's size once, synchronously, on init — and
// under next/dynamic's ssr:false loading there's a timing race where that
// measurement can happen before layout has fully settled (most likely on a
// cold load, before the Leaflet JS chunk is cached), leaving the map stuck
// narrower than its actual container. invalidateSize() re-measures and fixes it.
function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Recenters on the user's location the first time it resolves — but not if
// they've already selected an event by then, so a fast click right after
// page load doesn't get yanked back to "near me".
function FlyToUserLocation({
  location,
  hasSelection,
}: {
  location: [number, number] | null;
  hasSelection: boolean;
}) {
  const map = useMap();
  const hasFlown = useRef(false);

  useEffect(() => {
    if (location && !hasFlown.current && !hasSelection) {
      hasFlown.current = true;
      map.setView(location, USER_LOCATION_ZOOM);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return null;
}

// Flies to the selected event's marker. Only reacts to selectedEventId
// changing (not to `located` — that would re-trigger on every unrelated
// re-render) so it doesn't fight the initial bounds-fit on load.
function FlyToSelected({
  selectedEvent,
}: {
  selectedEvent: (EventListItem & { lat: number; lng: number }) | undefined;
}) {
  const map = useMap();
  useEffect(() => {
    if (selectedEvent) {
      map.flyTo([selectedEvent.lat, selectedEvent.lng], SELECTED_ZOOM);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent?.id]);
  return null;
}

export function EventsMap({
  events,
  selectedEventId,
  onSelectEvent,
}: {
  events: EventListItem[];
  selectedEventId: number | null;
  onSelectEvent: (id: number) => void;
}) {
  // Events created before coordinates became mandatory can still have nulls —
  // this type guard both filters them out and tells TypeScript that everything
  // left over really does have real numbers, not `number | null`.
  const located = events.filter(
    (event): event is EventListItem & { lat: number; lng: number } =>
      event.lat != null && event.lng != null
  );

  const points: [number, number][] = located.map((event) => [event.lat, event.lng]);
  const selectedEvent = located.find((event) => event.id === selectedEventId);
  const userLocation = useUserLocation();

  return (
    <MapContainer
      {...(points.length > 0
        ? { bounds: points, boundsOptions: { padding: [24, 24] as [number, number] } }
        : { center: MUNICH, zoom: 12 })}
      // Fills its parent's full-bleed flex-1 area edge-to-edge — no fixed height
      // or rounded corners here, unlike the small inline maps elsewhere in the app.
      className="h-full w-full isolate"
      // Default top-left zoom control sits under the floating sport
      // filter/view toggle bar (also top-left) — move it out of the way.
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <MapResizeFix />
      <FlyToUserLocation location={userLocation} hasSelection={selectedEventId != null} />
      <FlyToSelected selectedEvent={selectedEvent} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {located.map((event) => (
        <Marker
          key={event.id}
          position={[event.lat, event.lng]}
          icon={markerIcon}
          eventHandlers={{ click: () => onSelectEvent(event.id) }}
        />
      ))}
    </MapContainer>
  );
}
