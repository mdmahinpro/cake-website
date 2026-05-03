import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLogin from "../components/admin/AdminLogin";
import AdminLayout, { type AdminPage as AdminPageId } from "../components/admin/AdminLayout";
import DashboardPage from "../components/admin/DashboardPage";
import GalleryManager from "../components/admin/GalleryManager";
import SettingsPage from "../components/admin/SettingsPage";
import ProductManager from "../components/admin/ProductManager";
import SyncPanel from "../components/admin/SyncPanel";
import { useStore } from "../store/useStore";

const PAGE_TITLES: Record<AdminPageId, string> = {
  dashboard: "Dashboard",
  products:  "Products & Menu",
  delivered: "Delivered Orders",
  settings:  "Settings",
  sync:      "Backend Sync",
};

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -16 },
};

export default function AdminPage() {
  const { dispatch } = useStore();
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("cakeauth") === "true"
  );
  const [currentPage, setCurrentPage] = useState<AdminPageId>("dashboard");

  function handleLogin() {
    setAuthed(true);
    dispatch({ type: "SET_AUTHENTICATED", payload: true });
  }

  function handleLogout() {
    sessionStorage.removeItem("cakeauth");
    setAuthed(false);
    dispatch({ type: "SET_AUTHENTICATED", payload: false });
  }

  if (!authed) return <AdminLogin onSuccess={handleLogin} />;

  function renderPage() {
    switch (currentPage) {
      case "dashboard": return <DashboardPage onNavigate={setCurrentPage} />;
      case "products":  return <ProductManager />;
      case "delivered": return <GalleryManager filterDelivered />;
      case "settings":  return <SettingsPage />;
      case "sync":      return <SyncPanel />;
      default:          return <DashboardPage onNavigate={setCurrentPage} />;
    }
  }

  return (
    <AdminLayout currentPage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} pageTitle={PAGE_TITLES[currentPage]}>
      <AnimatePresence mode="wait">
        <motion.div key={currentPage} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }}>
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </AdminLayout>
  );
}
