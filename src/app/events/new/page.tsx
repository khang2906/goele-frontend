"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationPickerLoader } from "@/components/LocationPickerLoader";
import type { Sport } from "@/types";

// Shared with Input's own styling so the plain <select>/<textarea> (no shadcn
// wrapper exists for these yet) still look like they belong to the same form.
const fieldClassName =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";

const SPORTS: { value: Sport; label: string }[] = [
  { value: "bike", label: "Bike" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "run", label: "Run" },
];

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
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          title,
          date,
          meeting_point: meetingPoint,
          pace,
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
            onChange={(e) => setSport(e.target.value as Sport)}
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
          <label className="block text-sm font-medium mb-1">Meeting point</label>
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
          <Input
            value={pace}
            onChange={(e) => setPace(e.target.value)}
            placeholder="e.g. relaxed, moderate, fast"
            required
          />
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create event"}
        </Button>
      </form>
    </main>
  );
}
