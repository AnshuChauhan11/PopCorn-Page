import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { findItem, inr } from "@/data/products";

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, total } = useCart();
  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside role="dialog" aria-label="Shopping bag" className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-500 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-3xl">Your Bag</h2>
          <button aria-label="Close bag" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><X size={20} /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {lines.length === 0 && <p className="pt-10 text-center text-muted-foreground">Your bag is empty. Time to pop something in!</p>}
          {lines.map((l) => {
            const item = findItem(l.id); if (!item) return null;
            return (
              <div key={l.id} className="flex gap-4 rounded-2xl bg-secondary p-3">
                <img src={item.image} alt={item.name} width={80} height={80} className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <p className="font-bold">{item.name}</p>
                    <button aria-label={`Remove ${item.name}`} onClick={() => remove(l.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border px-2 py-1">
                      <button aria-label="Decrease" onClick={() => setQty(l.id, l.qty - 1)}><Minus size={14} /></button>
                      <span className="w-5 text-center text-sm font-bold">{l.qty}</span>
                      <button aria-label="Increase" onClick={() => setQty(l.id, l.qty + 1)}><Plus size={14} /></button>
                    </div>
                    <span className="font-bold text-primary">{inr(item.price * l.qty)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-3 border-t p-6">
          <div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{inr(total)}</span></div>
          <button disabled className="btn-gold w-full justify-center opacity-60">Checkout</button>
          <p className="text-center text-xs text-muted-foreground">Online payment isn't connected yet — checkout will open once a payment provider (e.g. Razorpay) is set up. Prices shown are demo prices.</p>
        </div>
      </aside>
    </div>
  );
}
