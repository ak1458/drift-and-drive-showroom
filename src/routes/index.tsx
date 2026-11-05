import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import hero from "@/assets/showroom-jeep.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { Booking } from "@/components/Booking";
import { Button } from "@/components/ui/button";
import { inr, useFleet } from "@/lib/fleet";
import { fleetMedia } from "@/lib/fleet-media";

export const Route=createFileRoute("/")({head:()=>({meta:[{title:"Sky Car Rental — Self-Drive in Lucknow"},{name:"description",content:"Explore the Sky Car Rental collection in Lucknow. Choose a car and your dates for a daily rental estimate."},{property:"og:title",content:"Sky Car Rental — Self-Drive in Lucknow"},{property:"og:description",content:"Your choice of car. Your own pace. Self-drive rentals in Lucknow."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Index});
function Index(){
 const root=useRef<HTMLDivElement>(null);
 const {fleet}=useFleet();
 const [index,setIndex]=useState(0);
 const [selected,setSelected]=useState("");
 const vehicle=fleet[index%Math.max(fleet.length,1)];
 useEffect(()=>{
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const ctx=gsap.context(()=>{gsap.from(".hero-photo",{scale:1.025,duration:1.4,ease:"power2.out"});gsap.from(".hero-content",{y:16,opacity:0,duration:.9,delay:.15,ease:"power2.out"});},root);
  return()=>ctx.revert();
 },[]);
 const choose=()=>{if(!vehicle)return;setSelected(vehicle.id);document.getElementById("book")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});};
 return <div ref={root}>
  <SiteHeader/>
  <main>
   <section className="hero-stage">
    <img src={hero} alt="Graphite Jeep Wrangler in a softly lit concrete showroom" width={1920} height={1024} fetchPriority="high" className="hero-photo"/>
    <div className="page-width hero-content"><h1 className="hero-title font-display">SKY CAR RENTAL</h1><p className="mt-4 text-sm text-hero-foreground/65">Self-drive. Lucknow.</p><Button asChild variant="link" className="mt-7 h-auto p-0 text-sm text-hero-foreground hover:text-primary"><a href="#garage">Find your car <ArrowUpRight/></a></Button></div>
   </section>
   <section id="garage" className="collection-section page-width">
    <div className="mb-12 flex items-center justify-between gap-6"><h2 className="font-display text-4xl font-normal">THE COLLECTION</h2><div className="flex items-center gap-4"><span className="text-xs text-muted-foreground">{fleet.length?String(index%fleet.length+1).padStart(2,"0"):"00"} / {String(fleet.length).padStart(2,"0")}</span><Button variant="ghost" size="icon" disabled={fleet.length<2} aria-label="Previous car" onClick={()=>setIndex(i=>(i-1+fleet.length)%fleet.length)}><ArrowLeft/></Button><Button variant="ghost" size="icon" disabled={fleet.length<2} aria-label="Next car" onClick={()=>setIndex(i=>(i+1)%fleet.length)}><ArrowRight/></Button></div></div>
    {vehicle?<div className="collection-feature"><div className="overflow-hidden">{fleetMedia[vehicle.id]?<img src={fleetMedia[vehicle.id]} alt={vehicle.name} width={1024} height={768} loading="lazy" className="collection-photo"/>:<div className="flex aspect-[4/3] items-center justify-center bg-secondary font-display text-3xl">{vehicle.name}</div>}</div><div className="collection-details"><p className="text-xs text-muted-foreground">{vehicle.seats} seats · {vehicle.type}</p><h3 className="mt-5 font-display text-4xl leading-tight">{vehicle.name}</h3><p className="mt-6 text-base">{inr(vehicle.pricePerDay)}<span className="text-sm text-muted-foreground"> / day</span></p><Button variant="outline" onClick={choose} className="mt-10 h-11 border-border bg-transparent">Choose this car <ArrowUpRight/></Button></div></div>:<p className="py-12 text-muted-foreground">No cars in the collection.</p>}
   </section>
   <section id="book" className="booking-band"><div className="page-width"><h2 className="font-display text-4xl font-normal">YOUR DATES.</h2><Booking selectedVehicle={selected}/></div></section>
  </main>
  <footer className="page-width flex flex-wrap items-center justify-between gap-4 py-10 text-xs text-muted-foreground"><span>© 2026 Sky Car Rental · Lucknow</span><Link to="/fleet" className="hover:text-foreground">Manage fleet <span aria-hidden>↗</span></Link></footer>
 </div>;
}
