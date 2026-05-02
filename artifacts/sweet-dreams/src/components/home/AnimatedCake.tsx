import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRINKLE_COLORS = [
  "#ff6b9d", "#00d4ff", "#ffd93d", "#6bcb77",
  "#ff9a3c", "#c77dff", "#ff4444", "#44eeff",
];

function buildSprinkles() {
  const primes = [17, 31, 47, 61, 79, 97, 113, 127, 149, 163, 181, 199];
  const regions = [
    { n: 14, x0: 22, xW: 150, y0: 172, yH: 44 },
    { n: 10, x0: 38, xW: 116, y0: 112, yH: 50 },
    { n:  7, x0: 58, xW:  74, y0:  64, yH: 34 },
  ];
  const out: { id: number; x: number; y: number; rot: number; len: number; color: string }[] = [];
  let id = 0;
  for (let ri = 0; ri < regions.length; ri++) {
    const r = regions[ri];
    for (let i = 0; i < r.n; i++) {
      out.push({
        id,
        x:   r.x0 + (id * primes[(id * 3) % primes.length] * 7) % r.xW,
        y:   r.y0 + (id * primes[(id * 7 + 2) % primes.length] * 3) % r.yH,
        rot: (id * primes[(id * 11 + 5) % primes.length] * 11) % 180,
        len: 5 + (id % 4),
        color: SPRINKLE_COLORS[(id + ri * 3) % SPRINKLE_COLORS.length],
      });
      id++;
    }
  }
  return out;
}

const STATIC_SPRINKLES = buildSprinkles();
const CANDLES = [
  { x: 72,  color: "#ff6b9d" },
  { x: 88,  color: "#00d4ff" },
  { x: 112, color: "#ffd93d" },
  { x: 128, color: "#6bcb77" },
];

