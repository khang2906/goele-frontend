"use client";

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
  collapsed,
  onToggleCollapse,
}: {
  sport: Sport | undefined;
  events: EventListItem[];
  selectedEventId: number | null;
  onSelectEvent: (id: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    // A single flex row for the panel + its toggle button, instead of
    // positioning the button with a hardcoded "left" offset matching the
    // panel's width — that broke on narrow screens where the panel's width
    // itself has to shrink to fit. This way the button just sits right after
    // the panel in normal flow and slides with it for free.
    <div className="absolute top-4 bottom-4 left-4 z-10 flex items-start">
      {/* Floats over the map (Komoot-style) rather than sitting in normal
          document flow. Collapsing animates width to 0 instead of
          unmounting, so the toggle button stays in place and just slides. */}
      <div
        className={cn(
          "flex h-full max-w-[calc(100vw-4rem)] flex-col overflow-hidden rounded-lg border border-border bg-background/95 shadow-md backdrop-blur transition-[width] duration-200",
          collapsed ? "w-0 border-0 bg-transparent shadow-none" : "w-72 sm:w-80"
        )}
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
        onClick={onToggleCollapse}
        className="mt-2 ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-md"
        aria-label={collapsed ? "Show events list" : "Hide events list"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
}
