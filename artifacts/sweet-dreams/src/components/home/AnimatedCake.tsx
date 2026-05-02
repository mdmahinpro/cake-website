import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const SPRINKLE_COLORS = [
  "#ff6b9d", "#00d4ff", "#ffd93d", "#6bcb77",
  "#ff9a3c", "#c77dff", "#ff4444", "#44eeff",
  "#ff8c42", "#a855f7",
];

/* Deterministic layout — no Math.random() so SSR-safe */
function buildSprinkles() {
  const regions = [
    { n: 14, x0: 22, xW: 150, y0: 177, yH: 44 },
    { n: 10, x0: 38, xW: 116, y0: 112, yH: 50 },
    { n:  7, x0: 58, xW:  74, y0:  66, yH: 34 },
  ];
  const primes = [17, 31, 47, 61, 79, 97, 113, 127, 149, 163, 181, 199, 211, 229, 241];
  const out: { id: number; x: number; y: number; rot: number; len: number; color: string; delay: number }[] = [];
  let id = 0;
  for (let ri = 0; ri < regions.length; ri++) {
    const r = regions[ri];
    for (let i = 0; i < r.n; i++) {
      const p1 = primes[(id * 3) % primes.length];
      const p2 = primes[(id * 7 + 2) % primes.length];
      const p3 = primes[(id * 11 + 5) % primes.length];
      out.push({
        id,
        x:   r.x0 + (id * p1 * 7) % r.xW,
        y:   r.y0 + (id * p2 * 3) % r.yH,
        rot: (id * p3 * 11) % 180,
        len: 5 + (id % 4),
        color: SPRINKLE_COLORS[(id + ri * 3) % SPRINKLE_COLORS.length],
        delay: 0.4 + id * 0.035,
      });
      id++;
    }
  }
  return out;
}

const STATIC_SPRINKLES = buildSprinkles();

const CANDLES = [
  { x: 72,  color: "#ff6b9d", delay: 2.0 },
  { x: 88,  color: "#00d4ff", delay: 2.25 },
  { x: 112, color: "#ffd93d", delay: 2.5 },
  { x: 128, color: "#6bcb77", delay: 2.75 },
];

