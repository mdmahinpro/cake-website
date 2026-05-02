import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { useStore } from "../../store/useStore";
import { openOrderChannel } from "../../utils/order";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Gallery", to: "/gallery" },
];

export default function Footer() {
  const { state } = useStore();
  const { settings } = state;

  function handleOrder() {
    openOrderChannel(settings, "General inquiry", "Custom");
  }

  const socialLinks = [
    {
      icon: FaWhatsapp,
      href: settings.whatsappNumber
        ? `https://wa.me/${settings.whatsappNumber}`
        : null,
      label: "WhatsApp",
    },
    {
      icon: FaFacebook,
      href: settings.facebookPageUrl || null,
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      href: settings.instagramUrl || null,
      label: "Instagram",
    },
    {
      icon: FaYoutube,
      href: settings.youtubeChannelUrl || null,
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-choco-900 border-t border-caramel-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left: Logo + tagline + social */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎂</span>
              <span className="font-dancing text-2xl font-bold bg-gradient-to-r from-caramel-300 to-rose-cake bg-clip-text text-transparent">
                {settings.shopName}
              </span>
            </div>
            <p className="text-choco-300 text-sm leading-relaxed">
              {settings.tagline}
            </p>
            <div className="flex gap-3 mt-2">
              {socialLinks.map(({ icon: Icon, href, label }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full border border-caramel-700 flex items-center justify-center text-caramel-400 hover:bg-caramel-400 hover:text-white hover:border-caramel-400 transition-all duration-200"
                  >
                    <Icon size={18} />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Center: Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-playfair text-lg font-bold text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-choco-300 hover:text-caramel-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleOrder}
                  className="text-choco-300 hover:text-caramel-400 transition-colors duration-200 text-sm text-left"
                >
                  Order Now
                </button>
              </li>
            </ul>
          </div>

          {/* Right: Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-playfair text-lg font-bold text-white">
              Contact
            </h3>
            <div className="flex flex-col gap-2 text-sm text-choco-300">
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-caramel-400 transition-colors"
                >
                  <FaWhatsapp size={16} />
                  +{settings.whatsappNumber}
                </a>
              )}
              {settings.facebookPageUrl && (
                <a
                  href={settings.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-caramel-400 transition-colors"
                >
                  <FaFacebook size={16} />
                  Facebook Page
                </a>
              )}
            </div>
            <button onClick={handleOrder} className="btn-primary text-sm w-fit mt-2">
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-caramel-800/20 py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-choco-400">
          © 2025 {settings.shopName}. Made with ❤️ by TECHELY
        </p>
      </div>
    </footer>
  );
}
