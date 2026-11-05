import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { inr, useFleet } from "@/lib/fleet";
import { Tyre } from "@/components/Tyre";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet — Rubicon Rentals Lucknow" },
      { name: "description", content: "Add or remove the vehicles offered for rent in Lucknow." },
      { property: "og:title", content: "Fleet — Rubicon Rentals" },
      { property: "og:description", content: "Manage the vehicles available for booking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FleetPage,
});

const field =
  "w-full border border-border bg-transparent px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-primary";

function FleetPage() {
  const { fleet, add, remove, reset } = useFleet();
  const [form, setForm] = useState({ name: "", type: "SUV", seats: "5", pricePerDay: "" });
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.pricePerDay);
    const seats = Number(form.seats);
    if (!form.name.trim()) return setErr("Give the vehicle a name.");
    if (!price || price <= 0) return setErr("Enter a daily price.");
    add({ name: form.name.trim(), type: form.type.trim() || "Car", seats: seats || 5, pricePerDay: price });
    setForm({ name: "", type: "SUV", seats: "5", pricePerDay: "" });
    setErr("");
  };

  return (
    <div className="road-grid min-h-screen px-6 py-8 md:px-16">
      <header className="flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-black uppercase">
          Rubicon<span className="text-primary">/</span>LKO
        </Link>
        <Link to="/" hash="book" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
          ← Back to booking
        </Link>
      </header>

      <h1 className="mt-16 font-display text-7xl font-black uppercase leading-[0.85] md:text-9xl">The garage.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">Add or remove the vehicles customers can book. Changes appear in the booking console right away.</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-border border-y border-border">
          {fleet.map((v, idx) => (
            <li key={v.id} className="flex items-center gap-4 py-4">
              <span className="font-mono text-xs text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <p className="font-display text-2xl font-extrabold uppercase">{v.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {v.type} · {v.seats} seats · {inr(v.pricePerDay)}/day
                </p>
              </div>
              <button
                onClick={() => remove(v.id)}
                className="border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                Remove
              </button>
            </li>
          ))}
          {fleet.length === 0 && <li className="py-6 text-muted-foreground">Garage is empty.</li>}
        </ul>

        <form onSubmit={submit} className="h-fit space-y-3 border border-border bg-card p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Add vehicle</p>
          <input className={field} placeholder="Name e.g. Tata Harrier" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={field} placeholder="Type e.g. SUV" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className={field} type="number" min={1} placeholder="Seats" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
            <input className={field} type="number" min={1} placeholder="₹ / day" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
          </div>
          {err && <p className="font-mono text-xs text-destructive">{err}</p>}
          <button className="group flex w-full items-center justify-center gap-3 bg-primary py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground hover:glow">
            <Tyre spinning={false} className="transition-transform duration-500 group-hover:rotate-[360deg]" /> Add to fleet
          </button>
          <button type="button" onClick={reset} className="w-full py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            Restore default fleet
          </button>
        </form>
      </div>
    </div>
  );
}
