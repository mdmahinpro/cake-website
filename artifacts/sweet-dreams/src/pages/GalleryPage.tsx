import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import FloatingOrderButton from "../components/shared/FloatingOrderButton";
import GalleryHero from "../components/gallery/GalleryHero";
import FilterBar from "../components/gallery/FilterBar";
import SearchBar from "../components/gallery/SearchBar";
import GalleryGrid from "../components/gallery/GalleryGrid";
import Lightbox from "../components/gallery/Lightbox";
import { useStore } from "../store/useStore";
import type { CakeItem } from "../store/useStore";

export default function GalleryPage() {
  const { state } = useStore();
  const { gallery } = state;
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<string>(
    searchParams.get("cat") || searchParams.get("filter") || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxItem, setLightboxItem] = useState<CakeItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync URL param changes
  useEffect(() => {
    const cat = searchParams.get("cat") || searchParams.get("filter") || "all";
    setActiveFilter(cat);
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    let items = gallery;
    if (activeFilter !== "all") {
      items = items.filter(
        (item) =>
          item.category.toLowerCase() === activeFilter.toLowerCase() ||
          item.type?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.caption.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [gallery, activeFilter, searchQuery]);

  function handleFilterChange(slug: string) {
    setActiveFilter(slug);
    setVisibleCount(12);
    if (slug === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ cat: slug });
    }
    document.getElementById("gallery-grid")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleCardClick(item: CakeItem, index: number) {
    setLightboxItem(item);
    setLightboxIndex(index);
  }

  function handleNext() {
    const next = (lightboxIndex + 1) % filteredItems.length;
    setLightboxIndex(next);
    setLightboxItem(filteredItems[next]);
  }

  function handlePrev() {
    const prev =
      (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxIndex(prev);
    setLightboxItem(filteredItems[prev]);
  }

  function handleClearFilters() {
    setActiveFilter("all");
    setSearchQuery("");
    setSearchParams({});
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <GalleryHero />
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        <div id="gallery-grid" className="bg-choco-900 min-h-screen">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setVisibleCount(12);
            }}
            resultCount={filteredItems.length}
          />
          <GalleryGrid
            items={filteredItems}
            visibleCount={visibleCount}
            onLoadMore={() => setVisibleCount((v) => v + 12)}
            onCardClick={handleCardClick}
            onClearFilters={handleClearFilters}
          />
        </div>
      </main>
      <Footer />
      <FloatingOrderButton />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            index={lightboxIndex}
            items={filteredItems}
            onClose={() => setLightboxItem(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </>
  );
}
