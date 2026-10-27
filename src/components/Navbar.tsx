import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import gsap from "gsap";
import { useCart } from "@/hooks/use-cart";

export const NAV = [
  { id: "home", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "flavours", label: "Flavours" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "reviews", label: "Reviews" },
];

export function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2 font-display text-2xl tracking-wide">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-base text-primary-foreground">🍿</span>
      POPCORN
    </a>
  );
}

export function Navbar() {
  const { count, setOpen, bump } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  useEffect(() => {
    if (bump && badge.current) gsap.fromTo(badge.current, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
  }, [bump]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "glass py-3" : "py-6"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className={`relative text-sm font-semibold transition-colors ${active === n.id ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}>
                {n.label}
                <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-primary transition-all duration-300 ${active === n.id ? "w-full" : "w-0"}`} />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex items-center">
            {search && (
              <input autoFocus placeholder="Search flavours…" onKeyDown={(e) => { if (e.key === "Enter") { document.getElementById("flavours")?.scrollIntoView(); setSearch(false); } }}
                className="absolute right-10 w-44 rounded-full border border-input bg-background/80 px-4 py-2 text-sm outline-none focus:border-primary" />
            )}
            <button aria-label="Search" onClick={() => setSearch((s) => !s)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><Search size={18} /></button>
          </div>
          <button aria-label={`Cart, ${count} items`} onClick={() => setOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary">
            <ShoppingBag size={18} />
            <span ref={badge} className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>
          </button>
          <a href="#flavours" className="btn-gold hidden md:inline-flex" data-magnetic>Shop Now</a>
          <button aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary lg:hidden" onClick={() => setMenu((m) => !m)}>
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      <div className={`overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden ${menu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="glass mx-5 mt-3 flex flex-col gap-1 rounded-2xl p-4">
          {NAV.map((n) => (
            <li key={n.id}><a onClick={() => setMenu(false)} href={`#${n.id}`} className="block rounded-xl px-4 py-3 font-display text-2xl hover:bg-secondary">{n.label}</a></li>
          ))}
          <li><a onClick={() => setMenu(false)} href="#flavours" className="btn-gold mt-2 w-full justify-center">Shop Now</a></li>
        </ul>
      </div>
    </header>
  );
}
