export type Sport = "bike" | "motorcycle" | "run";

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
