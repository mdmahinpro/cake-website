import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import AnimatedSection from "../shared/AnimatedSection";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    accentIndex: 0,
    rating: 5,
    review:
      "Absolutely stunning cake! The custom design exceeded all my expectations. My daughter's birthday was truly unforgettable — every guest asked where it came from!",
    occasion: "Birthday Cake",
  },
  {
    id: 2,
    name: "Rahul & Ananya",
    initials: "RA",
    accentIndex: 1,
    rating: 5,
    review:
      "Our wedding cake was a masterpiece. Every guest was amazed by the design, and the taste was even better than the looks. Highly recommend Sweet Dreams Cakes!",
    occasion: "Wedding Cake",
  },
  {
    id: 3,
    name: "Fatima Khan",
    initials: "FK",
    accentIndex: 2,
    rating: 5,
    review:
      "Ordered a custom anniversary cake with our photo on it. Delivery was on time and the cake was incredibly fresh and moist. Will definitely order again!",
    occasion: "Anniversary Cake",
  },
];

const ACCENT_PALETTES = {
  navy:      ["#00beff", "#4dd9ff", "#80e0ff"],
  chocolate: ["#f0d9a8", "#f5e6c0", "#d8bc88"],
} as const;

function StarRow({ count, starColor }: { count: number; starColor: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} size={14} color={i < count ? starColor : `${starColor}30`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];
  const palette = ACCENT_PALETTES[siteTheme];

  return (
    <section className="py-20 bg-choco-800 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2">What Our Customers Say</p>
          <h2 className="section-title">Loved By Many</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-caramel-200 mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TESTIMONIALS.map((t, i) => {
            const accent = palette[t.accentIndex];
            return (
              <AnimatedSection key={t.id} delay={i * 100} className="h-full">
                <motion.div
                  className="card-dark p-7 h-full flex flex-col gap-4"
                  whileHover={{
                    y: -8,
                    boxShadow: `0 30px 60px rgba(0,0,0,0.45), 0 0 40px rgba(${tokens.accentRgb},0.12)`,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 select-none"
                      style={{
                        background: `linear-gradient(135deg, ${accent}44, ${accent}bb)`,
                        border: `1.5px solid ${accent}55`,
                        boxShadow: `0 0 16px ${accent}22`,
                        color: siteTheme === "chocolate" ? "#2a1006" : "white",
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-playfair font-bold text-white text-lg leading-tight">{t.name}</p>
                      <p className="text-xs text-caramel-400">{t.occasion}</p>
                    </div>
                  </div>

                  <StarRow count={t.rating} starColor={accent} />

                  <p className="font-poppins text-sm text-caramel-200 leading-relaxed flex-1">
                    &ldquo;{t.review}&rdquo;
                  </p>

                  <div
                    className="h-px w-16 rounded-full"
                    style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
                  />
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
