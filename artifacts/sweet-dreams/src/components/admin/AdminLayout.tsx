import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdDashboard,
  MdPhoto,
  MdViewCarousel,
  MdCheckCircle,
  MdSettings,
  MdMenu,
  MdLogout,
  MdOpenInNew,
  MdShoppingBag,
} from "react-icons/md";
import { useStore } from "../../store/useStore";

export type AdminPage = "dashboard" | "gallery" | "carousel" | "delivered" | "products" | "settings";

interface NavItem {
  id: AdminPage;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard",       icon: MdDashboard },
  { id: "products",  label: "Products & Menu", icon: MdShoppingBag },
  { id: "gallery",   label: "Gallery Manager", icon: MdPhoto },
  { id: "carousel",  label: "Carousel Slides", icon: MdViewCarousel },
  { id: "delivered", label: "Delivered Orders", icon: MdCheckCircle },
  { id: "settings",  label: "Settings",        icon: MdSettings },
];

interface AdminLayoutProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  children: React.ReactNode;
  pageTitle: string;
}

function SidebarContent({
  currentPage, onNavigate, onLogout, onClose,
}: {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  onClose?: () => void;
}) {
  const { state } = useStore();
  return (
    <div className="flex flex-col h-full bg-choco-900 border-r border-caramel-800/30">
      {/* Logo */}
      <div className="p-5 border-b border-caramel-800/30">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎂</span>
          <span className="font-dancing text-lg font-bold text-gradient">{state.settings.shopName}</span>
        </div>
        <p className="text-xs text-choco-300 mb-2">Admin Panel</p>
        <Link to="/" className="flex items-center gap-1 text-xs text-caramel-400 hover:text-caramel-300 transition-colors" onClick={onClose}>
          <MdOpenInNew size={12} /> View Site
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button key={item.id} onClick={() => { onNavigate(item.id); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 text-left ${
                isActive ? "bg-caramel-400/20 text-caramel-300 border-r-2 border-caramel-400" : "text-choco-300 hover:text-caramel-300 hover:bg-white/5"
              }`}>
              <Icon size={20} /> {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-caramel-800/30">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all duration-200">
          <MdLogout size={20} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ currentPage, onNavigate, onLogout, children, pageTitle }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-choco-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 overflow-hidden">
        <SidebarContent currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside className="fixed left-0 top-0 bottom-0 z-50 w-64 md:hidden"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}>
              <SidebarContent currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ADMIN MODE banner — always visible so it's unmistakable */}
        <div className="flex-shrink-0 flex items-center justify-center gap-2 py-1.5 text-xs font-bold tracking-widest uppercase"
          style={{ background: "linear-gradient(90deg,#7c2d12,#b45309,#7c2d12)", color: "#fef3c7" }}>
          <MdSettings size={13} />
          Admin Panel — Private Area
          <MdSettings size={13} />
        </div>

        <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 bg-choco-900/90 backdrop-blur border-b border-orange-900/50 sticky top-0 z-30"
          style={{ boxShadow: "0 1px 0 rgba(180,83,9,0.25)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-caramel-400 hover:text-white transition-colors">
              <MdMenu size={24} />
            </button>
            <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 border border-amber-700/50"
              style={{ background: "rgba(120,53,15,0.4)" }}>
              <MdSettings size={13} /> ADMIN
            </span>
            <h1 className="font-playfair text-lg font-bold text-white">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="flex items-center gap-1 text-sm text-amber-400/80 hover:text-amber-300 transition-colors">
              <MdOpenInNew size={15} />
              <span className="hidden sm:inline">View Public Site</span>
            </Link>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border border-amber-700/50 text-amber-300"
              style={{ background: "rgba(120,53,15,0.5)" }}>
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
