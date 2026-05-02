import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SparkleField from "../components/shared/SparkleField";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-choco-900 relative flex items-center justify-center px-4 overflow-hidden">
      <SparkleField />
      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-5"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.span
          className="text-8xl select-none"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          🍰
        </motion.span>

        <h1 className="font-playfair font-black text-8xl text-gradient">404</h1>

        <h2 className="section-title">Page Not Found</h2>

        <p className="font-dancing text-2xl text-caramel-300">
          Looks like this page got eaten...
        </p>

        <p className="text-caramel-200 text-base max-w-xs">
          But our cakes are always found! Head back home and order something delicious.
        </p>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 mt-2">
            🎂 Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
