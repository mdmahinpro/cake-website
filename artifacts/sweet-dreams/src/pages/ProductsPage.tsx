import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import FloatingOrderButton from "../components/shared/FloatingOrderButton";
import SparkleField from "../components/shared/SparkleField";
import OrderButton from "../components/shared/OrderButton";
import AnimatedSection from "../components/shared/AnimatedSection";
import { useStore } from "../store/useStore";
import { useTheme, THEME_TOKENS } from "../context/ThemeContext";
import { useT } from "../i18n/translations";

export default function ProductsPage() {
  const { state } = useStore();
  const { categories, products } = state;
  const { siteTheme } = useTheme();
  const tokens = THEME_TOKENS[siteTheme];
  const t = useT();

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSlug, setActiveSlug] = useState<string>(searchParams.get("cat") || "all");

  useEffect(() => {
    const cat = searchParams.get("cat") || "all";
    setActiveSlug(cat);
  }, [searchParams]);

  function handleFilterChange(slug: string) {
    setActiveSlug(slug);
    if (slug === "all") setSearchParams({});
    else setSearchParams({ cat: slug });
  }

  const filtered = useMemo(() => {
    if (activeSlug === "all") return products;
    const cat = categories.find((c) => c.slug === activeSlug);
    if (!cat) return products;
    return products.filter((p) => p.categoryId === cat.id);
  }, [products, categories, activeSlug]);

  const cardBg = siteTheme === "navy" ? "#031525" : "#1e0904";

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-choco-900 transition-colors duration-700">

        {/* Hero banner */}
        <section className="relative h-48 md:h-64 flex items-center overflow-hidden bg-gradient-to-br from-choco-900 to-choco-700">
          <SparkleField />
          <div className="relative z-10 w-full text-center px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-xs text-caramel-400/60 mb-2 font-hind">
                <Link to="/" className="hover:text-caramel-400 transition-colors">{t.products.home}</Link>
                <span className="mx-1.5">›</span>
                <span>{t.products.label}</span>
              </p>
              <h1 className="font-playfair text-4xl md:text-6xl font-black text-white leading-tight">
                {t.products.title}
              </h1>
              <p className="font-dancing text-2xl text-caramel-300 mt-2">
                {t.products.subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category filter tabs */}
        <div className="sticky top-[64px] z-40 bg-choco-900/90 backdrop-blur-xl border-b border-caramel-800/30 py-3 px-4 transition-colors duration-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 flex-nowrap">
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px] font-hind ${
                  activeSlug === "all"
                    ? "bg-caramel-400 text-choco-900 shadow-lg font-semibold"
                    : "border border-caramel-700/50 text-caramel-300 hover:border-caramel-400 hover:text-white"
                }`}
                style={activeSlug === "all" ? { boxShadow: `0 4px 18px rgba(${tokens.accentRgb},0.35)` } : {}}>
                {t.products.all}
                <span className={`rounded-full px-1.5 text-[10px] font-bold ${activeSlug === "all" ? "bg-choco-900/20 text-choco-900" : "bg-white/10 text-caramel-300"}`}>
                  {products.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const isActive = activeSlug === cat.slug;
                return (
                  <button key={cat.id} onClick={() => handleFilterChange(cat.slug)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px] font-hind ${
                      isActive
                        ? "bg-caramel-400 text-choco-900 shadow-lg font-semibold"
                        : "border border-caramel-700/50 text-caramel-300 hover:border-caramel-400 hover:text-white"
                    }`}
                    style={isActive ? { boxShadow: `0 4px 18px rgba(${tokens.accentRgb},0.35)` } : {}}>
                    {cat.name}
                    <span className={`rounded-full px-1.5 text-[10px] font-bold ${isActive ? "bg-choco-900/20 text-choco-900" : "bg-white/10 text-caramel-300"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-playfair text-2xl text-white mb-2 font-hind">{t.products.noItems}</p>
              <p className="text-caramel-400 text-sm font-hind">{t.products.noItemsDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <AnimatedSection key={product.id} delay={i * 60}>
                  <motion.div
                    className="rounded-3xl overflow-hidden flex flex-col group"
                    style={{ background: cardBg, border: `1px solid rgba(${tokens.accentRgb},0.12)` }}
                    whileHover={{ y: -6, boxShadow: `0 20px 48px rgba(0,0,0,0.5), 0 0 30px rgba(${tokens.accentRgb},0.1)` }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                      {product.imageUrl ? (
                        <motion.img src={product.imageUrl} alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }} loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-choco-700 to-choco-900 flex items-center justify-center">
                          <span className="text-5xl font-playfair font-bold text-caramel-400/30 select-none">SD</span>
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5 pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white bg-caramel-400/90 capitalize leading-tight tracking-wide font-hind">
                          {categories.find((c) => c.id === product.categoryId)?.name ?? ""}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div className="flex-1">
                        <h3 className="font-playfair text-base font-bold text-white leading-snug mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-caramel-300 leading-relaxed line-clamp-2 font-hind">
                          {product.caption}
                        </p>
                      </div>
                      <OrderButton caption={product.name} category={product.categoryId} size="md" />
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingOrderButton />
    </>
  );
}
