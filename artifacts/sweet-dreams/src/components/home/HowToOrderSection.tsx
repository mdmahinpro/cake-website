import { motion } from "framer-motion";
import AnimatedSection from "../shared/AnimatedSection";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";
import { useT } from "../../i18n/translations";

function BrowseIllustration({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full" aria-hidden>
      {[
        { x: 8,  y: 12, color: "#ff6b9d", delay: 0 },
        { x: 66, y: 12, color: "#ffd93d", delay: 0.15 },
        { x: 8,  y: 56, color: accent,    delay: 0.3 },
        { x: 66, y: 56, color: "#6bcb77", delay: 0.45 },
      ].map((c, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: c.delay, type: "spring", stiffness: 260 }}
          style={{ transformOrigin: `${c.x + 24}px ${c.y + 20}px` }}
        >
          <rect x={c.x} y={c.y} width="46" height="36" rx="7" fill={c.color} opacity="0.25" />
          <rect x={c.x} y={c.y} width="46" height="36" rx="7" fill="none" stroke={c.color} strokeWidth="1.5" />
          <rect x={c.x + 10} y={c.y + 18} width="26" height="12" rx="3" fill={c.color} opacity="0.7" />
          <rect x={c.x + 14} y={c.y + 12} width="18" height="8"  rx="2" fill={c.color} opacity="0.5" />
          <circle cx={c.x + 18} cy={c.y + 10} r="2" fill="#ffd93d" />
          <circle cx={c.x + 23} cy={c.y + 10} r="2" fill="#ff6b9d" />
          <circle cx={c.x + 28} cy={c.y + 10} r="2" fill={accent} />
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0, x: 10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
        <circle cx="85" cy="72" r="18" fill="none" stroke={accent} strokeWidth="3" opacity="0.9" />
        <circle cx="85" cy="72" r="18" fill={accent} fillOpacity="0.08" />
        <line x1="97" y1="85" x2="108" y2="96" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
        <motion.circle cx="85" cy="72" r="5" fill={accent} opacity="0.5"
          animate={{ r: [5, 7, 5], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
      </motion.g>
    </svg>
  );
}

function OrderIllustration({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full" aria-hidden>
      <rect x="30" y="5"  width="60" height="90" rx="12" fill="#0d1e2d" stroke={`${accent}55`} strokeWidth="1.5" />
      <rect x="34" y="14" width="52" height="72" rx="6"  fill="#071320" />
      <rect x="45" y="6"  width="30" height="4"  rx="2"  fill="#132534" />
      <rect x="34" y="14" width="52" height="16" rx="3"  fill="#128c7e" />
      <circle cx="44" cy="22" r="5" fill="rgba(255,255,255,0.35)" />
      <rect x="52" y="19" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
      <rect x="52" y="24" width="14" height="2" rx="1"   fill="rgba(255,255,255,0.35)" />
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
        <rect x="36" y="34" width="36" height="14" rx="6" fill="#1e3d2e" />
        <rect x="36" y="34" width="36" height="14" rx="6" fill="none" stroke="#128c7e" strokeWidth="0.8" />
        <rect x="39" y="38" width="24" height="2.5" rx="1.25" fill="rgba(255,255,255,0.5)" />
        <rect x="39" y="43" width="18" height="2"   rx="1"    fill="rgba(255,255,255,0.3)" />
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
        <rect x="50" y="52" width="34" height="18" rx="6" fill="#128c7e" />
        <rect x="53" y="55" width="22" height="2.5" rx="1.25" fill="rgba(255,255,255,0.7)" />
        <rect x="53" y="59.5" width="18" height="2" rx="1"   fill="rgba(255,255,255,0.5)" />
        <rect x="53" y="64"   width="14" height="2" rx="1"   fill="rgba(255,255,255,0.4)" />
        <path d="M84,64 L87,67" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <rect x="36" y="74" width="22" height="11" rx="5.5" fill="#132534" />
        {[42, 47, 52].map((dx, di) => (
          <motion.circle key={di} cx={dx} cy="79.5" r="2" fill={accent}
            animate={{ y: [0, -2.5, 0] }}
            transition={{ delay: di * 0.2, duration: 0.8, repeat: Infinity }} />
        ))}
      </motion.g>
    </svg>
  );
}

function ReceiveIllustration({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-full" aria-hidden>
      <motion.g initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
        <rect x="28" y="50" width="64" height="42" rx="6" fill="#031525" stroke={accent} strokeWidth="1.5" />
        <rect x="22" y="40" width="76" height="14" rx="5" fill="#051e36" stroke={accent} strokeWidth="1.5" />
        <rect x="55" y="40" width="10" height="52" rx="2" fill={accent} opacity="0.6" />
        <rect x="22" y="44" width="76" height="6" rx="2" fill={accent} opacity="0.6" />
        <motion.path d="M60,40 Q44,22 36,30 Q32,36 60,40" fill={accent} opacity="0.8"
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: "48px 35px" }} />
        <motion.path d="M60,40 Q76,22 84,30 Q88,36 60,40" fill={accent} opacity="0.8"
          animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.15 }}
          style={{ transformOrigin: "72px 35px" }} />
        <circle cx="60" cy="40" r="5" fill={accent} />
        <motion.path d="M46,71 L55,80 L74,62" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }} />
      </motion.g>
      {[{ cx: 15, cy: 25, delay: 1.2 }, { cx: 105, cy: 20, delay: 1.4 }, { cx: 18, cy: 65, delay: 1.6 }, { cx: 108, cy: 58, delay: 1.3 }].map((s, si) => (
        <motion.g key={si} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ delay: s.delay, duration: 1.0, repeat: Infinity, repeatDelay: 1.5 }}
          style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}>
          <line x1={s.cx - 5} y1={s.cy} x2={s.cx + 5} y2={s.cy} stroke="#ffd93d" strokeWidth="2" strokeLinecap="round" />
          <line x1={s.cx} y1={s.cy - 5} x2={s.cx} y2={s.cy + 5} stroke="#ffd93d" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      ))}
    </svg>
  );
}

