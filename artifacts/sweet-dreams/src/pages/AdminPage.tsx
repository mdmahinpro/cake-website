import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLogin from "../components/admin/AdminLogin";
import AdminLayout, { type AdminPage as AdminPageId } from "../components/admin/AdminLayout";
import DashboardPage from "../components/admin/DashboardPage";
import GalleryManager from "../components/admin/GalleryManager";
import CarouselManager from "../components/admin/CarouselManager";
import SettingsPage from "../components/admin/SettingsPage";

const PAGE_TITLES: Record<AdminPageId, string> = {
  dashboard: "Dashboard",
  gallery: "Gallery Manager",
  carousel: "Carousel Slides",
  delivered: "Delivered Orders",
  settings: "Settings",
};

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("cakeauth") === "true"
  );
  const [currentPage, setCurrentPage] = useState<AdminPageId>("dashboard");

  function handleLogout() {
    sessionStorage.removeItem("cakeauth");
    setAuthed(false);
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  function renderPage() {
    switch (currentPage) {
      case "dashboard": return <DashboardPage onNavigate={setCurrentPage} />;
      case "gallery": return <GalleryManager />;
      case "carousel": return <CarouselManager />;
      case "delivered": return <GalleryManager filterDelivered />;
      case "settings": return <SettingsPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} />;
    }
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      pageTitle={PAGE_TITLES[currentPage]}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
}
