import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUp, Check, ChevronLeft, ChevronRight, Heart, Leaf, Plus, Sparkles, Star, Users } from "lucide-react";
import { LazyScene } from "./LazyScene";
import { Logo, NAV } from "./Navbar";
import { useCart } from "@/hooks/use-cart";
import { combos, contact, inr, products, reviews, socials, type Category, type Product } from "@/data/products";
import story from "@/assets/story.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useReveal(scope: React.RefObject<HTMLElement | null>, selector = "[data-reveal]") {
  useGSAP(() => {
    if (reduced()) return;
    gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
      gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } });
    });
  }, { scope });
}

/* ---------- HERO ---------- */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero-word", { yPercent: 110, duration: 1, stagger: 0.07 })
      .from(".hero-fade", { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.5");
    gsap.to(".hero-content", { yPercent: -15, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    gsap.utils.toArray<HTMLElement>(".spark").forEach((s) => {
      gsap.to(s, { y: "random(-40, 40)", x: "random(-30, 30)", duration: "random(3, 6)", repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
  }, { scope: ref });
  const line1 = "NOT JUST A SNACK.".split(" ");
  const line2 = "IT'S A WHOLE EXPERIENCE.".split(" ");
  const Word = ({ w, gold }: { w: string; gold?: boolean }) => (
    <span className="inline-block overflow-hidden pb-1 align-bottom"><span className={`hero-word inline-block ${gold ? "text-primary" : ""}`}>{w}&nbsp;</span></span>
  );
  return (
    <section id="home" ref={ref} className="relative min-h-svh overflow-hidden">
      <div className="glow-gold absolute inset-0" />
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} aria-hidden className="spark absolute h-1 w-1 rounded-full bg-primary/60" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }} />
      ))}
      <div className="relative mx-auto grid min-h-svh max-w-7xl items-center gap-6 px-5 pb-12 pt-28 md:px-8 lg:grid-cols-2">
        <div className="hero-content relative z-10">
          <p className="eyebrow hero-fade mb-6">Pop Beyond Ordinary</p>
          <h1 className="text-[clamp(3rem,8vw,6.5rem)]">
            {line1.map((w) => <Word key={w} w={w} />)}<br />
            {line2.map((w, i) => <Word key={w} w={w} gold={i >= 2} />)}
          </h1>
          <p className="hero-fade mt-6 max-w-md text-lg text-muted-foreground">
            From movie nights to midnight cravings, discover popcorn that makes every moment <em className="font-serif text-xl text-foreground">extraordinary.</em>
          </p>
          <div className="hero-fade mt-9 flex flex-wrap gap-4">
            <a href="#flavours" className="btn-gold" data-magnetic>Explore Flavours <ArrowRight size={16} /></a>
            <a href="#best-sellers" className="btn-ghost" data-magnetic>Shop Now</a>
          </div>
        </div>
        <div className="relative h-[46vh] lg:h-[80vh]">
          <LazyScene intro kernels={26} />
        </div>
      </div>
    </section>
  );
}

/* ---------- STORY ---------- */
export function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useGSAP(() => {
    if (reduced()) return;
    gsap.fromTo(".story-img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ref.current, scrub: true } });
  }, { scope: ref });
  const highlights = [
    { icon: Users, t: "Made for sharing" },
    { icon: Heart, t: "Crafted for cravings" },
    { icon: Sparkles, t: "Flavours worth remembering" },
  ];
  return (
    <section id="story" ref={ref} className="bg-cream text-cream-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl" data-reveal>
          <img src={story} alt="Caramel popcorn tumbling out of a red and cream striped bucket" width={1024} height={1280} loading="lazy" className="story-img h-[116%] w-full object-cover" />
        </div>
        <div>
          <p data-reveal className="eyebrow text-caramel">Our Story</p>
          <h2 data-reveal className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)]">We make every pop a little more <span className="font-serif normal-case italic text-caramel">special.</span></h2>
          <p data-reveal className="mt-6 max-w-lg text-lg opacity-80">
            At POPCORN, we believe the best moments deserve the best snacks. We bring together irresistible flavours, quality ingredients and a little creativity to turn ordinary moments into extraordinary memories.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map(({ icon: I, t }) => (
              <div key={t} data-reveal className="rounded-2xl border border-ink/10 p-5">
                <I className="text-caramel" size={22} />
                <p className="mt-3 font-bold">{t}</p>
              </div>
            ))}
          </div>
          <div data-reveal className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-6xl text-caramel">6</span>
            <span className="font-semibold">signature flavours, from sweet to savoury.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FLAVOURS ---------- */
