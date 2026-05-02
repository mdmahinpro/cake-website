import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimatedSection from "../shared/AnimatedSection";
import OrderButton from "../shared/OrderButton";
import { useStore } from "../../store/useStore";

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

  const items = gallery.filter((g) => g.featured).length > 0
    ? gallery.filter((g) => g.featured)
    : gallery.slice(0, 6);

  const visibleCount = useVisibleCount();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || items.length <= visibleCount) return;
    timerRef.current = setInterval(goNext, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, goNext, items.length, visibleCount]);

  const visible = items.slice(index, index + visibleCount);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
  };

  if (items.length === 0) return null;

  return (
    <section className="py-20" style={{ background: "rgba(45,22,0,0.5)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2">Our Most Loved Cakes</p>
          <h2 className="section-title">Featured Creations</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev button */}
          {items.length > visibleCount && (
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full border border-caramel-400 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-white transition-all duration-200"
              style={{ background: "#2d1600" }}
            >
              <FaChevronLeft size={16} />
            </button>
          )}

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`grid gap-4 md:gap-6`}
                style={{
                  gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
                }}
              >
                {visible.map((item) => (
                  <motion.div
                    key={item.id}
                    className="rounded-3xl overflow-hidden cursor-pointer"
                    style={{ background: "#2d1600" }}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-choco-700 to-choco-900 flex items-center justify-center text-6xl">
                        🎂
                      </div>
                    )}
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-caramel-100 line-clamp-2 flex-1">
                          {item.caption}
                        </p>
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium text-choco-900"
                          style={{ background: "#d4a574" }}>
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

          {/* Next button */}
          {items.length > visibleCount && (
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full border border-caramel-400 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-white transition-all duration-200"
              style={{ background: "#2d1600" }}
            >
              <FaChevronRight size={16} />
            </button>
          )}

          {/* Dots */}
          {items.length > visibleCount && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`rounded-full transition-all duration-200 ${
                    i === index
                      ? "w-6 h-2.5 bg-caramel-400"
                      : "w-2.5 h-2.5 border border-caramel-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
