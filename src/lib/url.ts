// Builds a homepage URL for a given sport filter. Shared by page.tsx (a
// Server Component, which builds these as plain <Link href> targets) and
// SportFilterSelect.tsx (a Client Component, which needs the same URL to
// call router.push itself) — functions can't be passed as props from a
// Server Component to a Client one, so each side imports this rather than
// one passing it to the other.
export function buildEventsHref(sport: string | undefined): string {
  const params = new URLSearchParams();
  if (sport) params.set("sport", sport);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
