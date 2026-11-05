import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin, RotateCcw } from "lucide-react";
import { inr, tripDays, useFleet } from "@/lib/fleet";
import { Button } from "@/components/ui/button";
import { Tyre } from "@/components/Tyre";

export function Booking({ selectedVehicle }: { selectedVehicle?: string }) {
 const { fleet } = useFleet();
 const [today,setToday] = useState("");
 const [pickup,setPickup] = useState("");
 const [ret,setRet] = useState("");
 const [vehicleId,setVehicleId] = useState("");
 const [error,setError] = useState("");
 const [stage,setStage] = useState<"idle"|"loading"|"done">("idle");
 useEffect(()=>setToday(new Date().toISOString().slice(0,10)),[]);
 useEffect(()=>{ if(selectedVehicle) {setVehicleId(selectedVehicle);setStage("idle");} },[selectedVehicle]);
 useEffect(()=>{if(!fleet.some(v=>v.id===vehicleId))setVehicleId(fleet[0]?.id??"");},[fleet,vehicleId]);
 useEffect(()=>{if(stage!=="loading")return; const t=setTimeout(()=>setStage("done"),700);return()=>clearTimeout(t);},[stage]);
 const vehicle=fleet.find(v=>v.id===vehicleId);
 const days=tripDays(pickup,ret);
 const total=(vehicle?.pricePerDay??0)*days;
 const calculate=(e:React.FormEvent)=>{e.preventDefault();if(!pickup||!ret)return setError("Choose your pickup and return dates.");if(!days)return setError("Return date cannot be before pickup.");if(!vehicle)return setError("Choose a vehicle first.");setError("");setStage("loading");};
 return <div>
  <form onSubmit={calculate} className="rental-fields">
   <div className="rental-field rental-location"><span className="eyebrow text-muted-foreground">Your starting point</span><span className="flex items-center gap-2 font-medium"><MapPin size={16}/> Lucknow, UP</span></div>
   <label className="rental-field"><span className="eyebrow text-muted-foreground">Pickup date</span><input aria-label="Pickup date" type="date" min={today||undefined} value={pickup} onChange={e=>{setPickup(e.target.value);setStage("idle");}}/></label>
   <label className="rental-field"><span className="eyebrow text-muted-foreground">Return date</span><input aria-label="Return date" type="date" min={pickup||today||undefined} value={ret} onChange={e=>{setRet(e.target.value);setStage("idle");}}/></label>
   <label className="rental-field rental-vehicle"><span className="eyebrow text-muted-foreground">Choose your car</span><select aria-label="Choose your car" value={vehicleId} onChange={e=>{setVehicleId(e.target.value);setStage("idle");}}>{fleet.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
   <Button type="submit" disabled={stage==="loading"||!fleet.length} className="rental-submit h-12 px-6">{stage==="loading"?<><Tyre/>Calculating</>:<>View rental estimate <ArrowUpRight/></>}</Button>
  </form>
  {error&&<p role="alert" className="pb-5 text-sm text-destructive">{error}</p>}
  {stage==="done"&&<div role="status" className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6"><div><p className="eyebrow text-muted-foreground">Your rental estimate</p><p className="mt-1 text-lg font-medium">{vehicle?.name} · {days} {days===1?"day":"days"}</p><p className="mt-1 text-sm text-muted-foreground">{pickup} → {ret} · Estimate only, no reservation submitted.</p></div><div className="flex items-center gap-5"><span className="font-display text-4xl">{inr(total)}</span><Button variant="outline" size="icon" aria-label="Reset estimate" onClick={()=>{setStage("idle");setPickup("");setRet("");}}><RotateCcw/></Button></div></div>}
 </div>;
}
