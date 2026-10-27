import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { findItem } from "@/data/products";

type Line = { id: string; qty: number };
type Ctx = {
  lines: Line[]; count: number; total: number; open: boolean; bump: number;
  setOpen: (o: boolean) => void; add: (id: string) => void; setQty: (id: string, q: number) => void; remove: (id: string) => void;
};
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const add = useCallback((id: string) => {
    setLines((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { id, qty: 1 }]));
    setBump((b) => b + 1);
  }, []);
  const setQty = useCallback((id: string, q: number) => {
    setLines((ls) => (q <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: q } : l))));
  }, []);
  const remove = useCallback((id: string) => setLines((ls) => ls.filter((l) => l.id !== id)), []);
  const value = useMemo(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => s + (findItem(l.id)?.price ?? 0) * l.qty, 0);
    return { lines, count, total, open, bump, setOpen, add, setQty, remove };
  }, [lines, open, bump, add, setQty, remove]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