function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const card = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const onMove = (e: React.MouseEvent) => {
    if (reduced() || !card.current) return;
    const r = card.current.getBoundingClientRect();
    gsap.to(card.current, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 10, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 10, duration: 0.4 });
  };
  const onLeave = () => card.current && gsap.to(card.current, { rotateX: 0, rotateY: 0, duration: 0.6 });
  const onAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(p.id); setAdded(true);
    gsap.fromTo(e.currentTarget, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    setTimeout(() => setAdded(false), 1400);
  };
  return (
    <div className="product-card [perspective:900px]">
      <div ref={card} data-cursor="card" onMouseMove={onMove} onMouseLeave={onLeave} className="group overflow-hidden rounded-3xl bg-card [transform-style:preserve-3d]">
        <div className="relative aspect-square overflow-hidden">
          <img src={p.image} alt={`${p.name} popcorn`} width={896} height={896} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest">{p.category}</span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl">{p.name}</h3>
            <span className="font-display text-2xl text-primary">{inr(p.price)}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
          <button onClick={onAdd} className="btn-gold mt-5 w-full justify-center">
            {added ? <><Check size={16} /> Added</> : <><Plus size={16} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Flavours() {
  const ref = useRef<HTMLElement>(null);
  const [cat, setCat] = useState<"All" | Category>("All");
  const cats: ("All" | Category)[] = ["All", "Classic", "Sweet", "Savoury"];
  const list = products.filter((p) => cat === "All" || p.category === cat);
  useReveal(ref);
  useGSAP(() => {
    if (reduced()) return;
    gsap.from(".product-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
  }, { scope: ref, dependencies: [cat] });
  return (
    <section id="flavours" ref={ref} className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p data-reveal className="eyebrow">Explore Our Flavours</p>
          <h2 data-reveal className="mt-4 text-[clamp(2.5rem,6vw,5rem)]">Pick your <span className="text-primary">pop.</span></h2>
        </div>
        <div data-reveal className="flex flex-wrap gap-2" role="tablist">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted-foreground/20"}`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Demo pricing shown — final prices to be confirmed.</p>
    </section>
  );
}

/* ---------- 3D EXPERIENCE ---------- */
export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current, start: "top bottom", end: "bottom top",
      onUpdate: (s) => { progress.current = s.progress; },
    });
    if (reduced()) return;
    gsap.fromTo(ref.current, { backgroundColor: "oklch(0.18 0.012 50)" }, { backgroundColor: "oklch(0.3 0.08 40)", ease: "none", scrollTrigger: { trigger: ref.current, start: "top center", end: "bottom center", scrub: true } });
    gsap.from(".exp-title", { y: 80, opacity: 0, scrollTrigger: { trigger: ref.current, start: "top 70%", end: "top 20%", scrub: true } });
  }, { scope: ref });
  return (
    <section ref={ref} className="relative overflow-hidden" aria-label="Interactive 3D popcorn bucket">
      <div className="mx-auto flex min-h-[110svh] max-w-7xl flex-col items-center justify-center px-5 py-24 text-center">
        <p className="eyebrow">Move your mouse · keep scrolling</p>
        <h2 className="exp-title mt-4 text-[clamp(2.5rem,7vw,6rem)]">Ready to pop into<br /><span className="text-primary">another world?</span></h2>
        <div className="h-[60vh] w-full max-w-4xl">
          <LazyScene progress={progress} kernels={40} />
        </div>
      </div>
    </section>
  );
}

