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
  { label: "Custom Design", pos: "top-4 -right-4 md:-right-8" },
  { label: "Fresh Baked", pos: "-bottom-2 -left-4 md:-left-8" },
  { label: "Love In Every Slice", pos: "bottom-16 -right-6 md:-right-10" },
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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-choco-900 via-choco-800 to-[#3d1500]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(212,165,116,0.15) 0%, transparent 60%)",
        }}
      />
      <SparkleField />
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-8">
          {/* Left text column */}
          <div className="md:w-3/5 flex flex-col gap-6">
            {/* Badge */}
            <motion.div {...fadeLeft(0)}>
              <span className="inline-flex items-center px-4 py-2 rounded-full border border-caramel-400/40 bg-caramel-400/10 font-dancing text-caramel-300 text-lg">
                ✨ Handcrafted With Love
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div {...fadeUp(0.1)}>
              <h1 className="font-playfair font-black leading-tight">
                <span className="text-5xl md:text-7xl text-white block">Your Dream Cake</span>
                <span className="text-5xl md:text-7xl text-gradient block">Starts Here</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              {...fadeUp(0.2)}
              className="font-poppins text-base md:text-lg text-caramel-200 max-w-lg leading-relaxed"
            >
              {settings.heroSubtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4">
              <button
                onClick={handleOrder}
                className="btn-primary animate-pulse-soft flex items-center gap-2"
              >
                {settings.orderChannel === "whatsapp" ? (
                  <FaWhatsapp size={18} />
                ) : (
                  <FaFacebook size={18} />
                )}
                Order Your Cake
              </button>
              <button onClick={scrollToGallery} className="btn-outline">
                See Our Work
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-2">
              {["Fresh Daily", "Custom Design", "Free Delivery"].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full text-xs text-caramel-300 border border-caramel-700/40"
                  style={{ background: "rgba(45,22,0,0.8)" }}
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right visual */}
          <div className="md:w-2/5 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-full blur-3xl animate-glow"
                style={{ background: "rgba(212,165,116,0.20)" }}
              />

              {/* Main circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                className="relative w-full h-full rounded-full flex items-center justify-center animate-float"
                style={{
                  background: "radial-gradient(circle at 40% 35%, #d4a574, #3d1c08)",
                  border: "4px solid transparent",
                  backgroundClip: "padding-box",
                  boxShadow: "0 0 0 4px rgba(212,165,116,0.5), 0 30px 60px rgba(0,0,0,0.5)",
                }}
              >
                <span className="text-8xl select-none">🎂</span>
              </motion.div>

              {/* Floating badge pills */}
              {BADGES.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
                  className={`absolute animate-float-slow px-3 py-1 rounded-full text-xs text-caramel-200 border border-caramel-400/50 whitespace-nowrap ${b.pos}`}
                  style={{
                    background: "#2d1600",
                    animationDelay: `${i * 0.8}s`,
                  }}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500"
        style={{ opacity: scrolled ? 0 : 1 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
      >
        <span className="font-dancing text-sm text-caramel-400/60">Scroll to explore</span>
        <FaChevronDown className="text-caramel-400/60 animate-bounce-slow" />
      </motion.div>
    </section>
  );
}
