import { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { useStore } from "../../store/useStore";
import { openOrderChannel } from "../../utils/order";

export default function FloatingOrderButton() {
  const { state } = useStore();
  const { settings } = state;
  const [hovered, setHovered] = useState(false);

  const isWhatsApp = settings.orderChannel === "whatsapp";

  function handleClick() {
    openOrderChannel(settings, "General inquiry", "Custom");
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 200, delay: 2 }}
    >
      {/* Tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-white text-choco-900 text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap select-none"
        >
          Order Now!
        </motion.div>
      )}

      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Order Now"
        className={`w-14 h-14 md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow transition-transform hover:scale-110 active:scale-95 ${
          isWhatsApp
            ? "bg-gradient-to-br from-green-400 to-green-600"
            : "bg-gradient-to-br from-blue-500 to-blue-700"
        }`}
      >
        {isWhatsApp ? (
          <FaWhatsapp size={28} color="white" />
        ) : (
          <FaFacebook size={28} color="white" />
        )}
      </button>
    </motion.div>
  );
}
