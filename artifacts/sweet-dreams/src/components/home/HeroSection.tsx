import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebook, FaChevronDown } from "react-icons/fa";
import SparkleField from "../shared/SparkleField";
import FloatingParticles from "../shared/FloatingParticles";
import { useStore } from "../../store/useStore";
import { openOrderChannel } from "../../utils/order";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" as const },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" as const },
});

const BADGES = [
  { label: "Custom Design", pos: "top-2 -right-2 md:top-4 md:-right-8" },
  { label: "Fresh Baked", pos: "-bottom-2 -left-2 md:-left-8" },
  { label: "Love In Every Slice", pos: "bottom-10 -right-4 md:bottom-16 md:-right-10" },
];

export default function HeroSection() {
  const { state } = useStore();
  const { settings } = state;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleOrder() {
    openOrderChannel(settings, "General inquiry", "Custom");
  }

  function scrollToGallery() {
    document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
  }

  const OrderIcon = settings.orderChannel === "whatsapp" ? FaWhatsapp : FaFacebook;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-choco-900 via-choco-800 to-[#3d1500]" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(212,165,116,0.15) 0%, transparent 60%)" }}
      />
      <SparkleField />
      <FloatingParticles />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-8">
          {/* Left text — centered mobile, left-aligned desktop */}
          <div className="md:w-3/5 flex flex-col gap-5 items-center md:items-start text-center md:text-left">
            <motion.div {...fadeLeft(0)}>
              <span className="inline-flex items-center px-4 py-2 rounded-full border border-caramel-400/40 bg-caramel-400/10 font-dancing text-caramel-300 text-lg">
                ✨ Handcrafted With Love
              </span>
            </motion.div>

            <motion.div {...fadeUp(0.1)}>
              <h1 className="font-playfair font-black leading-tight">
                <span className="text-4xl sm:text-5xl md:text-7xl text-white block">Your Dream Cake</span>
                <span className="text-4xl sm:text-5xl md:text-7xl text-gradient block">Starts Here</span>
              </h1>
            </motion.div>

            <motion.p {...fadeUp(0.2)} className="font-poppins text-base md:text-lg text-caramel-200 max-w-lg leading-relaxed">
              {settings.heroSubtitle}
            </motion.p>

            {/* Buttons — stacked full-width on mobile, row on desktop */}
            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-2 justify-center md:justify-start">
              {["Fresh Daily", "Custom Design", "Free Delivery"].map((badge) => (
                <span key={badge} className="px-3 py-1.5 rounded-full text-xs text-caramel-300 border border-caramel-700/40"
                  style={{ background: "rgba(45,22,0,0.8)" }}>
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right visual — smaller on mobile */}
          <div className="md:w-2/5 flex justify-center">
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 flex-shrink-0">
              <div className="absolute inset-0 rounded-full blur-3xl animate-glow"
                style={{ background: "rgba(212,165,116,0.20)" }} />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" as const }}
                className="relative w-full h-full rounded-full flex items-center justify-center animate-float"
                style={{
                  background: "radial-gradient(circle at 40% 35%, #d4a574, #3d1c08)",
                  boxShadow: "0 0 0 4px rgba(212,165,116,0.5), 0 30px 60px rgba(0,0,0,0.5)",
                }}
              >
                <span className="text-5xl sm:text-7xl md:text-8xl select-none">🎂</span>
              </motion.div>
              {BADGES.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
                  className={`absolute animate-float-slow px-2 py-1 rounded-full text-[10px] md:text-xs text-caramel-200 border border-caramel-400/50 whitespace-nowrap ${b.pos}`}
                  style={{ background: "#2d1600", animationDelay: `${i * 0.8}s` }}
                >
                  {b.label}
                </motion.div>
              ))}
            </div>
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
