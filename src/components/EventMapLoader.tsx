"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at module-load time, which crashes during
// server-side rendering even inside a "use client" component (Next.js still
// renders client components on the server for the initial HTML). Disabling
// SSR for this import is only allowed from within a client component, hence
// this thin wrapper.
const EventMap = dynamic(
  () => import("@/components/EventMap").then((mod) => mod.EventMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-lg bg-muted animate-pulse" />
    ),
  }
);

export { EventMap as EventMapLoader };
