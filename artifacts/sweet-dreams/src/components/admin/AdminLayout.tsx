import { Link } from "react-router-dom";
import {
  MdDashboard, MdPhoto, MdViewCarousel, MdCheckCircle,
  MdSettings, MdLogout, MdOpenInNew, MdShoppingBag, MdCloudUpload,
} from "react-icons/md";
import { useStore } from "../../store/useStore";

export type AdminPage = "dashboard" | "gallery" | "carousel" | "delivered" | "products" | "settings" | "publish";

interface NavItem {
  id: AdminPage;
  label: string;
  short: string;
  icon: React.ElementType;
}

const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard",        short: "Home",      icon: MdDashboard },
  { id: "products",  label: "Products & Menu",  short: "Products",  icon: MdShoppingBag },
  { id: "gallery",   label: "Gallery Manager",  short: "Gallery",   icon: MdPhoto },
  { id: "carousel",  label: "Carousel Slides",  short: "Carousel",  icon: MdViewCarousel },
  { id: "delivered", label: "Delivered Orders", short: "Delivered", icon: MdCheckCircle },
  { id: "settings",  label: "Settings",         short: "Settings",  icon: MdSettings },
  { id: "publish",   label: "Publish Site",     short: "Publish",   icon: MdCloudUpload },
];

interface Props {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onLogout: () => void;
  children: React.ReactNode;
  pageTitle: string;
}

const SIDEBAR_BG  = "rgba(1,13,30,0.98)";
const BORDER      = "rgba(0,190,255,0.14)";
const ACTIVE_BG   = "rgba(0,190,255,0.10)";
const ACTIVE_TEXT = "#00beff";
const IDLE_TEXT   = "#2a6eb5";

function DesktopSidebar({ current, onNavigate, onLogout }: { current: AdminPage; onNavigate: (p: AdminPage) => void; onLogout: () => void }) {
  const { state } = useStore();
  return (
    <div className="flex flex-col h-full" style={{ background: SIDEBAR_BG, borderRight: `1px solid ${BORDER}` }}>
      {/* Brand */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-dancing text-base font-bold truncate" style={{ color: ACTIVE_TEXT }}>
            {state.settings.shopName}
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: ACTIVE_TEXT }}>
          Admin Panel
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2.5 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = current === id;
          return (
            <button key={id} onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 text-left"
              style={{
                background: active ? ACTIVE_BG : "transparent",
                color: active ? ACTIVE_TEXT : IDLE_TEXT,
                borderLeft: active ? `2px solid ${ACTIVE_TEXT}` : "2px solid transparent",
              }}>
              <Icon size={19} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
        <Link to="/" target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors mb-0.5"
          style={{ color: IDLE_TEXT }}
          onMouseEnter={e => (e.currentTarget.style.color = ACTIVE_TEXT)}
          onMouseLeave={e => (e.currentTarget.style.color = IDLE_TEXT)}>
          <MdOpenInNew size={14} /> View Public Site
        </Link>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all duration-200">
          <MdLogout size={17} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ currentPage, onNavigate, onLogout, children, pageTitle }: Props) {
  return (
    <div className="min-h-dvh flex" style={{ background: "#010d1e" }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 h-screen sticky top-0 overflow-hidden">
        <DesktopSidebar current={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 sticky top-0 z-30"
          style={{ background: "rgba(1,13,30,0.96)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase"
              style={{ color: ACTIVE_TEXT, background: ACTIVE_BG, border: `1px solid ${BORDER}` }}>
              Admin
            </span>
            <h1 className="font-playfair text-base sm:text-lg font-bold text-white truncate">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" target="_blank"
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors"
              style={{ color: ACTIVE_TEXT, borderColor: BORDER }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = ACTIVE_BG; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <MdOpenInNew size={13} />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            {/* Mobile-only logout */}
            <button onClick={onLogout}
              className="md:hidden flex items-center gap-1 text-xs text-red-400 px-2.5 py-1.5 rounded-lg border border-red-900/30 hover:bg-red-900/20 transition-colors">
              <MdLogout size={14} />
            </button>
          </div>
        </header>

        {/* Content — extra bottom padding for mobile nav */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom navigation ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 safe-area-pb"
        style={{ background: "rgba(1,13,30,0.98)", borderTop: `1px solid ${BORDER}`, backdropFilter: "blur(16px)" }}>
        <div className="grid grid-cols-7">
          {NAV.map(({ id, short, icon: Icon }) => {
            const active = currentPage === id;
            return (
              <button key={id} onClick={() => onNavigate(id)}
                className="flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors active:scale-95"
                style={{ color: active ? ACTIVE_TEXT : IDLE_TEXT, background: active ? ACTIVE_BG : "transparent" }}>
                <Icon size={22} />
                <span className="text-[9px] font-semibold leading-none">{short}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
