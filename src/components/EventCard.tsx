import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SPORT_LABELS, type EventListItem } from "@/types";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({
  event,
  selected,
  onClick,
}: {
  event: EventListItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md border p-2 text-left text-sm transition-colors hover:bg-muted",
        selected ? "border-primary bg-muted" : "border-border"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium">{event.title}</span>
        <Badge variant="secondary" className="shrink-0">
          {SPORT_LABELS[event.sport]}
        </Badge>
      </div>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">
        {formatDate(event.date)} · {event.meeting_point}
      </p>
    </button>
  );
}
