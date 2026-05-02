import AnimatedSection from "../shared/AnimatedSection";
import { FaStar } from "react-icons/fa";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "👩",
    rating: 5,
    review:
      "Absolutely stunning cake! The chocolate ganache was perfectly smooth and the custom design exceeded all my expectations. My daughter's birthday was unforgettable!",
    occasion: "Birthday Cake",
  },
  {
    id: 2,
    name: "Rahul & Ananya",
    avatar: "💑",
    rating: 5,
    review:
      "Our wedding cake was a masterpiece. Every guest was amazed by the design, and the taste was even better than the looks. Highly recommend Sweet Dreams Cakes!",
    occasion: "Wedding Cake",
  },
  {
    id: 3,
    name: "Fatima Khan",
    avatar: "👩‍🦱",
    rating: 5,
    review:
      "Ordered a custom anniversary cake with our photo on it. The delivery was on time and the cake was incredibly fresh and moist. Will definitely order again!",
    occasion: "Anniversary Cake",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          size={14}
          color={i < count ? "#d4a574" : "rgba(212,165,116,0.2)"}
        />
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
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.id} delay={i * 100}>
              <div className="card-dark p-6 h-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "rgba(212,165,116,0.15)" }}
                  >
                    {t.avatar}
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
                  "{t.review}"
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
