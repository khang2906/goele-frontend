"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LocationPickerLoader } from "@/components/LocationPickerLoader";
import type { Sport } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Shared with Input's own styling so the plain <select>/<textarea> (no shadcn
// wrapper exists for these yet) still look like they belong to the same form.
const fieldClassName =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";

const SPORTS: { value: Sport; label: string }[] = [
  { value: "bike", label: "Bike" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "run", label: "Run" },
];

// Pace means a different thing per sport, so the input adapts rather than
// asking for free text and hoping. `pace` is still stored as a plain string —
// the unit is appended on submit, which is what keeps stored values looking
// consistent ("25 km/h", never "25" or "25kmh" or "twenty-five").
// A structured pace column would allow filtering later; deliberately not now.
const PACE_FIELD: Record<Sport, { placeholder: string; unit: string | null; hint: string }> = {
  bike: { placeholder: "25", unit: "km/h", hint: "Average speed you plan to ride." },
  motorcycle: {
    placeholder: "relaxed touring",
    unit: null,
    hint: "A word or two — relaxed, sporty, twisty roads.",
  },
  run: { placeholder: "5:30", unit: "min/km", hint: "Pace per kilometer." },
};

export default function NewEventPage() {
  const router = useRouter();

  const [sport, setSport] = useState<Sport>("bike");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [pace, setPace] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [routeLink, setRouteLink] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // lat/lng only get set once the user picks a Nominatim suggestion or clicks
    // the map (see LocationPicker) — typing free text alone isn't enough, since
    // the backend requires a real pin for every new event.
    if (lat == null || lng == null) {
      setError("Please pick a location: search for a place or click the map.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          title,
          date,
          meeting_point: meetingPoint,
          // Store the unit with the value — the list and detail views render
          // pace as-is, so it has to be self-describing.
          pace: PACE_FIELD[sport].unit
            ? `${pace.trim()} ${PACE_FIELD[sport].unit}`
            : pace.trim(),
          max_participants: maxParticipants ? Number(maxParticipants) : null,
          route_link: routeLink || null,
          description: description || null,
          lat,
          lng,
        }),
      });
      if (!res.ok) throw new Error("Failed to create event");

      const event = await res.json();
      router.push(`/events/${event.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← Back to events
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-6">Create a new event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sport</label>
          <select
            value={sport}
            onChange={(e) => {
              setSport(e.target.value as Sport);
              // Units differ per sport — keeping the old number would silently
              // reinterpret it (a 5:30 run pace becoming 5:30 km/h).
              setPace("");
            }}
            className={fieldClassName}
            required
          >
            {SPORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date and time</label>
          <Input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Meeting point <span className="text-muted-foreground">(search or click the map to set a pin — required)</span>
          </label>
          <LocationPickerLoader
            meetingPoint={meetingPoint}
            onMeetingPointChange={setMeetingPoint}
            lat={lat}
            lng={lng}
            onPositionChange={(newLat, newLng) => {
              setLat(newLat);
              setLng(newLng);
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pace</label>
          {/* relative + absolute so the unit sits inside the field's border,
              reading as part of the value rather than as a separate control. */}
          <div className="relative">
            <Input
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              placeholder={PACE_FIELD[sport].placeholder}
              // Room for the unit label so long values don't run underneath it.
              className={cn(PACE_FIELD[sport].unit && "pr-16")}
              required
            />
            {PACE_FIELD[sport].unit && (
              <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm text-muted-foreground">
                {PACE_FIELD[sport].unit}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{PACE_FIELD[sport].hint}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Max participants <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            type="number"
            min={1}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Route link — Komoot/Strava <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            type="url"
            value={routeLink}
            onChange={(e) => setRouteLink(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-muted-foreground">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={fieldClassName}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting || lat == null || lng == null}>
          {isSubmitting ? "Creating..." : "Create event"}
        </Button>
      </form>
    </main>
  );
}
