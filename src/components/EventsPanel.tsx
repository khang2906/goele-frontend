"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { SportFilterSelect } from "@/components/SportFilterSelect";
import { groupByDay } from "@/lib/groupByDay";
import { cn } from "@/lib/utils";
import type { EventListItem, Sport } from "@/types";

export function EventsPanel({
  sport,
  events,
  selectedEventId,
  onSelectEvent,
  collapsed,
  onToggleCollapse,
  filteredByViewport,
}: {
  sport: Sport | undefined;
  events: EventListItem[];
  selectedEventId: number | null;
  onSelectEvent: (id: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  filteredByViewport: boolean;
}) {
  const groups = groupByDay(events);
  return (
    // A single flex row for the panel + its toggle button, instead of
    // positioning the button with a hardcoded "left" offset matching the
    // panel's width — that broke on narrow screens where the panel's width
    // itself has to shrink to fit. This way the button just sits right after
    // the panel in normal flow and slides with it for free.
    //
    // No absolute positioning of its own any more: this is a child of the
    // flex row in EventsExplorer, which places it next to the detail panel.
    // pointer-events-auto re-enables clicks that the row disables (the row
    // spans the whole map, so it has to let clicks through by default).
    <div className="pointer-events-auto flex h-full items-start">
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

        <div className="flex-1 overflow-y-auto p-2">
          {events.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              {/* Two different problems, two different messages: an empty area is
                  fixed by moving the map, an empty database isn't. */}
              {filteredByViewport
                ? "No events in this area. Try zooming out or panning the map."
                : "No upcoming events."}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.key}>
                {/* sticky so the day stays visible while scrolling its events */}
                <h3 className="sticky top-0 z-10 bg-background/95 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
                  {group.label}
                </h3>
                <div className="space-y-2 pb-2">
                  {group.events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      selected={event.id === selectedEventId}
                      onClick={() => onSelectEvent(event.id)}
                    />
                  ))}
                </div>
              </div>
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
