import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight, FaYoutube } from "react-icons/fa";
import OrderButton from "../shared/OrderButton";
import type { CakeItem } from "../../store/useStore";

interface LightboxProps {
  item: CakeItem;
  index: number;
  items: CakeItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ item, index, items, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? onNext() : onPrev(); }
    };
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onNext, onPrev]);

  const youtubeUrl = (item as CakeItem & { youtubeUrl?: string }).youtubeUrl;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Counter badge */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm text-white select-none"
        style={{ background: "rgba(0,0,0,0.6)" }}>
        {index + 1} / {items.length}
      </div>

      {/* Close button — 48×48 minimum tap target */}
      <motion.button
        className="absolute top-3 right-3 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white"
        style={{ background: "rgba(255,255,255,0.10)" }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        whileHover={{ background: "rgba(255,255,255,0.20)" }}
        whileTap={{ scale: 0.9 }}
      >
        <FaTimes size={20} />
      </motion.button>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center p-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={item.id}
            src={item.imageUrl}
            alt={item.caption}
            className="max-w-full max-h-[65vh] object-contain rounded-2xl"
            loading="lazy"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </AnimatePresence>

        {/* Prev/Next arrows — hidden on mobile, visible on md+ */}
        {items.length > 1 && (
          <>
            <button
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center text-white transition-all duration-200 hover:bg-caramel-400/80"
              style={{ background: "rgba(255,255,255,0.10)" }}
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full items-center justify-center text-white transition-all duration-200 hover:bg-caramel-400/80"
              style={{ background: "rgba(255,255,255,0.10)" }}
              onClick={(e) => { e.stopPropagation(); onNext(); }}
            >
              <FaChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Bottom panel */}
      <div
        className="rounded-t-3xl p-4 pb-safe-bottom"
        style={{ background: "rgba(26,10,0,0.97)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-poppins text-sm sm:text-base text-white mb-3 leading-relaxed">{item.caption}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-caramel-400/90 capitalize">
            {item.category}
          </span>
          {youtubeUrl && (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white bg-red-600 hover:bg-red-500 transition-colors">
              <FaYoutube size={14} />
              Watch Making Video
            </a>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-caramel-400">{index + 1} / {items.length}</span>
            <OrderButton caption={item.caption} category={item.category} size="md" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