// 0=idle 1=bowl+ingredients 2=mixing 3=oven 4=layers 5=decorate
export default function AnimatedCake() {
  const [phase, setPhase] = useState(0);
  const sprinkles = useMemo(() => STATIC_SPRINKLES, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 1900),
      setTimeout(() => setPhase(3), 3400),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <svg
      viewBox="0 0 200 260"
      className="w-full h-full drop-shadow-2xl"
      aria-label="Cake baking animation"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="cakeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="100%" stopColor="#fce5c0" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f4f4" />
          <stop offset="100%" stopColor="#d4d4d4" />
        </linearGradient>
        <radialGradient id="flameGrad" cx="50%" cy="65%">
          <stop offset="0%"   stopColor="#fff9c4" />
          <stop offset="45%"  stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ff6d00" stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id="glowBg" cx="50%" cy="60%">
          <stop offset="0%"   stopColor="#00beff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#00beff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ovenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ff9a3c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6d00" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="bowlGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8ecff" />
          <stop offset="100%" stopColor="#a8cfe8" />
        </linearGradient>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#00beff" floodOpacity="0.2" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient glow (always) */}
      <ellipse cx="100" cy="210" rx="88" ry="55" fill="url(#glowBg)" />

      {/* ══ SCENE 1 + 2 : BOWL ══ */}
      <AnimatePresence>
        {(phase >= 1 && phase <= 3) && (
          <motion.g
            key="bowl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.85 }}
            transition={{ duration: 0.6 }}
          >
            {/* Bowl body */}
            <path
              d="M35,128 C33,165 42,200 100,205 C158,200 167,165 165,128 Z"
              fill="url(#bowlGrad)"
              opacity="0.95"
            />
            {/* Bowl rim */}
            <ellipse cx="100" cy="128" rx="65" ry="11" fill="#e0f0ff" />
            <ellipse cx="100" cy="128" rx="65" ry="11" fill="none" stroke="#c5dff5" strokeWidth="1.5" />
            {/* Bowl highlight */}
            <path
              d="M42,138 C42,165 48,192 70,202"
              fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round"
            />

            {/* Batter fill (appears in phase 2) */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.ellipse
                  key="batter"
                  cx="100" cy="182"
                  rx="52" ry="14"
                  fill="#f5c56a"
                  opacity="0.85"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformOrigin: "100px 182px" }}
                />
              )}
            </AnimatePresence>

            {/* Swirl path in bowl (phase 2) */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.g
                  key="swirl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.path
                    d="M100,175 C112,172 118,178 110,183 C102,188 90,183 94,178 C98,173 108,173 108,178"
                    fill="none"
                    stroke="#e8a840"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 1.8, repeat: 1, ease: "linear" }}
                    style={{ transformOrigin: "100px 180px" }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Whisk (phase 2) */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.g
                  key="whisk"
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: [-30, 20, -30] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, repeat: 1 }}
                  style={{ transformOrigin: "130px 130px" }}
                >
                  {/* Whisk handle */}
                  <line x1="130" y1="75" x2="116" y2="155" stroke="#8a7a6a" strokeWidth="3" strokeLinecap="round" />
                  {/* Whisk wires */}
                  <ellipse cx="113" cy="158" rx="8" ry="14" fill="none" stroke="#aaa" strokeWidth="1.5" />
                  <line x1="110" y1="152" x2="116" y2="168" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="116" y1="152" x2="112" y2="168" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Ingredients dropping in (phase 1) */}
            {[
              { x: 80,  startY: 60,  color: "#fff8dc", r: 10, label: "flour",  delay: 0 },
              { x: 115, startY: 40,  color: "#ffe4b5", r: 8,  label: "butter", delay: 0.3 },
              { x: 95,  startY: 50,  color: "#ffec8b", r: 7,  label: "egg",    delay: 0.6 },
            ].map((ing) => (
              <motion.circle
                key={ing.label}
                cx={ing.x}
                cy={ing.startY}
                r={ing.r}
                fill={ing.color}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.5"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 80, opacity: [0, 1, 1, 0] }}
                transition={{ delay: ing.delay, duration: 0.9, ease: "easeIn" }}
              />
            ))}

            {/* Flour puff */}
            <motion.ellipse
              cx="78" cy="125"
              rx="14" ry="6"
              fill="rgba(255,255,255,0.6)"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 0.6, 0], scaleX: [0, 1.5, 0] }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ transformOrigin: "78px 125px" }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ══ SCENE 3 : OVEN ══ */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.g
            key="oven"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ duration: 0.6 }}
            style={{ transformOrigin: "100px 150px" }}
          >
            {/* Oven body */}
            <rect x="22" y="60" width="156" height="155" rx="14"
              fill="#0d1e30" stroke="#00beff" strokeWidth="1.5"
            />
            {/* Control panel */}
            <rect x="22" y="60" width="156" height="28" rx="14" fill="#0a1825" />
            <rect x="22" y="74" width="156" height="14" rx="0" fill="#0a1825" />
            {/* Knobs */}
            {[55, 100, 145].map((kx) => (
              <g key={kx}>
                <circle cx={kx} cy="74" r="9" fill="#132534" stroke="#00beff" strokeWidth="1" />
                <motion.line
                  x1={kx} y1="68" x2={kx} y2="65"
                  stroke="#00beff" strokeWidth="1.5" strokeLinecap="round"
                  animate={{ rotate: [0, 270] }}
                  transition={{ delay: 0.2, duration: 1.2, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: `${kx}px 74px` }}
                />
              </g>
            ))}
            {/* Oven door frame */}
            <rect x="36" y="96" width="128" height="106" rx="10" fill="#071320" />
            {/* Oven window */}
            <rect x="50" y="108" width="100" height="78" rx="8" fill="url(#ovenGlow)" />
            {/* Window sheen */}
            <rect x="50" y="108" width="100" height="78" rx="8"
              fill="none" stroke="rgba(255,150,60,0.4)" strokeWidth="1"
            />
            {/* Cake pan inside oven */}
            <rect x="62" y="148" width="76" height="26" rx="5" fill="#c8a06a" />
            <rect x="62" y="140" width="76" height="12" rx="3" fill="#dbb87a" />
            {/* Pan handles */}
            <rect x="56" y="142" width="8" height="8" rx="2" fill="#b8906a" />
            <rect x="136" y="142" width="8" height="8" rx="2" fill="#b8906a" />
            {/* Rising cake bump */}
            <motion.path
              d="M65,140 Q100,118 135,140"
              fill="#f5d088"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
            {/* Door handle */}
            <rect x="78" y="193" width="44" height="7" rx="3.5" fill="#00beff" opacity="0.8" />
            {/* Heat waves rising from top */}
            {[65, 85, 105, 125, 145].map((wx, wi) => (
              <motion.path
                key={wx}
                d={`M${wx},58 C${wx - 4},50 ${wx + 4},42 ${wx},34`}
                fill="none"
                stroke="#ff9a3c"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
                animate={{ y: [-2, -8, -2], opacity: [0.7, 0.2, 0.7] }}
                transition={{ delay: wi * 0.15, duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            {/* Temperature display */}
            <rect x="110" y="64" width="40" height="14" rx="3" fill="#001020" />
            <text x="130" y="74" textAnchor="middle" fontSize="8" fill="#ff9a3c" fontFamily="monospace">180°C</text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* ══ SCENE 4 + 5 : CAKE ASSEMBLY ══ */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.g
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Plate */}
            <motion.rect
              x="82" y="232" width="36" height="15" rx="4" fill="#ddd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            />
            <motion.ellipse
              cx="100" cy="237" rx="82" ry="11" fill="url(#plateGrad)"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 22 }}
              style={{ transformOrigin: "100px 237px" }}
            />

            {/* Layer 1 (bottom, widest) — drops in */}
            <motion.rect
              x="15" y="175" width="170" height="58" rx="11"
              fill="url(#cakeGrad)" filter="url(#softShadow)"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* Frosting drips L1 */}
            <motion.path
              d="M28,160 L172,160 L172,175 Q165,193 159,175 Q152,193 146,175 Q139,193 133,175 Q126,193 120,175 Q113,193 107,175 Q100,193 94,175 Q87,193 81,175 Q74,193 68,175 Q61,193 55,175 Q48,193 42,175 L28,160 Z"
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
            />

            {/* Layer 2 (middle) — drops in */}
            <motion.rect
              x="33" y="110" width="134" height="65" rx="11"
              fill="url(#cakeGrad)"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* Frosting drips L2 */}
            <motion.path
              d="M44,97 L156,97 L156,110 Q151,126 146,110 Q141,126 136,110 Q131,126 126,110 Q121,126 116,110 Q111,126 106,110 Q101,126 96,110 Q91,126 86,110 Q81,126 76,110 Q71,126 66,110 Q61,126 56,110 L44,97 Z"
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.4 }}
            />

            {/* Layer 3 (top) — drops in */}
            <motion.rect
              x="55" y="62" width="90" height="48" rx="11"
              fill="url(#cakeGrad)"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* Rosettes (phase 5) */}
            {phase >= 5 && [76, 100, 124].map((cx, i) => (
              <motion.g key={cx}>
                <motion.circle
                  cx={cx} cy={59} r={12}
                  fill="white"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.12, type: "spring", stiffness: 280, damping: 18 }}
                  style={{ transformOrigin: `${cx}px 59px` }}
                />
                <motion.circle
                  cx={cx} cy={56} r={5}
                  fill="rgba(255,255,255,0.95)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
                />
              </motion.g>
            ))}

            {/* Candles + flames (phase 5) */}
            {phase >= 5 && CANDLES.map((c, ci) => (
              <motion.g
                key={c.x}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + ci * 0.2, type: "spring", stiffness: 300 }}
              >
                <rect x={c.x - 4} y="28" width="8" height="36" rx="4" fill={c.color} />
                <rect x={c.x - 2} y="31" width="2.5" height="26" rx="1.5" fill="rgba(255,255,255,0.35)" />
                <line x1={c.x} y1="22" x2={c.x} y2="29" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
                <g transform={`translate(${c.x} 16)`}>
                  <motion.g
                    animate={{ scaleX: [1, 0.72, 1.25, 0.85, 1.05, 1], scaleY: [1, 1.35, 0.75, 1.25, 0.9, 1] }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut", delay: ci * 0.12 }}
                    style={{ transformOrigin: "0px 0px" }}
                  >
                    <ellipse cx="0" cy="0" rx="4.5" ry="9" fill="url(#flameGrad)" />
                    <ellipse cx="0" cy="2" rx="2" ry="4.5" fill="#fff9c4" opacity="0.9" />
                  </motion.g>
                </g>
              </motion.g>
            ))}

            {/* Sprinkles (phase 5) */}
            {phase >= 5 && sprinkles.map((s, si) => (
              <motion.rect
                key={s.id}
                x={s.x} y={s.y}
                width={s.len} height="3" rx="1.5"
                fill={s.color}
                transform={`rotate(${s.rot} ${s.x + s.len / 2} ${s.y + 1.5})`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ delay: si * 0.03, duration: 0.3, type: "spring" }}
                style={{ transformOrigin: `${s.x + s.len / 2}px ${s.y + 1.5}px` }}
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* Phase label */}
      <AnimatePresence mode="wait">
        {phase === 1 && (
          <motion.text key="l1" x="100" y="255" textAnchor="middle" fontSize="10"
            fill="#00beff" opacity="0.7" fontFamily="sans-serif"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >Gathering ingredients…</motion.text>
        )}
        {phase === 2 && (
          <motion.text key="l2" x="100" y="255" textAnchor="middle" fontSize="10"
            fill="#00beff" opacity="0.7" fontFamily="sans-serif"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >Mixing the batter…</motion.text>
        )}
        {phase === 3 && (
          <motion.text key="l3" x="100" y="255" textAnchor="middle" fontSize="10"
            fill="#ff9a3c" opacity="0.8" fontFamily="sans-serif"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >Baking to perfection…</motion.text>
        )}
        {phase === 4 && (
          <motion.text key="l4" x="100" y="255" textAnchor="middle" fontSize="10"
            fill="#00beff" opacity="0.7" fontFamily="sans-serif"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >Stacking layers…</motion.text>
        )}
        {phase === 5 && (
          <motion.text key="l5" x="100" y="255" textAnchor="middle" fontSize="10"
            fill="#ffd93d" opacity="0.9" fontFamily="sans-serif"
            initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >Your dream cake is ready!</motion.text>
        )}
      </AnimatePresence>
    </svg>
  );
}
