import { useEffect, useState } from "react";

export type Vehicle = {
  id: string;
  name: string;
  type: string;
  seats: number;
  pricePerDay: number;
};

export const DEFAULT_FLEET: Vehicle[] = [
  { id: "rubicon", name: "Jeep Wrangler Rubicon", type: "4x4 Off-road", seats: 5, pricePerDay: 9500 },
  { id: "thar-roxx", name: "Mahindra Thar Roxx", type: "4x4 SUV", seats: 5, pricePerDay: 5500 },
  { id: "fortuner", name: "Toyota Fortuner Legender", type: "Full-size SUV", seats: 7, pricePerDay: 8000 },
  { id: "scorpio-n", name: "Mahindra Scorpio-N", type: "SUV", seats: 7, pricePerDay: 4500 },
  { id: "hycross", name: "Toyota Innova Hycross", type: "MPV", seats: 7, pricePerDay: 5000 },
];

const KEY = "rubicon-rentals:fleet";
const listeners = new Set<(f: Vehicle[]) => void>();

function read(): Vehicle[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Vehicle[];
  } catch {
    /* ignore */
  }
  return DEFAULT_FLEET;
}

function write(f: Vehicle[]) {
  localStorage.setItem(KEY, JSON.stringify(f));
  listeners.forEach((l) => l(f));
}

export function useFleet() {
  const [fleet, setFleet] = useState<Vehicle[]>(DEFAULT_FLEET);
  useEffect(() => {
    setFleet(read());
    listeners.add(setFleet);
    return () => {
      listeners.delete(setFleet);
    };
  }, []);
  return {
    fleet,
    add: (v: Omit<Vehicle, "id">) => write([...read(), { ...v, id: `${Date.now()}` }]),
    remove: (id: string) => write(read().filter((v) => v.id !== id)),
    reset: () => write(DEFAULT_FLEET),
  };
}

/** Number of rental days between pickup and return (same day counts as 1). */
export function tripDays(pickup: string, ret: string): number {
  if (!pickup || !ret) return 0;
  const ms = new Date(ret).getTime() - new Date(pickup).getTime();
  if (Number.isNaN(ms) || ms < 0) return 0;
  return Math.max(1, Math.round(ms / 86400000));
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
