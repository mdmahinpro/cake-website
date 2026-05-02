import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import SparkleField from "../shared/SparkleField";
import { useStore } from "../../store/useStore";
import { buildWhatsAppUrl, buildFacebookUrl } from "../../utils/order";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" as const },
});

export default function CTASection() {
  const { state } = useStore();
  const { settings } = state;

  const whatsappUrl = buildWhatsAppUrl(settings.whatsappNumber, "General inquiry", "Custom");
  const facebookUrl = buildFacebookUrl(settings.facebookPageUrl, "General inquiry");

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #010d1e 0%, #051e36 40%, #010d1e 100%)",
        backgroundSize: "300% 300%",
        animation: "gradientShift 6s ease infinite",
      }}
    >
      {/* Aqua radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,190,255,0.08) 0%, transparent 70%)",
        }}
      />
      <SparkleField />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8 text-center">
        <motion.h2 {...fadeUp(0)} className="section-title">
          Ready To Order Your Dream Cake?
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="font-poppins text-lg text-caramel-200 max-w-xl leading-relaxed"
        >
          Get your custom handcrafted cake made with love and delivered fresh.
          Reach out to us today and let&rsquo;s make something magical together!
        </motion.p>

        <motion.div
          {...fadeUp(0.2)}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          {/* WhatsApp */}
          <div className="relative">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-full text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 min-h-[52px]"
              style={{
                background: "linear-gradient(to right, #22c55e, #15803d)",
                boxShadow: "0 10px 30px rgba(34,197,94,0.3)",
              }}
            >
              <FaWhatsapp size={22} />
              Order on WhatsApp
            </a>
            {settings.orderChannel === "whatsapp" && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Recommended
              </span>
            )}
          </div>

          {/* Facebook */}
          <div className="relative">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-full text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 min-h-[52px]"
              style={{
                background: "linear-gradient(to right, #3b82f6, #1d4ed8)",
                boxShadow: "0 10px 30px rgba(59,130,246,0.3)",
              }}
            >
              <FaFacebook size={22} />
              Message on Facebook
            </a>
            {settings.orderChannel === "facebook" && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                Recommended
              </span>
            )}
          </div>
        </motion.div>

        {settings.whatsappNumber && (
          <motion.a
            {...fadeUp(0.3)}
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caramel-300 text-sm hover:text-caramel-400 transition-colors"
          >
            +{settings.whatsappNumber}
          </motion.a>
        )}
      </div>
    </section>
  );
}
