import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import AnimatedSection from "../shared/AnimatedSection";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    accentColor: "#00beff",
    rating: 5,
    review:
      "Absolutely stunning cake! The custom design exceeded all my expectations. My daughter's birthday was truly unforgettable — every guest asked where it came from!",
    occasion: "Birthday Cake",
  },
  {
    id: 2,
    name: "Rahul & Ananya",
    initials: "RA",
    accentColor: "#4dd9ff",
    rating: 5,
    review:
      "Our wedding cake was a masterpiece. Every guest was amazed by the design, and the taste was even better than the looks. Highly recommend Sweet Dreams Cakes!",
    occasion: "Wedding Cake",
  },
  {
    id: 3,
    name: "Fatima Khan",
    initials: "FK",
    accentColor: "#80e0ff",
    rating: 5,
    review:
      "Ordered a custom anniversary cake with our photo on it. Delivery was on time and the cake was incredibly fresh and moist. Will definitely order again!",
    occasion: "Anniversary Cake",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} size={14} color={i < count ? "#00beff" : "rgba(0,190,255,0.18)"} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-choco-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2">What Our Customers Say</p>
          <h2 className="section-title">Loved By Many</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-caramel-200 mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.id} delay={i * 100} className="h-full">
              <motion.div
                className="card-dark p-7 h-full flex flex-col gap-4"
                whileHover={{
                  y: -8,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.45), 0 0 40px rgba(0,190,255,0.12)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 select-none"
                    style={{
                      background: `linear-gradient(135deg, ${t.accentColor}55, ${t.accentColor}cc)`,
                      border: `1.5px solid ${t.accentColor}60`,
                      boxShadow: `0 0 16px ${t.accentColor}30`,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-playfair font-bold text-white text-lg leading-tight">
                      {t.name}
                    </p>
                    <p className="text-xs text-caramel-400">{t.occasion}</p>
                  </div>
                </div>

                <StarRow count={t.rating} />

                <p className="font-poppins text-sm text-caramel-200 leading-relaxed flex-1">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Bottom accent line */}
                <div
                  className="h-px w-16 rounded-full"
                  style={{ background: `linear-gradient(to right, ${t.accentColor}, transparent)` }}
                />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
