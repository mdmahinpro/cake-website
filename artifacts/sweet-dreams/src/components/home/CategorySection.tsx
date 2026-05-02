import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "../shared/AnimatedSection";
import { useStore } from "../../store/useStore";

interface Category {
  slug: string;
  name: string;
  emoji: string;
  gradient: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    slug: "chocolate",
    name: "Chocolate",
    emoji: "🍫",
    gradient: "from-choco-800 to-choco-600",
  },
  {
    slug: "vanilla",
    name: "Vanilla",
    emoji: "🍰",
    gradient: "from-amber-900 to-yellow-800",
  },
  {
    slug: "overloaded",
    name: "Overloaded",
    emoji: "🎉",
    gradient: "from-stone-900 to-choco-800",
  },
  {
    slug: "custom",
    name: "Custom Design",
    emoji: "✨",
    gradient: "from-rose-900 to-pink-900",
  },
];

export default function CategorySection() {
  const { state } = useStore();
  const { gallery } = state;
  const navigate = useNavigate();

  function countInCategory(slug: string) {
    return gallery.filter(
      (item) => item.category.toLowerCase() === slug.toLowerCase()
    ).length;
  }

  function coverImage(slug: string) {
    return gallery.find(
      (item) => item.category.toLowerCase() === slug.toLowerCase() && item.imageUrl
    )?.imageUrl;
  }

  return (
    <section
      id="gallery-section"
      className="py-20 bg-gradient-to-b from-choco-900 to-choco-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2">What We Do Best</p>
          <h2 className="section-title">Our Specialties</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {DEFAULT_CATEGORIES.map((cat, i) => {
            const img = coverImage(cat.slug);
            const count = countInCategory(cat.slug);

            return (
              <AnimatedSection key={cat.slug} delay={i * 80}>
                <motion.div
                  className="relative rounded-3xl overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: "3/4" }}
                  whileHover="hovered"
                  onClick={() =>
                    navigate(`/gallery?cat=${cat.slug}`)
                  }
                >
                  {/* Background */}
                  {img ? (
                    <motion.img
                      src={img}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      variants={{ hovered: { scale: 1.08 } }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`}
                    />
                  )}

                  {/* Dark overlay */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)" }}
                    variants={{ hovered: { background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 60%)" } }}
                  />

                  {/* Category info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-2xl block mb-1">{cat.emoji}</span>
                    <p className="font-playfair text-xl font-bold text-white leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-xs text-caramel-300 mt-0.5">
                      {count > 0 ? `${count} Designs` : "Custom made"}
                    </p>
                  </div>

                  {/* Explore button */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 px-3 pb-3"
                    initial={{ y: 60, opacity: 0 }}
                    variants={{ hovered: { y: 0, opacity: 1 } }}
                    transition={{ duration: 0.3 }}
                  >
                    <button className="btn-primary w-full text-sm py-2">
                      Explore
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
