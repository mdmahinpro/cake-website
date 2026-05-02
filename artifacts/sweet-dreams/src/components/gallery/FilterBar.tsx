import { useStore } from "../../store/useStore";

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "chocolate", label: "Chocolate" },
  { slug: "vanilla", label: "Vanilla" },
  { slug: "overloaded", label: "Overloaded" },
  { slug: "custom", label: "Custom" },
  { slug: "wedding", label: "Wedding" },
  { slug: "birthday", label: "Birthday" },
  { slug: "delivered", label: "Delivered Orders" },
];

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (slug: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const { state } = useStore();
  const { gallery } = state;

  function countForSlug(slug: string) {
    if (slug === "all") return gallery.length;
    return gallery.filter(
      (item) =>
        item.category.toLowerCase() === slug ||
        item.type?.toLowerCase() === slug
    ).length;
  }

  return (
    <div className="sticky top-[64px] z-40 bg-choco-900/90 backdrop-blur-xl border-b border-caramel-800/30 py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 flex-nowrap">
          {CATEGORIES.map((cat) => {
            const count = countForSlug(cat.slug);
            const isActive = activeFilter === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onFilterChange(cat.slug)}
                className={`flex-shrink-0 flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-caramel-400 text-white shadow-lg"
                    : "border border-caramel-700/50 text-caramel-300 hover:border-caramel-400"
                }`}
                style={isActive ? { boxShadow: "0 4px 15px rgba(90,58,24,0.4)" } : {}}
              >
                {cat.label}
                <span className="bg-white/10 rounded-full px-1.5 text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
