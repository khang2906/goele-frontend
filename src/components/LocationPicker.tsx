"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import { Input } from "@/components/ui/input";
import { markerIcon } from "@/lib/leaflet-icon";

const MUNICH: [number, number] = [48.1374, 11.5755];

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

type LocationPickerProps = {
  meetingPoint: string;
  onMeetingPointChange: (value: string) => void;
  lat: number | null;
  lng: number | null;
  onPositionChange: (lat: number, lng: number) => void;
};

// Listens for clicks on the map. Has to be a child of MapContainer — react-leaflet's
// event hooks only work inside the map's own context, so this can't live in the parent.
function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({
  meetingPoint,
  onMeetingPointChange,
  lat,
  lng,
  onPositionChange,
}: LocationPickerProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  function handleInputChange(value: string) {
    onMeetingPointChange(value);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const query = value.trim();
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    // Debounce: wait 300ms after the user stops typing before hitting Nominatim,
    // otherwise every keystroke fires a request.
    debounceTimer.current = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
      )
        .then((r) => r.json())
        .then(setSuggestions);
    }, 300);
  }

  function selectSuggestion(place: NominatimResult) {
    onMeetingPointChange(place.display_name);
    setSuggestions([]);
    onPositionChange(parseFloat(place.lat), parseFloat(place.lon));
  }

  function handleMapClick(clickLat: number, clickLng: number) {
    setSuggestions([]);
    onPositionChange(clickLat, clickLng);

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${clickLat}&lon=${clickLng}&format=json`)
      .then((r) => r.json())
      .then((result) => {
        if (result?.display_name) onMeetingPointChange(result.display_name);
      });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[0]) selectSuggestion(suggestions[0]);
    }
    if (e.key === "Escape") {
      setSuggestions([]);
    }
  }

  const position: [number, number] = lat != null && lng != null ? [lat, lng] : MUNICH;

  return (
    <div>
      <div className="relative">
        <Input
          value={meetingPoint}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          // mousedown (not blur) closes the list, so a suggestion click registers
          // before the input's blur event would otherwise hide the list first.
          onBlur={() => setSuggestions([])}
          placeholder="Type to search, or click the map"
          autoComplete="off"
          required
        />
        {suggestions.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-[1000] max-h-60 overflow-auto rounded-lg border border-border bg-background shadow-md">
            {suggestions.map((place) => (
              <li
                key={`${place.lat}-${place.lon}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(place);
                }}
                className="cursor-pointer truncate px-2.5 py-1.5 text-sm hover:bg-muted"
              >
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <MapContainer center={position} zoom={lat != null ? 14 : 12} className="mt-2 h-64 w-full rounded-lg">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onClick={handleMapClick} />
        {lat != null && lng != null && <Marker position={[lat, lng]} icon={markerIcon} />}
      </MapContainer>
    </div>
  );
}