/* ---------- WHY ---------- */
export function Why() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced()) return;
    gsap.from(".why-card", { y: 60, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" } });
  }, { scope: ref });
  const items = [
    { icon: Leaf, t: "Quality Ingredients", d: "Carefully selected ingredients for a satisfying snack." },
    { icon: Sparkles, t: "Irresistible Flavours", d: "From sweet to savoury, something for every craving." },
    { icon: Users, t: "Made for Sharing", d: "Perfect for movie nights, parties and everyday moments." },
    { icon: Heart, t: "Fresh Experience", d: "A delicious experience worth coming back for." },
  ];
  return (
    <section ref={ref} className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <p className="eyebrow">Why Choose Us</p>
      <h2 className="mt-4 max-w-3xl text-[clamp(2.5rem,6vw,5rem)]">Good popcorn. <span className="text-primary">Great moments.</span></h2>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: I, t, d }, i) => (
          <div key={t} className="why-card group rounded-3xl border bg-card p-7 transition-colors hover:border-primary/50">
            <div className={`grid h-14 w-14 place-items-center rounded-2xl ${i % 2 ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"} transition-transform duration-500 group-hover:rotate-12`}><I size={24} /></div>
            <h3 className="mt-8 text-2xl">{t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- BEST SELLERS ---------- */
export function BestSellers() {
  const ref = useRef<HTMLElement>(null);
  const { add } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  useReveal(ref);
  return (
    <section id="best-sellers" ref={ref} className="bg-cream text-cream-foreground">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <p data-reveal className="eyebrow text-caramel">Best Sellers & Combos</p>
        <h2 data-reveal className="mt-4 text-[clamp(2.5rem,6vw,5rem)]">More popcorn. <span className="text-caramel">More happiness.</span></h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {combos.map((c) => {
            const save = c.original - c.price;
            return (
              <article key={c.id} data-reveal data-cursor="card" className={`group flex flex-col overflow-hidden rounded-3xl bg-ink text-cream transition-transform duration-500 hover:-translate-y-2 ${c.bestSeller ? "ring-2 ring-primary" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {c.bestSeller && <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-primary-foreground">Best Seller</span>}
                  <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">Save {inr(save)}</span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="text-3xl">{c.name}</h3>
                  <ul className="mt-4 space-y-2 text-sm opacity-80">
                    {c.includes.map((i) => <li key={i} className="flex items-center gap-2"><Check size={14} className="text-primary" />{i}</li>)}
                  </ul>
                  <div className="mt-auto flex items-end justify-between pt-7">
                    <div>
                      <span className="block text-sm line-through opacity-50">{inr(c.original)}</span>
                      <span className="font-display text-4xl text-primary">{inr(c.price)}</span>
                    </div>
                    <button onClick={() => { add(c.id); setAdded(c.id); setTimeout(() => setAdded(null), 1400); }} className="btn-gold" data-magnetic>
                      {added === c.id ? <><Check size={16} /> Added</> : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-xs opacity-60">Sample offers with demo pricing. Savings compare against the demo single-pack prices.</p>
      </div>
    </section>
  );
}

/* ---------- REVIEWS ---------- */
export function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  useReveal(ref);
  const go = (d: number) => {
    const n = (i + d + reviews.length) % reviews.length;
    setI(n);
    const el = track.current?.children[n] as HTMLElement | undefined;
    if (el && track.current) track.current.scrollTo({ left: el.offsetLeft - track.current.offsetLeft, behavior: "smooth" });
  };
  return (
    <section id="reviews" ref={ref} className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p data-reveal className="eyebrow">Reviews</p>
          <h2 data-reveal className="mt-4 text-[clamp(2.5rem,6vw,5rem)]">The love is <span className="text-primary">popping!</span></h2>
        </div>
        <div className="flex gap-2">
          <button aria-label="Previous review" onClick={() => go(-1)} className="grid h-12 w-12 place-items-center rounded-full border hover:bg-secondary"><ChevronLeft /></button>
          <button aria-label="Next review" onClick={() => go(1)} className="grid h-12 w-12 place-items-center rounded-full border hover:bg-secondary"><ChevronRight /></button>
        </div>
      </div>
      <div ref={track} className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none]">
        {reviews.map((r) => (
          <figure key={r.name} data-reveal className="w-[85%] shrink-0 snap-start rounded-3xl border bg-card p-8 sm:w-[46%] lg:w-[32%]">
            <div className="flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} fill={k < r.rating ? "currentColor" : "none"} />)}</div>
            <blockquote className="mt-5 font-serif text-2xl leading-snug">“{r.text}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-bold">{r.name.slice(-1)}</span>
              <span><span className="block font-bold">{r.name}</span><span className="text-xs text-muted-foreground">Bought: {r.product}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Sample testimonials for layout only — real customer reviews will replace these.</p>
    </section>
  );
}

/* ---------- NEWSLETTER ---------- */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setStatus({ ok: false, msg: "Please enter a valid email address." });
    setStatus({ ok: false, msg: "Thanks! Sign-ups aren't switched on yet — your email was not saved. Check back soon." });
  };
  return (
    <section className="px-5 pb-24 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-primary p-10 text-primary-foreground md:p-16">
        <span aria-hidden className="pointer-events-none absolute -right-10 -top-16 text-[16rem] opacity-20">🍿</span>
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[clamp(2.2rem,5vw,4.2rem)]">Good things come in popping boxes.</h2>
            <p className="mt-4 max-w-md font-medium opacity-80">Get exclusive offers, new flavour updates and delicious surprises delivered to your inbox.</p>
          </div>
          <form onSubmit={submit} noValidate className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="nl-email" className="sr-only">Email address</label>
              <input id="nl-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setStatus(null); }} placeholder="your@email.com"
                aria-invalid={status && !status.ok ? true : undefined}
                className="flex-1 rounded-full border-2 border-ink/20 bg-cream px-6 py-4 font-semibold text-cream-foreground outline-none focus:border-ink" />
              <button className="btn-ink justify-center" data-magnetic>Subscribe</button>
            </div>
            {status && <p role="status" className="pl-2 text-sm font-semibold">{status.msg}</p>}
          </form>
        </div>
      </div>
      <div className="mx-auto mt-24 max-w-4xl text-center">
        <h2 className="text-[clamp(2.2rem,6vw,5rem)]">Your next favourite flavour is <span className="text-primary">waiting.</span></h2>
        <a href="#flavours" className="btn-gold mt-8" data-magnetic>Explore All Flavours <ArrowRight size={16} /></a>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
export function Footer() {
  const support = ["Contact Us", "FAQs", "Shipping Policy", "Refund Policy", "Privacy Policy", "Terms & Conditions"];
  const nav = [...NAV.filter((n) => n.id !== "reviews").map((n) => ({ ...n, label: n.id === "story" ? "About" : n.label })), { id: "contact", label: "Contact" }];
  return (
    <footer id="contact" className="border-t">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div>
          <Logo />
          <p className="mt-4 font-serif text-xl italic text-muted-foreground">Pop Beyond Ordinary.</p>
        </div>
        <div>
          <h3 className="eyebrow">Navigate</h3>
          <ul className="mt-4 space-y-2 text-sm">{nav.map((n) => <li key={n.id}><a href={`#${n.id}`} className="hover:text-primary">{n.label}</a></li>)}</ul>
        </div>
        <div>
          <h3 className="eyebrow">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{support.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div>
          <h3 className="eyebrow">Get in touch</h3>
          <p className="mt-4 text-sm">{contact.email}</p>
          <p className="text-sm">{contact.phone}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {socials.map((s) => s.url
              ? <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="rounded-full border px-3 py-1 text-xs hover:border-primary">{s.name}</a>
              : <span key={s.name} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">{s.name}</span>)}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between border-t px-5 py-6 text-xs text-muted-foreground md:px-8">
        <span>© {new Date().getFullYear()} POPCORN. All rights reserved.</span>
        <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-1" data-magnetic><ArrowUp size={18} /></button>
      </div>
    </footer>
  );
}
