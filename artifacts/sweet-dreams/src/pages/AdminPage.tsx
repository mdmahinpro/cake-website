import { useState } from "react";
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
      case "dashboard":
        return <DashboardPage onNavigate={setCurrentPage} />;
      case "gallery":
        return <GalleryManager />;
      case "carousel":
        return <CarouselManager />;
      case "delivered":
        return <GalleryManager filterDelivered />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      pageTitle={PAGE_TITLES[currentPage]}
    >
      {renderPage()}
    </AdminLayout>
  );
}
