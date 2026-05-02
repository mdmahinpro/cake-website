import GalleryCard from "./GalleryCard";
import type { CakeItem } from "../../store/useStore";

interface GalleryGridProps {
  items: CakeItem[];
  visibleCount: number;
  onLoadMore: () => void;
  onCardClick: (item: CakeItem, index: number) => void;
  onClearFilters: () => void;
}

export default function GalleryGrid({
  items,
  visibleCount,
  onLoadMore,
  onCardClick,
  onClearFilters,
}: GalleryGridProps) {
  const visible = items.slice(0, visibleCount);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <span className="text-8xl animate-bounce-slow">🎂</span>
        <h3 className="font-playfair text-2xl text-white">No cakes found</h3>
        <p className="text-caramel-300 text-sm">Try a different filter or search term</p>
        <button onClick={onClearFilters} className="btn-outline mt-2">
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
        {visible.map((item, i) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={i}
            onClick={() => onCardClick(item, i)}
          />
        ))}
      </div>

      {visibleCount < items.length && (
        <button onClick={onLoadMore} className="btn-outline mx-auto block mt-8">
          Load More Cakes
        </button>
      )}
    </div>
  );
}
