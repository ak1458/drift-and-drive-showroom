import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { inr, tripDays, useFleet } from "@/lib/fleet";
import { Tyre } from "@/components/Tyre";
import { cn } from "@/lib/utils";

type Stage = "idle" | "loading" | "done";

export function Booking() {
  const { fleet } = useFleet();
  const [today, setToday] = useState("");
  const [pickup, setPickup] = useState("");
  const [ret, setRet] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [ref, setRef] = useState("");

  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  useEffect(() => {
    if (!fleet.find((v) => v.id === vehicleId)) setVehicleId(fleet[0]?.id ?? "");
  }, [fleet, vehicleId]);

  const vehicle = fleet.find((v) => v.id === vehicleId);
  const days = tripDays(pickup, ret);
  const total = useMemo(() => (vehicle ? vehicle.pricePerDay * days : 0), [vehicle, days]);

  const book = () => {
    if (!pickup || !ret) return setError("Pick both dates first.");
    if (days === 0) return setError("Return date can't be before pickup.");
    if (!vehicle) return setError("Choose a vehicle.");
    setError("");
    setStage("loading");
    window.dispatchEvent(new Event("car:launch"));
    setTimeout(() => {
      setRef("LKO-" + Math.random().toString(36).slice(2, 7).toUpperCase());
      setStage("done");
    }, 1900);
  };

  const again = () => {
    setStage("idle");
    setPickup("");
    setRet("");
    window.dispatchEvent(new Event("car:return"));
  };

  return (
    <div className="relative w-full max-w-md border border-border bg-card p-6 backdrop-blur-md md:p-8">
      <div className="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>Booking console</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary glow" /> Lucknow
        </span>
      </div>

      {stage === "done" ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-highlight">Confirmed</p>
          <h3 className="mt-2 font-display text-5xl font-black uppercase leading-none">Keys are yours.</h3>
          <dl className="mt-6 space-y-2 border-t border-border pt-4 font-mono text-sm">
            <Row k="Ref" v={ref} />
            <Row k="Vehicle" v={vehicle?.name ?? ""} />
            <Row k="Pickup" v={pickup} />
            <Row k="Return" v={ret} />
            <Row k="Total" v={inr(total)} />
          </dl>
          <button onClick={again} className="mt-6 w-full border border-border py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-highlight">
            Book another drive
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <DateField label="Pickup" value={pickup} min={today} onChange={setPickup} />
            <DateField label="Return" value={ret} min={pickup || today} onChange={setRet} />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Vehicle</span>
              <Link to="/fleet" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-highlight">
                Edit fleet →
              </Link>
            </div>
            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {fleet.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVehicleId(v.id)}
                  className={cn(
                    "flex w-full items-center justify-between border px-3 py-2.5 text-left transition-all",
                    v.id === vehicleId ? "border-primary bg-primary/10" : "border-border hover:border-foreground/30",
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium">{v.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {v.type} · {v.seats} seats
                    </span>
                  </span>
                  <span className="font-mono text-sm">
                    {inr(v.pricePerDay)}
                    <span className="text-muted-foreground">/d</span>
                  </span>
                </button>
              ))}
              {fleet.length === 0 && <p className="text-sm text-muted-foreground">No vehicles yet — add one in the fleet page.</p>}
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between border-t border-border pt-4">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Trip
              <div className="mt-1 font-display text-3xl font-black tabular-nums text-foreground">
                {String(days).padStart(2, "0")} <span className="text-base">days</span>
              </div>
            </div>
            <div className="text-right font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Total
              <div className="mt-1 font-display text-3xl font-black text-highlight">{inr(total)}</div>
            </div>
          </div>

          {error && <p className="mt-3 font-mono text-xs text-destructive">{error}</p>}

          <button
            onClick={book}
            disabled={stage === "loading"}
            className="group mt-5 flex w-full items-center justify-center gap-3 bg-primary py-4 font-mono text-sm font-medium uppercase tracking-[0.25em] text-primary-foreground transition-all hover:glow active:animate-ignition disabled:opacity-90"
          >
            {stage === "loading" ? (
              <>
                <Tyre /> Revving…
              </>
            ) : (
              <>
                <Tyre spinning={false} className="transition-transform duration-500 group-hover:rotate-[360deg]" /> Book the drive
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function DateField({ label, value, min, onChange }: { label: string; value: string; min: string; onChange: (v: string) => void }) {
  return (
    <label className="block border border-border px-3 py-2.5 transition-colors focus-within:border-primary">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input
        type="date"
        value={value}
        min={min || undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full bg-transparent font-mono text-sm text-foreground outline-none dark:[color-scheme:dark]"
      />
    </label>
  );
}
