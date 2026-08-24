"use client";

import dynamic from "next/dynamic";

// Same reasoning as EventMapLoader.tsx / LocationPickerLoader.tsx: Leaflet
// touches `window` at module-load time, which crashes during the server-side
// render Next.js still does for "use client" components.
const EventsMap = dynamic(
  () => import("@/components/EventsMap").then((mod) => mod.EventsMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[28rem] w-full rounded-lg bg-muted animate-pulse" />
    ),
  }
);

export { EventsMap as EventsMapLoader };
