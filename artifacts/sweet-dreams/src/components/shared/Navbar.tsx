import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { useStore } from "../../store/useStore";
import { openOrderChannel } from "../../utils/order";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Gallery", to: "/gallery" },
];

export default function Navbar() {
  const { state } = useStore();
  const { settings } = state;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleOrder() {
    openOrderChannel(settings, "General inquiry", "Custom");
  }

  const OrderIcon =
    settings.orderChannel === "whatsapp" ? FaWhatsapp : FaFacebook;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-caramel-800/30 ${
          scrolled
            ? "bg-choco-900/95 backdrop-blur-2xl shadow-lg shadow-black/40"
            : "bg-choco-900/80 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🎂</span>
            <span
              className="font-dancing text-2xl md:text-3xl font-bold bg-gradient-to-r from-caramel-300 to-rose-cake bg-clip-text text-transparent"
            >
              {settings.shopName}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-caramel-200 hover:text-caramel-400 font-poppins text-sm font-medium transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-full h-px bg-caramel-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOrder}
              className="hidden md:flex items-center gap-2 btn-primary px-4 py-2 text-sm"
            >
              <OrderIcon size={16} />
              Order Now
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col gap-1.5 p-2 text-caramel-400"
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-caramel-400 rounded" />
              <span className="block w-6 h-0.5 bg-caramel-400 rounded" />
              <span className="block w-6 h-0.5 bg-caramel-400 rounded" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-choco-900/98 backdrop-blur-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Close button */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-caramel-400 hover:text-caramel-200 transition-colors"
                aria-label="Close menu"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              {[...NAV_LINKS, { label: "Order Now", to: null }].map(
                (link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.1 }}
                  >
                    {link.to ? (
                      <Link
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        className="font-playfair text-4xl text-white hover:text-caramel-400 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleOrder();
                        }}
                        className="btn-primary w-48 flex items-center justify-center gap-2 text-lg"
                      >
                        <OrderIcon size={20} />
                        {link.label}
                      </button>
                    )}
                  </motion.div>
                )
              )}
            </div>

            {/* Social icons row */}
            <div className="flex justify-center gap-4 pb-10">
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-caramel-700 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-white transition-all"
                >
                  <FaWhatsapp size={18} />
                </a>
              )}
              {settings.facebookPageUrl && (
                <a
                  href={settings.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-caramel-700 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-white transition-all"
                >
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
