import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Check, SlidersHorizontal } from "lucide-react";
import hero from "@/assets/showroom-jeep.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { Booking } from "@/components/Booking";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { inr, useFleet } from "@/lib/fleet";
import { fleetMedia } from "@/lib/fleet-media";

export const Route=createFileRoute("/")({head:()=>({meta:[{title:"Sky Car Rental — Your Drive, Your Way | Lucknow"},{name:"description",content:"Find your next self-drive in Lucknow. Explore the Sky Car Rental fleet, choose dates and compare daily rental estimates."},{property:"og:title",content:"Sky Car Rental — Your Drive, Your Way"},{property:"og:description",content:"A considered collection of self-drive cars in Lucknow. Find a car that fits your journey."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:Index});
const faqs=[
 ["Where does my rental start?","Sky Car Rental is based in Lucknow. Your rental starts and ends in Lucknow; pickup details are agreed when a reservation is arranged."],
 ["How is the rental estimate calculated?","The displayed daily rate is multiplied by your selected rental days. A same-day trip counts as one day. Deposits, fuel and any additional charges are not included in this estimate."],
 ["Can I reserve a car on this page?","You can explore cars and calculate a rental estimate here. No payment is taken and no reservation is submitted through this preview."],
 ["What should I confirm before renting?","Confirm vehicle availability, driving licence requirements, pickup arrangements, deposit, fuel policy and cancellation terms before finalising your rental."]
];
function Index(){
 const root=useRef<HTMLDivElement>(null);
 const {fleet}=useFleet();
 const [filter,setFilter]=useState("All cars");
 const [selected,setSelected]=useState("");
 const visible=fleet.filter(v=>filter==="All cars"||(filter==="5 seats"?v.seats===5:v.seats>=7));
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)",()=>{
   const ctx=gsap.context(()=>{
    gsap.timeline({defaults:{ease:"power3.out"}}).from(".hero-photo",{scale:1.065,duration:1.6}).from(".load-reveal",{y:24,opacity:0,duration:.85,stagger:.1},.2);
    gsap.utils.toArray<HTMLElement>(".editorial-reveal").forEach(el=>gsap.from(el,{y:28,opacity:0,duration:.8,scrollTrigger:{trigger:el,start:"top 91%",once:true}}));
   },root);
   return()=>ctx.revert();
  });return()=>mm.revert();
 },[]);
 const choose=(id:string)=>{setSelected(id);document.getElementById("book")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});};
 return <div ref={root}>
  <SiteHeader/>
  <main>
   <section className="hero-stage">
    <img src={hero} alt="Graphite Jeep Wrangler in a softly lit concrete showroom" width={1920} height={1024} fetchPriority="high" className="hero-photo"/>
    <div className="page-width hero-content">
     <p className="load-reveal eyebrow flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary"/> Self-drive car rental · Lucknow</p>
     <h1 className="load-reveal hero-title font-display">SKY CAR RENTAL<span className="mt-2 block text-primary">YOUR DRIVE.<br/>YOUR WAY.</span></h1>
     <p className="load-reveal mt-5 max-w-[245px] text-base text-hero-foreground/75">A city to explore. A road to take.<br/>A car that feels like you.</p>
     <Button asChild variant="outline" className="load-reveal mt-7 h-11 border-hero-foreground/40 bg-transparent text-hero-foreground hover:bg-hero-foreground hover:text-hero"><a href="#garage">Explore the fleet <ArrowUpRight/></a></Button>
    </div>
    <div className="hero-caption"><div className="page-width load-reveal flex items-end justify-between gap-4"><a href="#garage" className="flex items-center gap-3 text-xs"><ArrowDown size={16}/> Take a closer look</a><div className="text-right"><p className="eyebrow text-hero-foreground/60">In the spotlight</p><p className="mt-1 text-sm">Jeep Wrangler Rubicon <span className="ml-2 text-primary">01 / 05</span></p></div></div></div>
   </section>
   <section id="book" className="booking-band"><div className="page-width"><Booking selectedVehicle={selected}/></div></section>
   <section id="garage" className="page-width section-space">
    <div className="editorial-reveal flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow text-muted-foreground">01 / The collection</p><h2 className="section-title mt-4 font-display">A GOOD DRIVE<br/>STARTS HERE.</h2></div><p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">For the everyday escape or the long way home. Find the right car for your kind of journey.</p></div>
    <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><div className="flex gap-2" role="group" aria-label="Filter vehicles">{["All cars","5 seats","7+ seats"].map(f=><Button key={f} variant={filter===f?"secondary":"ghost"} aria-pressed={filter===f} onClick={()=>setFilter(f)} className="h-9 text-xs">{f}{filter===f&&<Check size={12}/>}</Button>)}</div><Button asChild variant="ghost" className="text-xs text-muted-foreground"><Link to="/fleet"><SlidersHorizontal/> Manage fleet</Link></Button></div>
    <div className="mt-7 grid gap-x-6 gap-y-10 md:grid-cols-3">
     {visible.map((v,i)=><article key={v.id} className="fleet-item min-w-0"><div className="relative overflow-hidden bg-secondary">{fleetMedia[v.id]?<img src={fleetMedia[v.id]} alt={v.name} width={1024} height={768} loading="lazy" className="fleet-photo"/>:<div className="flex aspect-[4/3] items-center justify-center font-display text-4xl">{v.name}</div>}<span className="absolute left-4 top-4 text-[11px] text-hero-foreground">{String(i+1).padStart(2,"0")}</span></div><div className="mt-5 flex items-start justify-between gap-3"><div className="min-w-0"><p className="eyebrow text-muted-foreground">{v.type} · {v.seats} seats</p><h3 className="mt-2 font-display text-2xl leading-tight">{v.name}</h3></div><Button size="icon" variant="outline" aria-label={`Choose ${v.name}`} onClick={()=>choose(v.id)}><ArrowUpRight/></Button></div><div className="mt-4 flex items-center justify-between border-t border-border pt-4"><span className="text-sm"><strong className="font-medium">{inr(v.pricePerDay)}</strong><span className="text-muted-foreground"> / day</span></span><Button variant="link" onClick={()=>choose(v.id)} className="h-auto p-0 text-xs text-foreground">Choose this car</Button></div></article>)}
    </div>{!visible.length&&<p className="py-10 text-muted-foreground">No cars in this selection.</p>}
   </section>
   <section id="approach" className="approach-band section-space"><div className="page-width"><div className="editorial-reveal flex flex-wrap justify-between gap-8"><div><p className="eyebrow">02 / The Sky way</p><h2 className="section-title mt-4 font-display">LESS FUSS.<br/>MORE OPEN ROAD.</h2></div><p className="max-w-[330px] text-lg leading-relaxed">The best part of renting a car?<br/>Making the journey your own.</p></div><div className="mt-12 grid gap-8 md:grid-cols-3">{[["01","Find your fit","Compare our collection by space, style and daily rate."],["02","Make it your trip","Choose your dates and see your rental estimate upfront."],["03","Make a plan","Confirm availability and pickup details before your drive."]].map(([n,title,copy])=><div key={n} className="editorial-reveal approach-rule border-t pt-5"><span className="text-xs">{n}</span><h3 className="mt-5 font-display text-3xl">{title}</h3><p className="mt-3 max-w-[280px] text-sm leading-relaxed">{copy}</p></div>)}</div></div></section>
   <section id="questions" className="page-width section-space grid gap-10 md:grid-cols-[1fr_1.25fr]"><div className="editorial-reveal"><p className="eyebrow text-muted-foreground">03 / Before you go</p><h2 className="section-title mt-4 font-display">GOOD TO<br/>KNOW.</h2><p className="mt-5 max-w-xs text-sm text-muted-foreground">A little clarity before the journey begins.</p></div><Accordion type="single" collapsible className="editorial-reveal border-t border-border">{faqs.map(([q,a],i)=><AccordionItem key={q} value={q}><AccordionTrigger className="gap-5 py-6 text-left text-base font-normal hover:no-underline"><span className="flex gap-5"><span className="text-xs text-muted-foreground">0{i+1}</span>{q}</span></AccordionTrigger><AccordionContent className="pl-8 text-sm leading-relaxed text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></section>
  </main>
  <footer className="border-t border-border"><div className="page-width py-10"><div className="flex flex-wrap items-center justify-between gap-5"><p className="eyebrow text-muted-foreground">Lucknow, Uttar Pradesh · India</p><Button asChild><a href="#book">Find your next drive <ArrowUpRight/></a></Button></div><div className="my-9 flex flex-wrap items-end justify-between gap-6"><p className="footer-word font-display">SKY<span className="text-highlight">/</span></p><p className="text-sm text-muted-foreground">Your drive. Your way.</p></div><div className="flex justify-between border-t border-border pt-5 text-xs text-muted-foreground"><span>© 2026 Sky Car Rental</span><a href="#garage">Back to the collection ↑</a></div></div></footer>
 </div>;
}
