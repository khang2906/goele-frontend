import L from "leaflet";

// Leaflet's default marker icon URLs are relative paths meant for a plain
// <script> setup — they 404 once Next.js bundles the code. Point them at the
// CDN instead. Shared by every component that places a Leaflet marker.
export const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
