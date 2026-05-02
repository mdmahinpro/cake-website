import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "../shared/AnimatedSection";
import OrderButton from "../shared/OrderButton";
import { useStore } from "../../store/useStore";

export default function DeliveredSection() {
  const { state } = useStore();
  const { gallery } = state;
  const navigate = useNavigate();

  // Only show items that have an actual image
  const delivered = gallery
    .filter((item) => item.type === "delivered" && item.imageUrl)
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {delivered.map((item, i) => (
            <motion.div
              key={item.id}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              style={{ aspectRatio: "4 / 3" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 20px 48px rgba(0,190,255,0.15)" }}
            >
              <motion.img
                src={item.imageUrl}
                alt={item.caption}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />

              {/* Gradient overlay — always subtly visible, stronger on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to top, rgba(1,13,30,0.95) 0%, rgba(1,13,30,0.3) 55%, transparent 100%)",
                }}
              />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm text-white/90 line-clamp-2 font-poppins pr-14 leading-snug translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  {item.caption}
                </p>
              </div>

              {/* Order button */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200">
                <OrderButton caption={item.caption} category={item.category} size="sm" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/gallery")}
            className="btn-outline"
          >
            See All Works
          </button>
        </div>
      </div>
    </section>
  );
}
