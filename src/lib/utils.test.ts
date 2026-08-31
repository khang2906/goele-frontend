import { describe, expect, it } from "vitest";

import { safeHttpUrl } from "@/lib/utils";

/**
 * route_link is free text typed by whoever created an event and rendered
 * straight into an <a href>. Without the scheme check, a "javascript:" URL
 * would execute on click — so these tests guard a security property, not a
 * formatting preference.
 */
describe("safeHttpUrl", () => {
  it("allows https and http URLs", () => {
    expect(safeHttpUrl("https://www.komoot.com/tour/123")).toBe(
      "https://www.komoot.com/tour/123"
    );
    expect(safeHttpUrl("http://example.com")).toBe("http://example.com");
  });

  it("rejects javascript: URLs", () => {
    expect(safeHttpUrl("javascript:alert(1)")).toBeUndefined();
  });

  it("rejects javascript: URLs disguised by case or whitespace", () => {
    // new URL() lowercases the scheme and trims leading whitespace, so these
    // normalise to the same thing — worth pinning, since a hand-rolled
    // startsWith("javascript:") check would let both through.
    expect(safeHttpUrl("JaVaScRiPt:alert(1)")).toBeUndefined();
    expect(safeHttpUrl("  javascript:alert(1)")).toBeUndefined();
  });

  it("rejects other non-http schemes", () => {
    expect(safeHttpUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(safeHttpUrl("file:///etc/passwd")).toBeUndefined();
  });

  it("rejects unparseable text rather than throwing", () => {
    // Users type things like "ask me on WhatsApp" into this field.
    expect(safeHttpUrl("not a url at all")).toBeUndefined();
  });

  it("handles null and empty input", () => {
    expect(safeHttpUrl(null)).toBeUndefined();
    expect(safeHttpUrl("")).toBeUndefined();
  });
});
