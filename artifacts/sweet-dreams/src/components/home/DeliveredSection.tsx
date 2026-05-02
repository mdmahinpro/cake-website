import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import AnimatedSection from "../shared/AnimatedSection";
import OrderButton from "../shared/OrderButton";
import { useStore } from "../../store/useStore";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";

export default function DeliveredSection() {
  const { state } = useStore();
  const { gallery } = state;
  const navigate = useNavigate();
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];

  const delivered = gallery
    .filter((item) => item.type === "delivered" && item.imageUrl)
    .slice(0, 6);

  if (delivered.length === 0) return null;

  const cardBg = siteTheme === "navy" ? "#031525" : "#1e0904";

  return (
    <section className="py-20 bg-gradient-to-b from-choco-800 to-choco-900 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2">Happy Customers, Happy Hearts</p>
          <h2 className="section-title">Delivered With Love</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {delivered.map((item, i) => (
            <motion.div
              key={item.id}
              className="rounded-3xl overflow-hidden group flex flex-col"
              style={{ background: cardBg, border: `1px solid rgba(${tokens.accentRgb},0.12)` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: `0 20px 48px rgba(${tokens.accentRgb},0.15)` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <motion.img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Order button — top right on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <OrderButton caption={item.caption} category={item.category} size="sm" />
                </div>
              </div>

              {/* Caption + Review */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <p className="text-sm text-white/90 font-poppins leading-snug line-clamp-2">
                  {item.caption}
                </p>

                {item.review && (
                  <div
                    className="flex gap-2 rounded-2xl p-3"
                    style={{ background: `rgba(${tokens.accentRgb},0.06)`, borderLeft: `2px solid rgba(${tokens.accentRgb},0.4)` }}
                  >
                    <FaQuoteLeft size={10} className="text-caramel-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-caramel-200 italic leading-relaxed">
                      {item.review}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => navigate("/gallery")} className="btn-outline">
            See All Works
          </button>
        </div>
      </div>
    </section>
  );
}
