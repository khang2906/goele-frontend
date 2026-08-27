"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { SportFilterSelect } from "@/components/SportFilterSelect";
import { cn } from "@/lib/utils";
import type { EventListItem, Sport } from "@/types";

export function EventsPanel({
  sport,
  events,
  selectedEventId,
  onSelectEvent,
}: {
  sport: Sport | undefined;
  events: EventListItem[];
  selectedEventId: number | null;
  onSelectEvent: (id: number) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Floats over the map (Komoot-style) rather than sitting in normal
          document flow — top-4/bottom-4 so it never touches the viewport
          edges. Collapsing animates width to 0 instead of unmounting, so the
          toggle button below can slide smoothly alongside it. */}
      <div
        className={cn(
          "absolute top-4 bottom-4 left-4 z-10 flex flex-col overflow-hidden rounded-lg border border-border bg-background/95 shadow-md backdrop-blur transition-[width] duration-200",
          collapsed && "w-0 border-0 bg-transparent shadow-none"
        )}
        style={{ width: collapsed ? 0 : "20rem" }}
      >
        <div className="flex items-center gap-2 border-b border-border p-3">
          <h2 className="flex-1 font-semibold">Events</h2>
          <SportFilterSelect sport={sport} />
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-2">
          {events.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No upcoming events.</p>
          ) : (
            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                selected={event.id === selectedEventId}
                onClick={() => onSelectEvent(event.id)}
              />
            ))
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="absolute top-6 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-md transition-[left] duration-200"
        style={{ left: collapsed ? "1rem" : "21rem" }}
        aria-label={collapsed ? "Show events list" : "Hide events list"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </>
  );
}
