"use client";

import { useState } from "react";

import { EventDetailPanel } from "@/components/EventDetailPanel";
import { EventsMapLoader } from "@/components/EventsMapLoader";
import { EventsPanel } from "@/components/EventsPanel";
import type { EventListItem, Sport } from "@/types";

// Owns the one piece of state the map, list, and detail panel all need to
// share: which event is selected. Has to live in a Client Component since
// page.tsx (the data-fetching Server Component) can't hold state itself.
export function EventsExplorer({
  sport,
  events,
}: {
  sport: Sport | undefined;
  events: EventListItem[];
}) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  return (
    <div className="relative flex-1">
      {/* absolute + inset-0 anchors directly to this "relative" parent's
          box — h-full/w-full percentages didn't reliably propagate through
          the flex-1 chain above (see EventsMap sizing fix history). */}
      <div className="absolute inset-0">
        <EventsMapLoader
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
        />
      </div>

      <EventsPanel
        sport={sport}
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
      />

      {selectedEventId != null && (
        <EventDetailPanel eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />
      )}
    </div>
  );
}
