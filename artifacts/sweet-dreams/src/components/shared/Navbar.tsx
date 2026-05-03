import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { useStore } from "../../store/useStore";
import { useTheme } from "../../context/ThemeContext";
import { useLang } from "../../context/LangContext";
import { openOrderChannel } from "../../utils/order";

const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "Gallery", to: "/gallery" },
];

function CakeLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <rect x="11" y="4"  width="8"  height="7"  rx="2"   fill="#00beff"   opacity="0.9" />
      <rect x="7"  y="10" width="16" height="8"  rx="2.5" fill="#00a2dc"   />
      <rect x="3"  y="17" width="24" height="10" rx="3"   fill="#0088bb"   />
      <rect x="7"  y="9"  width="16" height="2"  rx="1"   fill="white" opacity="0.7" />
      <rect x="3"  y="16" width="24" height="2"  rx="1"   fill="white" opacity="0.7" />
      <rect x="12" y="0"  width="3"  height="5"  rx="1.5" fill="#ff6b9d"  />
      <rect x="18" y="1"  width="3"  height="4"  rx="1.5" fill="#ffd93d"  />
      <ellipse cx="13.5" cy="0"  rx="2" ry="2.5" fill="#ffb300" opacity="0.9" />
      <ellipse cx="19.5" cy="1"  rx="2" ry="2.5" fill="#ffb300" opacity="0.9" />
    </svg>
  );
}

/* ── Two-dot theme toggle pill ── */
function ThemeToggle() {
  const { siteTheme, toggleTheme } = useTheme();
  const isNavy = siteTheme === "navy";
  const pillBg     = isNavy ? "rgba(0,190,255,0.08)"  : "rgba(240,217,168,0.1)";
  const pillBorder = isNavy ? "rgba(0,190,255,0.25)"  : "rgba(240,217,168,0.3)";

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.88 }}
      title={isNavy ? "Switch to Chocolate theme" : "Switch to Navy theme"}
      aria-label="Toggle site theme"
      className="relative flex items-center gap-1.5 h-7 px-2.5 rounded-full transition-all duration-300 select-none focus:outline-none"
      style={{ background: pillBg, border: `1px solid ${pillBorder}` }}
    >
      <motion.span
        animate={{ scale: isNavy ? 1.3 : 1, opacity: isNavy ? 1 : 0.28 }}
        transition={{ duration: 0.25 }}
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: "#00beff" }}
      />
      <span className="w-px h-3 bg-white/10 flex-shrink-0" />
      <motion.span
        animate={{ scale: !isNavy ? 1.3 : 1, opacity: !isNavy ? 1 : 0.28 }}
        transition={{ duration: 0.25 }}
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: "#f0d9a8" }}
      />
    </motion.button>
  );
}

/* ── EN / BN language toggle ── */
function LangToggle() {
  const { lang, toggleLang } = useLang();
  const isEn = lang === "en";

  return (
    <motion.button
      onClick={toggleLang}
      whileTap={{ scale: 0.88 }}
      aria-label="Toggle language"
      className="relative flex items-center h-7 px-2.5 rounded-full select-none focus:outline-none transition-all duration-300"
      style={{ background: "rgba(0,190,255,0.07)", border: "1px solid rgba(0,190,255,0.22)" }}
    >
      <span className="text-[11px] font-bold font-poppins leading-none transition-all duration-200"
        style={{ color: isEn ? "#00beff" : "rgba(0,190,255,0.35)" }}>
        EN
      </span>
      <span className="mx-1 text-[10px] leading-none" style={{ color: "rgba(0,190,255,0.25)" }}>/</span>
      <span className="text-[11px] font-bold font-poppins leading-none transition-all duration-200"
        style={{ color: !isEn ? "#00beff" : "rgba(0,190,255,0.35)" }}>
        BN
      </span>
    </motion.button>
  );
}

export default function Navbar() {
  const { state } = useStore();
  const { settings } = state;
  const { siteTheme } = useTheme();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleOrder() { openOrderChannel(settings, "General inquiry", "Custom"); }
  const OrderIcon = settings.orderChannel === "whatsapp" ? FaWhatsapp : FaFacebook;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-caramel-800/20 ${
          scrolled
            ? "bg-choco-900/95 backdrop-blur-2xl shadow-lg shadow-black/40"
            : "bg-choco-900/80 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <CakeLogo />
            <span className="font-dancing text-2xl md:text-3xl font-bold text-gradient">
              {settings.shopName}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}
                className="relative text-caramel-200 hover:text-caramel-400 font-poppins text-sm font-medium transition-colors duration-200 group">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-full h-px bg-caramel-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Desktop: both toggles side-by-side */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <LangToggle />
            </div>

            {/* Mobile: only EN/BN toggle (color toggle lives in hamburger) */}
            <div className="md:hidden">
              <LangToggle />
            </div>

            {/* Desktop Order Now button */}
            <button onClick={handleOrder}
              className="hidden md:flex items-center gap-2 btn-primary px-4 py-2 text-sm">
              <OrderIcon size={16} />
              Order Now
            </button>

            {/* Hamburger — mobile only */}
            <button onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col gap-1.5 p-2 text-caramel-400 min-w-[44px] min-h-[44px] items-center justify-center"
              aria-label="Open menu">
              <span className="block w-6 h-0.5 bg-caramel-400 rounded" />
              <span className="block w-6 h-0.5 bg-caramel-400 rounded" />
              <span className="block w-6 h-0.5 bg-caramel-400 rounded" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-choco-900/98 backdrop-blur-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Menu header — theme toggle lives here on mobile */}
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <span className="text-xs font-poppins text-caramel-400/60">
                  {siteTheme === "navy" ? "Navy" : "Chocolate"}
                </span>
              </div>
              <button onClick={() => setMenuOpen(false)}
                className="text-caramel-400 hover:text-caramel-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6"  x2="6"  y2="18" />
                  <line x1="6"  y1="6"  x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              {[...NAV_LINKS, { label: "Order Now", to: null }].map((link, i) => (
                <motion.div key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}>
                  {link.to ? (
                    <Link to={link.to} onClick={() => setMenuOpen(false)}
                      className="font-playfair text-4xl text-white hover:text-caramel-400 transition-colors duration-200">
                      {link.label}
                    </Link>
                  ) : (
                    <button onClick={() => { setMenuOpen(false); handleOrder(); }}
                      className="btn-primary w-48 flex items-center justify-center gap-2 text-lg">
                      <OrderIcon size={20} />
                      {link.label}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex justify-center gap-4 pb-10">
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-caramel-700 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-white transition-all">
                  <FaWhatsapp size={18} />
                </a>
              )}
              {settings.facebookPageUrl && (
                <a href={settings.facebookPageUrl} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-caramel-700 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-white transition-all">
                  <FaFacebook size={18} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
