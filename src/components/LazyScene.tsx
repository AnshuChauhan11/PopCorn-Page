import { lazy, Suspense, useEffect, useState, type MutableRefObject } from "react";
import fallback from "@/assets/story.jpg";

const PopcornScene = lazy(() => import("@/three/PopcornScene"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export function LazyScene(props: { progress?: MutableRefObject<number> | undefined; intro?: boolean; kernels?: number | undefined }) {
  const [state, setState] = useState<"pending" | "ok" | "none">("pending");
  useEffect(() => setState(hasWebGL() ? "ok" : "none"), []);
  if (state === "none")
    return <img src={fallback} alt="Caramel popcorn spilling from a striped POPCORN bucket" className="h-full w-full rounded-3xl object-cover" />;
  if (state === "pending") return <div className="h-full w-full" />;
  const kernels = typeof window !== "undefined" && window.innerWidth < 768 ? Math.round((props.kernels ?? 24) / 2) : props.kernels;
  return (
    <Suspense fallback={<div className="h-full w-full" />}>
      <PopcornScene {...props} kernels={kernels} />
    </Suspense>
  );
}
