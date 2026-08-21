"use client";

import dynamic from "next/dynamic";

// Same reasoning as EventMapLoader.tsx: Leaflet touches `window` at module-load
// time, which crashes during the server-side render Next.js still does for
// "use client" components. ssr: false is only callable from within a client
// component, hence this thin wrapper.
const LocationPicker = dynamic(
  () => import("@/components/LocationPicker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-8 w-full rounded-lg bg-muted animate-pulse" />
    ),
  }
);

export { LocationPicker as LocationPickerLoader };
