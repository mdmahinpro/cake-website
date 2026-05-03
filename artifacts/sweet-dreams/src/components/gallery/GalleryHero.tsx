import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SparkleField from "../shared/SparkleField";
import { useT } from "../../i18n/translations";

export default function GalleryHero() {
  const t = useT();
  return (
    <section className="relative h-48 md:h-64 flex items-center overflow-hidden bg-gradient-to-br from-choco-900 to-choco-700">
      <SparkleField />
      <div className="relative z-10 w-full text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs text-caramel-400/60 mb-2 font-hind">
            <Link to="/" className="hover:text-caramel-400 transition-colors">{t.gallery.home}</Link>
            <span className="mx-1.5">›</span>
            <span>{t.gallery.label}</span>
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl font-black text-white leading-tight font-hind">
            {t.gallery.title}
          </h1>
          <p className="font-dancing text-2xl text-caramel-300 mt-2">
            {t.gallery.subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