const ILLUSTRATIONS = [BrowseIllustration, OrderIllustration, ReceiveIllustration];
const STEP_NUMBERS  = ["01", "02", "03"];

export default function HowToOrderSection() {
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];
  const t = useT();
  const accent    = tokens.accentHex;
  const accentRgb = tokens.accentRgb;

  const cardBg  = siteTheme === "navy"
    ? "linear-gradient(145deg, #0a1e30 0%, #071320 100%)"
    : "linear-gradient(145deg, #1e0904 0%, #120602 100%)";

  const lineGrad = `linear-gradient(to right, transparent, rgba(${accentRgb},0.4) 20%, rgba(${accentRgb},0.4) 80%, transparent)`;
  const dotGrid  = `radial-gradient(circle, ${accent} 1px, transparent 1px)`;

  return (
    <section className="py-24 bg-choco-900 relative overflow-hidden transition-colors duration-700">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: dotGrid, backgroundSize: "36px 36px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <p className="section-subtitle mb-2 font-hind">{t.howToOrder.subtitle}</p>
          <h2 className="section-title font-hind">{t.howToOrder.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-caramel-300 mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="hidden md:block relative mb-0">
          <div className="absolute left-1/6 right-1/6 h-px" style={{ background: lineGrad, top: "28px" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {t.howToOrder.steps.map((step, i) => {
            const Illustration = ILLUSTRATIONS[i];
            return (
              <AnimatedSection key={STEP_NUMBERS[i]} delay={i * 130}>
                <motion.div
                  className="relative rounded-3xl overflow-hidden h-full flex flex-col"
                  style={{ background: cardBg, border: `1px solid rgba(${accentRgb},0.18)` }}
                  whileHover={{
                    y: -8,
                    boxShadow: `0 32px 64px rgba(0,0,0,0.5), 0 0 40px rgba(${accentRgb},0.13)`,
                    borderColor: `rgba(${accentRgb},0.4)`,
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}>
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, rgba(${accentRgb},0.2), rgba(${accentRgb},0.08))`,
                        border: `1.5px solid rgba(${accentRgb},0.4)`,
                      }}>
                      <span className="font-playfair font-bold text-caramel-400 text-sm leading-none">
                        {STEP_NUMBERS[i]}
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full px-6 pt-16 pb-4" style={{ height: "190px" }}>
                    <Illustration accent={accent} />
                  </div>

                  <div className="px-6 pb-7 pt-2 flex flex-col gap-2 flex-1">
                    <h3 className="font-playfair text-xl font-bold text-white leading-tight font-hind">
                      {step.title}
                    </h3>
                    <p className="font-hind text-sm text-caramel-200 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-6 right-6 h-px"
                    style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb},0.5), transparent)` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  />
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
