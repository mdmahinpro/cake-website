import { motion } from "framer-motion";
import OrderButton from "../shared/OrderButton";
import type { CakeItem } from "../../store/useStore";

interface GalleryCardProps {
  item: CakeItem;
  index: number;
  onClick: () => void;
}

export default function GalleryCard({ item, index, onClick }: GalleryCardProps) {
  return (
    <motion.div
      className="break-inside-avoid mb-3 md:mb-4 relative group cursor-pointer rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min((index % 8) * 0.05, 0.4), duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <div className="overflow-hidden">
        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.5 }}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.caption}
              className="w-full object-cover block transition-all duration-500 brightness-95 saturate-110 group-hover:brightness-100"
              loading="lazy"
            />
          ) : (
            <div className="w-full aspect-square bg-gradient-to-br from-choco-700 to-choco-900 flex items-center justify-center text-5xl">
              🎂
            </div>
          )}
        </motion.div>
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 50%, transparent 100%)" }}
      />

      {/* Top badges */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white bg-caramel-400/90 capitalize leading-tight">
          {item.category}
        </span>
        {(item as CakeItem & { youtubeUrl?: string }).youtubeUrl && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white bg-red-600/90 leading-tight">
            Video
          </span>
        )}
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs md:text-sm text-white/90 line-clamp-2 font-poppins pr-14 leading-snug">
          {item.caption}
        </p>
      </div>

      {/* Order button — contained within card */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
        <OrderButton caption={item.caption} category={item.category} size="sm" />
      </div>
    </motion.div>
  );
}
