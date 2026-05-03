import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import SparkleField from "../shared/SparkleField";

function getAdminPassword() {
  return (
    (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ||
    localStorage.getItem("sd_admin_password") ||
    "admin123"
  );
}

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === getAdminPassword()) {
      sessionStorage.setItem("cakeauth", "true");
      onSuccess();
    } else {
      setError(true);
      setShakeKey((k) => k + 1);
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-choco-900 relative flex items-start justify-center px-4 pt-20 overflow-hidden">
      <SparkleField />
      <AnimatePresence mode="wait">
        <motion.div
          key={shakeKey}
          className="relative z-10 card-glass max-w-sm w-full mx-auto p-8"
          animate={
            shakeKey > 0
              ? { x: [0, -15, 15, -15, 15, -8, 8, -4, 4, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-2 mb-8">
            <MdLock className="text-5xl text-caramel-400 animate-bounce-slow" />
            <h1 className="font-playfair text-3xl font-bold text-white">
              Admin Panel
            </h1>
            <p className="font-dancing text-xl text-caramel-300">
              Sweet Dreams Cakes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin password"
                className={`input-dark pr-12 transition-all duration-200 ${
                  error ? "border-red-500 ring-1 ring-red-500" : ""
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-caramel-400 hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-400 text-sm text-center"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Incorrect password. Please try again.
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" className="btn-primary w-full text-center mt-2">
              Login
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
