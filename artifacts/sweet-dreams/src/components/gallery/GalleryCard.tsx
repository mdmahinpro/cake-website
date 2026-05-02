import { motion } from "framer-motion";
import OrderButton from "../shared/OrderButton";
import type { CakeItem } from "../../store/useStore";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";

interface GalleryCardProps {
  item: CakeItem;
  index: number;
  onClick: () => void;
}

export default function GalleryCard({ item, index, onClick }: GalleryCardProps) {
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];

  const overlayGrad =
    siteTheme === "navy"
      ? "linear-gradient(to top, rgba(1,13,30,0.92) 0%, rgba(1,13,30,0.25) 50%, transparent 100%)"
      : "linear-gradient(to top, rgba(18,6,2,0.92) 0%, rgba(18,6,2,0.25) 50%, transparent 100%)";

  return (
    <motion.div
      className="relative group cursor-pointer rounded-2xl overflow-hidden"
      style={{ aspectRatio: "1 / 1" }}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min((index % 8) * 0.05, 0.35), duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: `0 12px 32px rgba(${tokens.accentRgb},0.18)` }}
      onClick={onClick}
    >
      {/* Square image fill */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="w-full h-full" whileHover={{ scale: 1.07 }} transition={{ duration: 0.5 }}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.caption}
              className="w-full h-full object-cover block transition-all duration-500 brightness-95 saturate-110 group-hover:brightness-100"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-choco-700 to-choco-900 flex items-center justify-center">
              <span className="font-playfair text-3xl font-bold text-caramel-400/25 select-none">SD</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: overlayGrad }}
      />

      {/* Category badge */}
      <div className="absolute top-2.5 left-2.5 pointer-events-none">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white bg-caramel-400/90 capitalize leading-tight tracking-wide">
          {item.category}
        </span>
      </div>

      {/* Video badge */}
      {(item as CakeItem & { youtubeUrl?: string }).youtubeUrl && (
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-red-600/90 leading-tight">
            Video
          </span>
        </div>
      )}

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs sm:text-sm text-white/90 line-clamp-2 font-poppins pr-12 leading-snug">
          {item.caption}
        </p>
      </div>

      <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
        <OrderButton caption={item.caption} category={item.category} size="sm" />
      </div>
    </motion.div>
  );
}
