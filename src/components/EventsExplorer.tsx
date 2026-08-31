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
    // Only the phone sheet gets collapsed. On desktop the detail panel now sits
    // beside the list rather than on top of it, so the list stays open — that's
    // the point of the side-by-side layout: pick one event, then the next,
    // without reopening the list each time.
    setSheetSnap("collapsed");
  }

  function closeDetail() {
    setSelectedEventId(null);
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

      {/* One flex row holding the list and the detail panel side by side, so
          adjacency comes from flex rather than a hardcoded left offset on the
          detail panel (which would break whenever the list's width changes or
          it collapses). The row spans the whole map area, so it must be
          pointer-events-none or it would swallow every click on the map;
          each panel turns pointer events back on for itself. */}
      <div className="pointer-events-none absolute inset-4 z-20 flex items-start gap-2">
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

        {selectedEventId != null && (
          <EventDetailPanel eventId={selectedEventId} onClose={closeDetail} />
        )}
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
    </div>
  );
}
