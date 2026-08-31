export type Sport = "bike" | "motorcycle" | "run";

/**
 * The map's visible area, as plain numbers rather than Leaflet's LatLngBounds.
 *
 * Deliberate: the panels and EventsExplorer need these values, and importing
 * anything from Leaflet outside a dynamically-loaded map component crashes the
 * server render (Leaflet touches `window` at module load). Plain numbers cross
 * that boundary safely.
 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export const SPORT_LABELS: Record<Sport, string> = {
  bike: "Bike",
  motorcycle: "Motorcycle",
  run: "Run",
};

export interface EventListItem {
  id: number;
  sport: Sport;
  title: string;
  date: string; // ISO string from JSON — convert to Date when displaying
  meeting_point: string;
  pace: string;
  max_participants: number | null;
  lat: number | null;
  lng: number | null;
}

export interface Rsvp {
  id: number;
  event_id: number;
  name: string;
  created_at: string;
}

export interface Event extends EventListItem {
  route_link: string | null;
  description: string | null;
  rsvps: Rsvp[];
}
