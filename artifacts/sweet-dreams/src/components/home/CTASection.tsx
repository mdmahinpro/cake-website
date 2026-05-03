import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import SparkleField from "../shared/SparkleField";
import { useStore } from "../../store/useStore";
import { useTheme, THEME_TOKENS } from "../../context/ThemeContext";
import { buildWhatsAppUrl, buildFacebookUrl } from "../../utils/order";
import { useT } from "../../i18n/translations";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" as const },
});

export default function CTASection() {
  const { state } = useStore();
  const { settings } = state;
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];
  const t = useT();

  const whatsappUrl = buildWhatsAppUrl(settings.whatsappNumber, "General inquiry", "Custom");
  const facebookUrl = buildFacebookUrl(settings.facebookPageUrl, "General inquiry");

  return (
    <section
      className="relative py-24 overflow-hidden transition-colors duration-700"
      style={{
        backgroundImage: tokens.ctaBg,
        backgroundSize: "300% 300%",
        animation: "gradientShift 6s ease infinite",
      }}
    >
      <div className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: tokens.ctaGlow }} />
      <SparkleField />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8 text-center">
        <motion.h2 {...fadeUp(0)} className="section-title font-hind">
          {t.cta.title}
        </motion.h2>

        <motion.p {...fadeUp(0.1)}
          className="font-hind text-lg text-caramel-200 max-w-xl leading-relaxed">
          {t.cta.desc}
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          {/* WhatsApp */}
          <div className="relative">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-full text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 min-h-[52px] font-hind"
              style={{ background: "linear-gradient(to right, #22c55e, #15803d)", boxShadow: "0 10px 30px rgba(34,197,94,0.3)" }}>
              <FaWhatsapp size={22} />
              {t.cta.whatsapp}
            </a>
            {settings.orderChannel === "whatsapp" && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap font-hind">
                {t.cta.recommended}
              </span>
            )}
          </div>

          {/* Facebook */}
          <div className="relative">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-full text-white font-semibold shadow-xl transition-all duration-300 hover:scale-105 min-h-[52px] font-hind"
              style={{ background: "linear-gradient(to right, #3b82f6, #1d4ed8)", boxShadow: "0 10px 30px rgba(59,130,246,0.3)" }}>
              <FaFacebook size={22} />
              {t.cta.facebook}
            </a>
            {settings.orderChannel === "facebook" && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap font-hind">
                {t.cta.recommended}
              </span>
            )}
          </div>
        </motion.div>

        {settings.whatsappNumber && (
          <motion.a {...fadeUp(0.3)}
            href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
            className="text-caramel-300 text-sm hover:text-caramel-400 transition-colors font-hind">
            +{settings.whatsappNumber}
          </motion.a>
        )}
      </div>
    </section>
  );
}
