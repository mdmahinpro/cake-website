import { useStore } from "../../store/useStore";

const CATEGORIES = [
  { slug: "all",         label: "All" },
  { slug: "chocolate",   label: "Chocolate" },
  { slug: "vanilla",     label: "Vanilla" },
  { slug: "anniversary", label: "Anniversary" },
  { slug: "birthday",    label: "Birthday" },
  { slug: "wedding",     label: "Wedding" },
  { slug: "custom",      label: "Customize" },
];

/** Checks whether a gallery item matches a filter slug */
export function matchesFilter(
  item: { category: string; type?: string },
  slug: string
): boolean {
  if (slug === "all") return true;
  return item.category.toLowerCase().startsWith(slug.toLowerCase());
}

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (slug: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const { state } = useStore();
  const { gallery } = state;

  function countForSlug(slug: string) {
    if (slug === "all") return gallery.length;
    return gallery.filter((item) => matchesFilter(item, slug)).length;
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
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px] ${
                  isActive
                    ? "bg-caramel-400 text-choco-900 shadow-lg font-semibold"
                    : "border border-caramel-700/50 text-caramel-300 hover:border-caramel-400 hover:text-white"
                }`}
                style={isActive ? { boxShadow: "0 4px 18px rgba(0,190,255,0.35)" } : {}}
              >
                {cat.label}
                <span className={`rounded-full px-1.5 text-[10px] font-bold ${isActive ? "bg-choco-900/20 text-choco-900" : "bg-white/10 text-caramel-300"}`}>
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
