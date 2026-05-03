import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCoffee, FiStar, FiEdit3, FiPackage, FiHeart, FiGift, FiGrid } from "react-icons/fi";
import AnimatedSection from "../shared/AnimatedSection";
import { useStore } from "../../store/useStore";
import type { IconType } from "react-icons";
import type { ProductCategory } from "../../store/useStore";
import { useT } from "../../i18n/translations";

const SLUG_ICONS: Record<string, IconType> = {
  chocolate: FiCoffee,
  vanilla:   FiStar,
  custom:    FiEdit3,
  others:    FiPackage,
  wedding:   FiHeart,
  birthday:  FiGift,
};

const FALLBACK_GRADIENTS = [
  "from-choco-800 to-choco-600",
  "from-amber-900 to-yellow-800",
  "from-rose-900 to-pink-900",
  "from-stone-900 to-choco-800",
  "from-violet-900 to-purple-900",
  "from-teal-900 to-emerald-900",
];

function CategoryCard({
  cat, index, coverImage, count, onClick, explore, designs, customMade,
}: {
  cat: ProductCategory;
  index: number;
  coverImage: string | undefined;
  count: number;
  onClick: () => void;
  explore: string;
  designs: (n: number) => string;
  customMade: string;
}) {
  const Icon = SLUG_ICONS[cat.slug.toLowerCase()] ?? FiGrid;
  const gradient = cat.gradient ?? FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  return (
    <AnimatedSection delay={index * 80}>
      <motion.div
        className="relative rounded-3xl overflow-hidden cursor-pointer group"
        style={{ aspectRatio: "3/4" }}
        whileHover="hovered"
        onClick={onClick}
      >
        {coverImage ? (
          <motion.img src={coverImage} alt={cat.name} className="absolute inset-0 w-full h-full object-cover"
            variants={{ hovered: { scale: 1.08 } }} transition={{ duration: 0.4 }} />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}

        <motion.div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)" }}
          variants={{ hovered: { background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 60%)" } }}
        />

        <div className="absolute bottom-4 left-4 right-4">
          <span className="block mb-1.5 text-caramel-300"><Icon size={22} /></span>
          <p className="font-playfair text-xl font-bold text-white leading-tight">{cat.name}</p>
          <p className="text-xs text-caramel-300 mt-0.5 font-hind">
            {count > 0 ? designs(count) : customMade}
          </p>
        </div>

        <motion.div className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }} variants={{ hovered: { opacity: 1 } }} transition={{ duration: 0.25 }}>
          <motion.button
            className="btn-primary px-7 py-2.5 text-sm font-semibold shadow-xl font-hind"
            initial={{ scale: 0.85 }} variants={{ hovered: { scale: 1 } }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}>
            {explore}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function CategorySection() {
  const { state } = useStore();
  const { categories, products } = state;
  const navigate = useNavigate();
  const t = useT();

  function coverImage(categoryId: string) {
    return products.find((p) => p.categoryId === categoryId && p.imageUrl)?.imageUrl;
  }
  function countInCategory(categoryId: string) {
    return products.filter((p) => p.categoryId === categoryId).length;
  }

  if (categories.length === 0) return null;

  return (
    <section id="gallery-section" className="py-20 bg-gradient-to-b from-choco-900 to-choco-800 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2 font-hind">{t.category.subtitle}</p>
          <h2 className="section-title font-hind">{t.category.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <CategoryCard
              key={cat.id} cat={cat} index={i}
              coverImage={coverImage(cat.id)}
              count={countInCategory(cat.id)}
              onClick={() => navigate(`/products?cat=${cat.slug}`)}
              explore={t.category.explore}
              designs={t.category.designs}
              customMade={t.category.customMade}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
