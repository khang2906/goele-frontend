"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildEventsHref } from "@/lib/url";
import { SPORT_LABELS, type Sport } from "@/types";

const OPTIONS: { value: Sport | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bike", label: SPORT_LABELS.bike },
  { value: "motorcycle", label: SPORT_LABELS.motorcycle },
  { value: "run", label: SPORT_LABELS.run },
];

export function SportFilterSelect({ sport }: { sport: Sport | undefined }) {
  const router = useRouter();

  return (
    <Select
      value={sport ?? "all"}
      onValueChange={(value) => {
        const nextSport = value === "all" ? undefined : (value as Sport);
        router.push(buildEventsHref(nextSport));
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
