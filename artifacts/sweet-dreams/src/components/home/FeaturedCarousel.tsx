import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimatedSection from "../shared/AnimatedSection";
import OrderButton from "../shared/OrderButton";
import { useStore } from "../../store/useStore";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";
import { useT } from "../../i18n/translations";

function useVisibleCount() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    function update() {
      if (window.innerWidth >= 1024) setCount(3);
      else if (window.innerWidth >= 768) setCount(2);
      else setCount(1);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return count;
}

export default function FeaturedCarousel() {
  const { state } = useStore();
  const { gallery } = state;
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];
  const t = useT();

  const items = gallery.filter((g) => g.featured);

  const visibleCount = useVisibleCount();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(0, items.length - visibleCount);
  const showNav = items.length > visibleCount;

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!showNav || paused) return;
    timerRef.current = setInterval(goNext, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showNav, paused, goNext]);

  if (items.length === 0) return null;

  const visible = items.slice(index, index + visibleCount);

  const variants = {
    enter:  (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
  };

  const navBg     = siteTheme === "navy" ? "#031525" : "#1e0904";
  const sectionBg = siteTheme === "navy" ? "rgba(3,21,37,0.7)" : "rgba(18,6,2,0.7)";
  const cardBg    = siteTheme === "navy" ? "#031525" : "#1e0904";

  const navBtn =
    "absolute top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-caramel-400 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-choco-900 transition-all duration-200 shadow-lg";

  return (
    <section className="py-20 overflow-hidden transition-colors duration-700" style={{ background: sectionBg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2 font-hind">{t.featured.subtitle}</p>
          <h2 className="section-title font-hind">{t.featured.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-caramel-200 mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}>
          {showNav && (
            <motion.button onClick={goPrev} className={`${navBtn} left-0 -translate-x-1/2`}
              style={{ background: navBg }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Previous">
              <FaChevronLeft size={16} />
            </motion.button>
          )}

          <div className={showNav ? "overflow-hidden px-8 sm:px-10" : "overflow-hidden"}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid gap-4 md:gap-6"
                style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}>
                {visible.map((item) => (
                  <motion.div key={item.id} className="rounded-3xl overflow-hidden"
                    style={{ background: cardBg, border: `1px solid rgba(${tokens.accentRgb},0.15)` }}
                    whileHover={{ y: -8, boxShadow: `0 24px 48px rgba(0,0,0,0.5), 0 0 30px rgba(${tokens.accentRgb},0.12)` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.caption}
                        className="w-full aspect-square object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-choco-700 to-choco-900 flex items-center justify-center">
                        <span className="text-caramel-400/40 text-5xl font-playfair font-bold">SD</span>
                      </div>
                    )}
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-caramel-100 line-clamp-2 flex-1 font-hind">{item.caption}</p>
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium text-choco-900 font-hind"
                          style={{ background: tokens.accentHex }}>
                          {item.category}
                        </span>
                      </div>
                      <OrderButton caption={item.caption} category={item.category} size="md" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {showNav && (
            <motion.button onClick={goNext} className={`${navBtn} right-0 translate-x-1/2`}
              style={{ background: navBg }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Next">
              <FaChevronRight size={16} />
            </motion.button>
          )}

          {showNav && (
            <div className="flex justify-center gap-1 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  className="p-2 flex items-center justify-center" aria-label={`Slide ${i + 1}`}>
                  <span className={`block rounded-full transition-all duration-200 ${
                    i === index ? "w-6 h-2.5 bg-caramel-400" : "w-2.5 h-2.5 border border-caramel-400"
                  }`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
