import { describe, expect, it } from "vitest";
import { DEFAULT_FLEET, tripDays } from "@/lib/fleet";

describe("booking rules", () => {
  it("counts days between pickup and return", () => {
    expect(tripDays("2026-11-10", "2026-11-13")).toBe(3);
  });
  it("same-day return counts as one day", () => {
    expect(tripDays("2026-11-10", "2026-11-10")).toBe(1);
  });
  it("return before pickup is invalid", () => {
    expect(tripDays("2026-11-10", "2026-11-08")).toBe(0);
  });
  it("starts with five vehicles, Rubicon first", () => {
    expect(DEFAULT_FLEET).toHaveLength(5);
    expect(DEFAULT_FLEET[0].name).toBe("Jeep Wrangler Rubicon");
  });
});
