import { useStore } from "../../store/useStore";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";
import { useT } from "../../i18n/translations";
import { matchesFilter } from "../../utils/gallery";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (slug: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const { state } = useStore();
  const { gallery } = state;
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];
  const t = useT();

  const CATEGORIES = [
    { slug: "all",         label: t.filterBar.all },
    { slug: "chocolate",   label: t.filterBar.chocolate },
    { slug: "vanilla",     label: t.filterBar.vanilla },
    { slug: "anniversary", label: t.filterBar.anniversary },
    { slug: "birthday",    label: t.filterBar.birthday },
    { slug: "wedding",     label: t.filterBar.wedding },
    { slug: "custom",      label: t.filterBar.customize },
  ];

  function countForSlug(slug: string) {
    if (slug === "all") return gallery.length;
    return gallery.filter((item) => matchesFilter(item, slug)).length;
  }

  return (
    <div className="sticky top-[64px] z-40 bg-choco-900/90 backdrop-blur-xl border-b border-caramel-800/30 py-3 px-4 transition-colors duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 flex-nowrap">
          {CATEGORIES.map((cat) => {
            const count = countForSlug(cat.slug);
            const isActive = activeFilter === cat.slug;
            return (
              <button key={cat.slug} onClick={() => onFilterChange(cat.slug)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px] font-hind ${
                  isActive
                    ? "bg-caramel-400 text-choco-900 shadow-lg font-semibold"
                    : "border border-caramel-700/50 text-caramel-300 hover:border-caramel-400 hover:text-white"
                }`}
                style={isActive ? { boxShadow: `0 4px 18px rgba(${tokens.accentRgb},0.35)` } : {}}>
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
