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

export default function Lightbox({
  item,
  index,
  items,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  // Touch/swipe
  useEffect(() => {
    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? onNext() : onPrev();
      }
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
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-sm text-white"
        style={{ background: "rgba(0,0,0,0.6)" }}>
        {index + 1} / {items.length}
      </div>

      {/* Close button */}
      <motion.button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white"
        style={{ background: "rgba(255,255,255,0.10)" }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.20)" }}
      >
        <FaTimes size={18} />
      </motion.button>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={item.id}
            src={item.imageUrl}
            alt={item.caption}
            className="max-w-full max-h-[70vh] object-contain rounded-2xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </AnimatePresence>

        {/* Prev arrow */}
        {items.length > 1 && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-caramel-400/80"
            style={{ background: "rgba(255,255,255,0.10)" }}
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        {/* Next arrow */}
        {items.length > 1 && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-caramel-400/80"
            style={{ background: "rgba(255,255,255,0.10)" }}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Bottom info panel */}
      <div
        className="rounded-t-3xl p-4 pb-6"
        style={{ background: "rgba(26,10,0,0.95)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-poppins text-base text-white mb-3">{item.caption}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-caramel-400/90 capitalize">
            {item.category}
          </span>
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white bg-red-600 hover:bg-red-500 transition-colors"
            >
              <FaYoutube size={14} />
              Watch Making Video
            </a>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-caramel-400">
              {index + 1} / {items.length}
            </span>
            <OrderButton caption={item.caption} category={item.category} size="lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
