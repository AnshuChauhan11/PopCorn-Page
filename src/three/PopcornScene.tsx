import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

function makeLabelTexture() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 512;
  const g = c.getContext("2d")!;
  const stripes = 16;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 ? "#FFF4D9" : "#B8322A";
    g.fillRect((i * c.width) / stripes, 0, c.width / stripes + 1, c.height);
  }
  // gold band
  g.fillStyle = "#17120F"; g.fillRect(0, 170, c.width, 170);
  g.fillStyle = "#F5B82E"; g.fillRect(0, 170, c.width, 8); g.fillRect(0, 332, c.width, 8);
  g.font = "bold 110px Anton, Impact, sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "#F5B82E";
  g.fillText("POPCORN", c.width * 0.25, 258);
  g.fillText("POPCORN", c.width * 0.75, 258);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function popGeometry() {
  const g = new THREE.IcosahedronGeometry(1, 1);
  const p = g.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = 0.75 + 0.35 * Math.abs(Math.sin(v.x * 5.1) * Math.cos(v.y * 4.3 + v.z * 3.7));
    v.multiplyScalar(n);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

const R_TOP = 1.15, R_BOT = 0.8, H = 2.2;

function Bucket() {
  const tex = useMemo(makeLabelTexture, []);
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(R_TOP, R_BOT, H, 64, 1, true);
    return g;
  }, []);
  const pile = useMemo(popGeometry, []);
  const pileRef = useRef<THREE.InstancedMesh>(null);
  const COUNT = 140;
  useEffect(() => {
    const m = pileRef.current; if (!m) return;
    const d = new THREE.Object3D(); const col = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const r = Math.sqrt(Math.random()) * R_TOP * 1.02;
      const a = Math.random() * Math.PI * 2;
      const dome = Math.cos((r / (R_TOP * 1.05)) * Math.PI * 0.5) * 0.75;
      d.position.set(Math.cos(a) * r, H / 2 - 0.05 + dome * Math.random() * 1.1, Math.sin(a) * r);
      d.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      d.scale.setScalar(0.13 + Math.random() * 0.08);
      d.updateMatrix(); m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, col.set(Math.random() > 0.25 ? "#FFF1C8" : "#F0C76A"));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, []);
  useEffect(() => () => { tex.dispose(); geo.dispose(); pile.dispose(); }, [tex, geo, pile]);
  return (
    <group>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial map={tex} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -H / 2, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[R_BOT, 48]} />
        <meshStandardMaterial color="#8a2420" />
      </mesh>
      <mesh position={[0, H / 2, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[R_TOP, 0.035, 12, 64]} />
        <meshStandardMaterial color="#F5B82E" metalness={0.6} roughness={0.3} />
      </mesh>
      <instancedMesh ref={pileRef} args={[pile, undefined, COUNT]} castShadow>
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
    </group>
  );
}

function FloatingKernels({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(popGeometry, []);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({
      r: 2 + Math.random() * 2.2, a: Math.random() * Math.PI * 2, y: -1 + Math.random() * 4,
      s: 0.1 + Math.random() * 0.12, sp: 0.15 + Math.random() * 0.35, ph: Math.random() * 6,
    })), [count]);
  const d = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    const m = ref.current; if (!m) return;
    const c = new THREE.Color();
    seeds.forEach((_, i) => m.setColorAt(i, c.set(i % 3 ? "#FFF1C8" : "#F5B82E")));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [seeds]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(({ clock }) => {
    const m = ref.current; if (!m) return;
    const t = clock.elapsedTime;
    seeds.forEach((k, i) => {
      const a = k.a + t * k.sp * 0.3;
      d.position.set(Math.cos(a) * k.r, k.y + Math.sin(t * k.sp + k.ph) * 0.4, Math.sin(a) * k.r - 0.5);
      d.rotation.set(t * k.sp, t * k.sp * 0.7, k.ph);
      d.scale.setScalar(k.s);
      d.updateMatrix(); m.setMatrixAt(i, d.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  );
}

function Rig({ progress, intro }: { progress?: MutableRefObject<number> | undefined; intro: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const t0 = useRef<number | null>(null);
  useEffect(() => {
    const f = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", f, { passive: true });
    return () => window.removeEventListener("pointermove", f);
  }, []);
  useFrame(({ clock, camera }, raw) => {
    const dt = Math.min(raw, 0.05);
    const g = group.current; if (!g) return;
    if (t0.current === null) t0.current = clock.elapsedTime;
    const life = clock.elapsedTime - t0.current;
    const p = progress?.current ?? 0;
    const enter = intro ? Math.min(1, life / 1.4) : 1;
    const e = 1 - Math.pow(1 - enter, 3);
    const k = 1 - Math.exp(-4 * dt);
    const targetY = clock.elapsedTime * 0.25 + mouse.current.x * 0.6 + p * Math.PI * 2 + (1 - e) * -2;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (mouse.current.y * 0.15 + 0.1 - g.rotation.x) * k;
    g.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.08;
    g.scale.setScalar(0.4 + 0.6 * e);
    if (progress) {
      camera.position.z = 7.5 - p * 2.5;
      camera.position.y = 1.2 + p * 0.6;
      camera.lookAt(0, 0.4, 0);
    }
  });
  return (
    <group ref={group}>
      <Bucket />
    </group>
  );
}

export default function PopcornScene({ progress, intro = false, kernels = 24 }: {
  progress?: MutableRefObject<number> | undefined; intro?: boolean; kernels?: number | undefined;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 1.2, 7.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} color="#FFE2A8" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-4, 1, 2]} intensity={12} color="#C85B32" />
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.2} color="#F5B82E" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={0.8} color="#FFF4D9" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
        </Environment>
        <Rig progress={progress} intro={intro} />
        <FloatingKernels count={kernels} />
        <ContactShadows position={[0, -1.25, 0]} opacity={0.55} scale={8} blur={2.6} far={3} color="#000000" />
      </Canvas>
    </div>
  );
}
