import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebook, FaChevronDown } from "react-icons/fa";
import SparkleField from "../shared/SparkleField";
import FloatingParticles from "../shared/FloatingParticles";
import AnimatedCake, { type CakeTheme } from "./AnimatedCake";
import { useStore } from "../../store/useStore";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";
import { openOrderChannel } from "../../utils/order";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
});

const FLAVORS: { id: CakeTheme; label: string; note: string; swatch: string }[] = [
  { id: "vanilla",   label: "Vanilla",   note: "Golden Bean", swatch: "radial-gradient(circle at 35% 30%, #fce888, #c89840, #7a4010)" },
  { id: "chocolate", label: "Chocolate", note: "Dark & Rich",  swatch: "radial-gradient(circle at 35% 30%, #b06030, #5a2808, #1e0804)" },
];

/* Floating badges — adjusted positions for both mobile and desktop */
const BADGES = [
  { label: "Custom Design",       pos: "top-2 -right-2 md:top-4 md:-right-10" },
  { label: "Fresh Baked",         pos: "-bottom-2 -left-2 md:-left-10" },
  { label: "Love In Every Slice", pos: "bottom-10 -right-4 md:bottom-20 md:-right-12" },
];

export default function HeroSection() {
  const { state } = useStore();
  const { settings } = state;
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];

  const [scrolled, setScrolled] = useState(false);
  const [cakeTheme, setCakeTheme] = useState<CakeTheme>("vanilla");

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 80); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleOrder() { openOrderChannel(settings, "General inquiry", "Custom"); }
  function scrollToGallery() {
    document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
  }

  const OrderIcon = settings.orderChannel === "whatsapp" ? FaWhatsapp : FaFacebook;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 transition-colors duration-700"
        style={{ background: `linear-gradient(135deg, ${tokens.bgDeep} 0%, ${tokens.bgMid}55 50%, ${tokens.bgDeep} 100%)` }} />
      <div className="absolute inset-0 transition-all duration-700"
        style={{ background: `radial-gradient(ellipse at 70% 50%, ${tokens.radialGlow} 0%, transparent 65%)` }} />
      <div className="absolute inset-0 opacity-[0.025] transition-all duration-700"
        style={{
          backgroundImage: `linear-gradient(${tokens.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${tokens.gridLine} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      <SparkleField />
      <FloatingParticles />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pb-16">
        {/*
          flex-col-reverse: on mobile → cake (second in DOM) appears FIRST (top),
          text (first in DOM) appears SECOND (bottom).
          md:flex-row: on desktop → text left, cake right (DOM order).
        */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-8">

          {/* ── Text content (bottom on mobile, left on desktop) ── */}
          <div className="md:w-3/5 flex flex-col gap-4 items-center md:items-start text-center md:text-left w-full">
            <motion.div {...fadeLeft(0)}>
              <span className="inline-flex items-center px-4 py-2 rounded-full border border-caramel-400/40 bg-caramel-400/10 font-dancing text-caramel-300 text-lg">
                Handcrafted With Love
              </span>
            </motion.div>

            <motion.div {...fadeUp(0.12)}>
              <h1 className="font-playfair font-black leading-tight">
                <span className="text-3xl sm:text-5xl md:text-7xl text-white block">Your Dream Cake</span>
                <span className="text-3xl sm:text-5xl md:text-7xl text-gradient block">Starts Here</span>
              </h1>
            </motion.div>

            <motion.p {...fadeUp(0.22)}
              className="font-poppins text-sm md:text-lg text-caramel-200 max-w-lg leading-relaxed">
              {settings.heroSubtitle}
            </motion.p>

            <motion.div {...fadeUp(0.32)} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.button
                onClick={handleOrder}
                className="btn-primary animate-pulse-soft flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto"
                whileTap={{ scale: 0.95 }}
              >
                <OrderIcon size={18} />
                Order Your Cake
              </motion.button>
              <motion.button
                onClick={scrollToGallery}
                className="btn-outline flex items-center justify-center min-h-[48px] w-full sm:w-auto"
                whileTap={{ scale: 0.95 }}
              >
                See Our Work
              </motion.button>
            </motion.div>

          </div>

          {/* ── Cake visual (top on mobile, right on desktop) ── */}
          <div className="md:w-2/5 flex flex-col items-center gap-4 w-full">

            {/* Cake + floating badges */}
            <div className="relative w-44 h-44 sm:w-64 sm:h-64 md:w-96 md:h-96 flex-shrink-0">
              <div className="absolute inset-0 rounded-full blur-3xl animate-glow"
                style={{ background: tokens.radialGlow }} />
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
                className="relative w-full h-full animate-float"
              >
                <AnimatedCake theme={cakeTheme} />
              </motion.div>

              {BADGES.map((b, i) => (
                <motion.div key={b.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.0 + i * 0.15, type: "spring" }}
                  className={`absolute animate-float-slow px-2.5 py-1 rounded-full text-[9px] md:text-xs text-caramel-200 border border-caramel-400/40 whitespace-nowrap ${b.pos}`}
                  style={{ background: `${tokens.bgDeep}e6`, animationDelay: `${i * 0.9}s` }}>
                  {b.label}
                </motion.div>
              ))}
            </div>

            {/* Flavor picker */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase font-poppins text-caramel-400/55 select-none">
                Choose a flavor
              </p>
              <div className="flex gap-2">
                {FLAVORS.map((fl) => {
                  const active = cakeTheme === fl.id;
                  return (
                    <motion.button
                      key={fl.id}
                      onClick={() => setCakeTheme(fl.id)}
                      whileTap={{ scale: 0.93 }}
                      whileHover={{ scale: 1.04 }}
                      className="relative flex items-center gap-2 px-3 py-2 rounded-full font-poppins text-xs font-semibold transition-colors duration-300 select-none focus:outline-none"
                      style={{
                        background: active ? `rgba(${tokens.accentRgb},0.13)` : "rgba(255,255,255,0.04)",
                        border: active ? `1px solid rgba(${tokens.accentRgb},0.55)` : "1px solid rgba(255,255,255,0.1)",
                        boxShadow: active ? `0 0 16px rgba(${tokens.accentRgb},0.2)` : "none",
                        color: active ? "#e8f8ff" : "rgba(180,210,230,0.6)",
                      }}
                    >
                      <span className="w-3.5 h-3.5 rounded-full ring-1 ring-white/20 flex-shrink-0" style={{ background: fl.swatch }} />
                      <span className="flex flex-col items-start leading-none gap-0.5">
                        <span>{fl.label}</span>
                        <span className="text-[9px] opacity-60 font-normal">{fl.note}</span>
                      </span>
                      {active && (
                        <motion.span
                          layoutId="activeDot"
                          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                          style={{ background: tokens.accentHex, boxShadow: `0 0 6px rgba(${tokens.accentRgb},0.8)` }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-dancing text-sm text-caramel-400/60">Scroll to explore</span>
        <FaChevronDown className="text-caramel-400/60 animate-bounce-slow" />
      </motion.div>
    </section>
  );
}
