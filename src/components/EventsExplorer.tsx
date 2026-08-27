"use client";

import { useState } from "react";

import { EventDetailPanel } from "@/components/EventDetailPanel";
import { EventsMapLoader } from "@/components/EventsMapLoader";
import { EventsPanel } from "@/components/EventsPanel";
import { MobileEventsSheet, type SheetSnap } from "@/components/MobileEventsSheet";
import type { EventListItem, Sport } from "@/types";

// Owns the state the map, list panel, and detail panel all need to share:
// which event is selected, and how open the list is. Has to live in a
// Client Component since page.tsx (the data-fetching Server Component)
// can't hold state itself.
//
// Below the `md` breakpoint, EventsPanel (the desktop left floating panel)
// is swapped for MobileEventsSheet (a draggable bottom sheet) — a phone
// screen doesn't have room for a side panel. Both are always mounted with
// Tailwind's `hidden`/`md:hidden` controlling which one shows, rather than
// a JS media query, so there's no SSR/client mismatch on first paint.
export function EventsExplorer({
  sport,
  events,
}: {
  sport: Sport | undefined;
  events: EventListItem[];
}) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [listCollapsed, setListCollapsed] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("half");

  function selectEvent(id: number) {
    setSelectedEventId(id);
    // Give the detail panel room instead of stacking both panels — there
    // isn't space for both on a phone, and on desktop it avoids two
    // overlapping floating panels either way.
    setListCollapsed(true);
    setSheetSnap("collapsed");
  }

  function closeDetail() {
    setSelectedEventId(null);
    setListCollapsed(false);
    setSheetSnap("half");
  }

  return (
    <div className="relative flex-1">
      {/* absolute + inset-0 anchors directly to this "relative" parent's
          box — h-full/w-full percentages didn't reliably propagate through
          the flex-1 chain above (see EventsMap sizing fix history). */}
      <div className="absolute inset-0">
        <EventsMapLoader
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={selectEvent}
        />
      </div>

      <div className="hidden md:contents">
        <EventsPanel
          sport={sport}
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={selectEvent}
          collapsed={listCollapsed}
          onToggleCollapse={() => setListCollapsed((value) => !value)}
        />
      </div>

      <div className="md:hidden">
        <MobileEventsSheet
          sport={sport}
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={selectEvent}
          snap={sheetSnap}
          onSnapChange={setSheetSnap}
        />
      </div>

      {selectedEventId != null && (
        <EventDetailPanel eventId={selectedEventId} onClose={closeDetail} />
      )}
    </div>
  );
}
