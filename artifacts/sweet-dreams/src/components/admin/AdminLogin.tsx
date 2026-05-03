import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import SparkleField from "../shared/SparkleField";
import { fetchShopData, saveShopData, isBackendConfigured } from "../../lib/api";

/** Priority: env var → DB setting → localStorage → built-in default */
function resolvePassword(dbPassword: string): string {
  return (
    (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ||
    dbPassword ||
    localStorage.getItem("sd_admin_password") ||
    "admin123"
  );
}

interface AdminLoginProps {
  onSuccess: () => void;
  adminPassword: string;
}

export default function AdminLogin({ onSuccess, adminPassword }: AdminLoginProps) {
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState(false);
  const [shakeKey, setShakeKey]         = useState(0);

  /* ── Reset-password form ── */
  const [showReset, setShowReset]               = useState(false);
  const [syncToken, setSyncToken]               = useState("");
  const [showSyncToken, setShowSyncToken]       = useState(false);
  const [resetNewPw, setResetNewPw]             = useState("");
  const [resetConfirmPw, setResetConfirmPw]     = useState("");
  const [showResetNewPw, setShowResetNewPw]     = useState(false);
  const [resetError, setResetError]             = useState("");
  const [resetSuccess, setResetSuccess]         = useState(false);
  const [resetting, setResetting]               = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === resolvePassword(adminPassword)) {
      sessionStorage.setItem("cakeauth", "true");
      onSuccess();
    } else {
      setError(true);
      setShakeKey((k) => k + 1);
      setPassword("");
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetError("");

    if (!isBackendConfigured()) {
      setResetError(
        "No backend is configured. Use the VITE_ADMIN_PASSWORD environment variable or clear your browser's localStorage to regain access.",
      );
      return;
    }
    if (!syncToken.trim()) {
      setResetError("Please enter your sync token.");
      return;
    }
    if (resetNewPw.length < 6) {
      setResetError("New password must be at least 6 characters.");
      return;
    }
    if (resetNewPw !== resetConfirmPw) {
      setResetError("Passwords do not match.");
      return;
    }

    setResetting(true);
    try {
      const current = await fetchShopData();
      if (!current) {
        setResetError("Could not connect to the backend. Check your internet connection.");
        return;
      }

      const merged = {
        ...current.data,
        settings: {
          ...((current.data.settings as Record<string, unknown>) ?? {}),
          adminPassword: resetNewPw,
        },
      };

      const result = await saveShopData(merged, syncToken.trim());
      if (!result.ok) {
        const isAuth = result.error?.includes("401") || result.error?.toLowerCase().includes("unauthorized") || result.error?.toLowerCase().includes("token");
        setResetError(
          isAuth
            ? "Incorrect sync token. Check your backend configuration in the Backend Sync panel."
            : (result.error ?? "Failed to reset password. Please try again."),
        );
        return;
      }

      localStorage.setItem("sd_admin_password", resetNewPw);
      setResetSuccess(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch {
      setResetError("An unexpected error occurred. Please try again.");
    } finally {
      setResetting(false);
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
            <h1 className="font-playfair text-3xl font-bold text-white">Admin Panel</h1>
            <p className="font-dancing text-xl text-caramel-300">Sweet Dreams Cakes</p>
          </div>

          {/* ── Login form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
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

          {/* ── Forgot password ── */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={() => {
                setShowReset((s) => !s);
                setResetError("");
                setResetSuccess(false);
                setSyncToken("");
                setResetNewPw("");
                setResetConfirmPw("");
              }}
              className="w-full text-center text-sm transition-colors"
              style={{ color: "#7dd3fc" }}
            >
              {showReset ? "↑ Hide" : "Forgot password?"}
            </button>

            <AnimatePresence>
              {showReset && (
                <motion.div
                  key="reset-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 flex flex-col gap-3">
                    {resetSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-2 py-4 text-green-400 text-sm text-center"
                      >
                        <span className="text-3xl">✓</span>
                        <span>Password reset successfully!</span>
                        <span className="text-xs opacity-70">Reloading in a moment…</span>
                      </motion.div>
                    ) : (
                      <>
                        <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                          Enter your{" "}
                          <strong className="text-white">sync token</strong>{" "}
                          (from the Backend Sync page) to verify your identity and set a new password.
                          The new password will work on{" "}
                          <strong className="text-white">all devices</strong>.
                        </p>

                        <form onSubmit={handleReset} className="flex flex-col gap-3">
                          {/* Sync token */}
                          <div className="relative">
                            <input
                              type={showSyncToken ? "text" : "password"}
                              value={syncToken}
                              onChange={(e) => setSyncToken(e.target.value)}
                              placeholder="Sync token"
                              autoComplete="off"
                              className="input-dark text-sm pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSyncToken((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-caramel-400 hover:text-white transition-colors"
                            >
                              {showSyncToken ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                          </div>

                          {/* New password */}
                          <div className="relative">
                            <input
                              type={showResetNewPw ? "text" : "password"}
                              value={resetNewPw}
                              onChange={(e) => setResetNewPw(e.target.value)}
                              placeholder="New password (min 6 chars)"
                              autoComplete="new-password"
                              className="input-dark text-sm pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowResetNewPw((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-caramel-400 hover:text-white transition-colors"
                            >
                              {showResetNewPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                          </div>

                          {/* Confirm */}
                          <input
                            type="password"
                            value={resetConfirmPw}
                            onChange={(e) => setResetConfirmPw(e.target.value)}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            className="input-dark text-sm"
                          />

                          <AnimatePresence>
                            {resetError && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-red-400 text-xs leading-relaxed"
                              >
                                {resetError}
                              </motion.p>
                            )}
                          </AnimatePresence>

                          <button
                            type="submit"
                            disabled={resetting}
                            className="btn-primary text-sm py-2.5 w-full text-center disabled:opacity-60"
                          >
                            {resetting ? "Resetting…" : "Reset Password"}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