export default function AnimatedCake() {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGo(true), 250);
    return () => clearTimeout(t);
  }, []);

  const sprinkles = useMemo(() => STATIC_SPRINKLES, []);

  function fadeIn(delay: number, y = 18) {
    return {
      initial: { opacity: 0, y },
      animate: go ? { opacity: 1, y: 0 } : { opacity: 0, y },
      transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    };
  }

  return (
    <svg
      viewBox="0 0 200 250"
      className="w-full h-full drop-shadow-2xl"
      aria-label="Animated birthday cake"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="cakeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff8e8" />
          <stop offset="100%" stopColor="#fce5c0" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f4f4f4" />
          <stop offset="100%" stopColor="#d4d4d4" />
        </linearGradient>
        <radialGradient id="flameGrad" cx="50%" cy="65%">
          <stop offset="0%"   stopColor="#fff9c4" />
          <stop offset="45%"  stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ff6d00" stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id="glowBg" cx="50%" cy="60%">
          <stop offset="0%"   stopColor="#00beff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00beff" stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#00beff" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="100" cy="200" rx="90" ry="60" fill="url(#glowBg)" />

      {/* Plate stand */}
      <motion.rect
        x="82" y="228" width="36" height="16" rx="4" fill="#ddd"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      />
      {/* Plate top */}
      <motion.ellipse
        cx="100" cy="234" rx="84" ry="12" fill="url(#plateGrad)"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={go ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 22 }}
        style={{ transformOrigin: "100px 234px" }}
      />

      {/* ── Layer 1 (bottom / widest) ── */}
      <motion.rect
        x="15" y="173" width="170" height="58" rx="11"
        fill="url(#cakeGrad)" filter="url(#softShadow)"
        {...fadeIn(0.3)}
      />

      {/* Frosting drips between L1 and L2 */}
      <motion.path
        d="M28,158 L172,158 L172,173
           Q165.5,192 159,173 Q152.5,192 146,173 Q139.5,192 133,173
           Q126.5,192 120,173 Q113.5,192 107,173 Q100.5,192 94,173
           Q87.5,192 81,173 Q74.5,192 68,173 Q61.5,192 55,173
           Q48.5,192 42,173 L28,158 Z"
        fill="white"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.82, duration: 0.4 }}
      />

      {/* ── Layer 2 (middle) ── */}
      <motion.rect
        x="33" y="108" width="134" height="65" rx="11"
        fill="url(#cakeGrad)"
        {...fadeIn(1.0)}
      />

      {/* Frosting drips between L2 and L3 */}
      <motion.path
        d="M44,95 L156,95 L156,108
           Q151,124 146,108 Q141,124 136,108 Q131,124 126,108
           Q121,124 116,108 Q111,124 106,108 Q101,124 96,108
           Q91,124 86,108 Q81,124 76,108 Q71,124 66,108
           Q61,124 56,108 L44,95 Z"
        fill="white"
        initial={{ opacity: 0 }}
        animate={go ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.52, duration: 0.4 }}
      />

      {/* ── Layer 3 (top / smallest) ── */}
      <motion.rect
        x="55" y="62" width="90" height="46" rx="11"
        fill="url(#cakeGrad)"
        {...fadeIn(1.65)}
      />

      {/* Top frosting rosettes */}
      {[76, 100, 124].map((cx, i) => (
        <motion.circle
          key={cx} cx={cx} cy={60} r={11}
          fill="white"
          initial={{ opacity: 0, scale: 0 }}
          animate={go ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 1.95 + i * 0.12, type: "spring", stiffness: 280, damping: 18 }}
          style={{ transformOrigin: `${cx}px 60px` }}
        />
      ))}
      {/* Center highlight on rosettes */}
      {[76, 100, 124].map((cx, i) => (
        <motion.circle
          key={`hl-${cx}`} cx={cx} cy={57} r={5}
          fill="rgba(255,255,255,0.9)"
          initial={{ opacity: 0 }}
          animate={go ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.1 + i * 0.1, duration: 0.3 }}
        />
      ))}

      {/* ── Candles + flickering flames ── */}
      {CANDLES.map((c) => (
        <motion.g
          key={c.x}
          initial={{ opacity: 0 }}
          animate={go ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: c.delay, duration: 0.3 }}
        >
          {/* Candle body */}
          <rect x={c.x - 4} y="28" width="8" height="36" rx="4" fill={c.color} />
          {/* White highlight stripe */}
          <rect x={c.x - 2} y="31" width="2.5" height="26" rx="1.5" fill="rgba(255,255,255,0.35)" />
          {/* Wick */}
          <line x1={c.x} y1="22" x2={c.x} y2="29" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />

          {/* Flame (continuous flicker via SVG translate + framer-motion) */}
          <g transform={`translate(${c.x} 16)`}>
            <motion.g
              animate={{
                scaleX: [1, 0.72, 1.25, 0.85, 1.05, 1],
                scaleY: [1, 1.35, 0.75, 1.25, 0.9, 1],
              }}
              transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "0px 0px" }}
            >
              <ellipse cx="0" cy="0" rx="4.5" ry="9" fill="url(#flameGrad)" />
              <ellipse cx="0" cy="2" rx="2"   ry="4.5" fill="#fff9c4" opacity="0.9" />
            </motion.g>
          </g>
        </motion.g>
      ))}

      {/* ── Sprinkles ── */}
      {sprinkles.map((s) => (
        <motion.rect
          key={s.id}
          x={s.x} y={s.y}
          width={s.len} height="3" rx="1.5"
          fill={s.color}
          transform={`rotate(${s.rot} ${s.x + s.len / 2} ${s.y + 1.5})`}
          initial={{ opacity: 0 }}
          animate={go ? { opacity: 0.9 } : { opacity: 0 }}
          transition={{ delay: s.delay, duration: 0.35 }}
        />
      ))}
    </svg>
  );
}
