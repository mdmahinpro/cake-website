import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "../shared/AnimatedSection";
import OrderButton from "../shared/OrderButton";
import { useStore } from "../../store/useStore";

export default function DeliveredSection() {
  const { state } = useStore();
  const { gallery } = state;
  const navigate = useNavigate();

  const delivered = gallery
    .filter((item) => item.type === "delivered")
    .slice(0, 6);

  if (delivered.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-choco-800 to-choco-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <p className="section-subtitle mb-2">Happy Customers, Happy Hearts</p>
          <h2 className="section-title">Delivered With Love</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-caramel-400 to-rose-cake mx-auto mt-4 rounded-full" />
        </AnimatedSection>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {delivered.map((item, i) => (
            <motion.div
              key={item.id}
              className="break-inside-avoid rounded-3xl overflow-hidden relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full object-cover brightness-95 saturate-110"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-choco-700 to-choco-900 flex items-center justify-center text-5xl">
                  🎂
                </div>
              )}

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pb-5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}>
                <p className="text-sm text-white translate-y-2 group-hover:translate-y-0 opacity-70 group-hover:opacity-100 transition-all duration-300 pr-16">
                  {item.caption}
                </p>
              </div>

              {/* Order button */}
              <div className="absolute bottom-3 right-3">
                <OrderButton
                  caption={item.caption}
                  category={item.category}
                  size="sm"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/gallery?filter=delivered")}
            className="btn-outline"
          >
            See All Works
          </button>
        </div>
      </div>
    </section>
  );
}
