import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type Settings } from "../../store/useStore";
import { DEMO_GALLERY, DEMO_CAROUSEL, DEMO_PRODUCT_CATEGORIES, DEMO_PRODUCTS } from "../../data/demoData";

function Toggle({ on, onToggle, size = "sm" }: { on: boolean; onToggle: () => void; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const trackW = isLg ? 56 : 44;
  const trackH = isLg ? 28 : 22;
  const thumbS = isLg ? 22 : 16;
  const pad    = 3;
  const onX    = trackW - thumbS - pad;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className="rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel-400"
      style={{
        width: trackW, height: trackH,
        minWidth: trackW, maxWidth: "none",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        display: "inline-block",
        background: on ? "#00beff" : "#031525",
        border: `1.5px solid ${on ? "#00beff" : "rgba(0,190,255,0.25)"}`,
        transition: "background 0.25s, border-color 0.25s",
      }}>
      <motion.span
        className="absolute rounded-full bg-white shadow"
        style={{ width: thumbS, height: thumbS, top: pad - 1.5, left: 0 }}
        animate={{ x: on ? onX : pad }}
        transition={{ type: "spring", stiffness: 600, damping: 38 }}
      />
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl flex flex-col gap-4 p-4 sm:p-5"
      style={{ background: "rgba(3,21,37,0.85)", border: "1px solid rgba(0,190,255,0.16)" }}>
      <h3 className="font-playfair text-base font-bold text-white border-b pb-3"
        style={{ borderColor: "rgba(0,190,255,0.14)" }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: "#4dd9ff" }}>{label}</label>
      {children}
      {helper && <p className="text-xs" style={{ color: "#2a6eb5" }}>{helper}</p>}
    </div>
  );
}

function SaveToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="fixed bottom-24 md:bottom-6 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xl"
          style={{ background: "linear-gradient(135deg,#00a2dc,#00beff)", boxShadow: "0 8px 30px rgba(0,190,255,0.4)" }}>
          ✓ Settings saved
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState<Settings>({ ...state.settings });
  const [saved, setSaved] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const isFirstRender = useRef(true);

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError]     = useState("");
  const [pwSaved, setPwSaved]     = useState(false);

  /* ── Auto-save: dispatch every time form changes (skip mount) ── */
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const t = setTimeout(() => {
      dispatch({ type: "SET_SETTINGS", payload: form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
    return () => clearTimeout(t);
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    const stored = localStorage.getItem("sd_admin_password") ||
      import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (currentPw !== stored)  { setPwError("Current password is incorrect"); return; }
    if (newPw.length < 6)      { setPwError("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw)   { setPwError("Passwords do not match"); return; }
    localStorage.setItem("sd_admin_password", newPw);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwSaved(true); setTimeout(() => setPwSaved(false), 2500);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sweet-dreams-data.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.settings) { dispatch({ type: "SET_SETTINGS", payload: parsed.settings }); setForm(parsed.settings); }
        if (parsed.gallery)  dispatch({ type: "SET_GALLERY",  payload: parsed.gallery });
        if (parsed.carousel) dispatch({ type: "SET_CAROUSEL", payload: parsed.carousel });
        alert("Data imported successfully!");
      } catch { alert("Invalid JSON file"); }
    };
    reader.readAsText(file);
  }

  function handleRestoreDemo() {
    dispatch({ type: "SET_GALLERY",     payload: DEMO_GALLERY });
    dispatch({ type: "SET_CAROUSEL",    payload: DEMO_CAROUSEL });
    dispatch({ type: "SET_CATEGORIES",  payload: DEMO_PRODUCT_CATEGORIES });
    dispatch({ type: "SET_PRODUCTS",    payload: DEMO_PRODUCTS });
    localStorage.removeItem("cake-demo-loaded");
    localStorage.removeItem("cake-products-loaded-v4");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearAll() {
    const blank: Settings = {
      shopName: "Sweet Dreams Cakes", tagline: "Every cake tells a story of love",
      heroTitle: "Your Dream Cake Starts Here", heroSubtitle: "Handcrafted custom cakes for every occasion",
      whatsappNumber: "8801700000000", facebookPageUrl: "https://facebook.com/yourpage",
      orderChannel: "whatsapp", instagramUrl: "", youtubeChannelUrl: "", accentColor: "#00beff",
    };
    dispatch({ type: "SET_GALLERY",  payload: [] });
    dispatch({ type: "SET_CAROUSEL", payload: [] });
    dispatch({ type: "SET_SETTINGS", payload: blank });
    setForm(blank);
    setClearConfirm(false);
  }

  const isWhatsApp = form.orderChannel === "whatsapp";

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4 pb-6">
      <SaveToast visible={saved} />

      {/* Auto-save notice */}
      <p className="text-xs text-center" style={{ color: "#2a6eb5" }}>
        ✦ Changes save automatically — no button needed
      </p>

      {/* ── Shop Info ── */}
      <Card title="🏪 Shop Info">
        <Field label="Shop Name">
          <input className="input-dark" value={form.shopName}
            onChange={e => set("shopName", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <input className="input-dark" value={form.tagline}
            onChange={e => set("tagline", e.target.value)} />
        </Field>
        <Field label="Hero Title">
          <input className="input-dark" value={form.heroTitle}
            onChange={e => set("heroTitle", e.target.value)} />
        </Field>
        <Field label="Hero Subtitle">
          <input className="input-dark" value={form.heroSubtitle}
            onChange={e => set("heroSubtitle", e.target.value)} />
        </Field>
      </Card>

      {/* ── Order Channel ── */}
      <Card title="📲 How Customers Order">
        <Field label="WhatsApp Number" helper="Include country code without +  (e.g. 8801700000000)">
          <input className="input-dark" value={form.whatsappNumber}
            onChange={e => set("whatsappNumber", e.target.value)}
            placeholder="8801700000000" inputMode="tel" />
        </Field>
        <Field label="Facebook Page URL">
          <input className="input-dark" value={form.facebookPageUrl}
            onChange={e => set("facebookPageUrl", e.target.value)}
            placeholder="https://facebook.com/yourpage" inputMode="url" />
        </Field>

        {/* Order channel toggle */}
        <div className="flex items-center justify-center gap-4 p-4 rounded-2xl"
          style={{ background: "rgba(1,13,30,0.6)", border: "1px solid rgba(0,190,255,0.12)" }}>
          <span className={`text-sm font-semibold transition-colors ${!isWhatsApp ? "text-blue-400" : "text-choco-400"}`}>
            Facebook
          </span>
          <Toggle on={isWhatsApp} onToggle={() => set("orderChannel", isWhatsApp ? "facebook" : "whatsapp")} size="lg" />
          <span className={`text-sm font-semibold transition-colors ${isWhatsApp ? "text-green-400" : "text-choco-400"}`}>
            WhatsApp
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isWhatsApp ? (
            <motion.div key="wa" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-3 rounded-xl text-sm text-green-300 text-center"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
              ✅ Customers will WhatsApp your number
            </motion.div>
          ) : (
            <motion.div key="fb" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-3 rounded-xl text-sm text-blue-300 text-center"
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)" }}>
              💬 Customers will message your Facebook page
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* ── Social Media ── */}
      <Card title="📱 Social Media">
        <Field label="Instagram URL">
          <input className="input-dark" value={form.instagramUrl}
            onChange={e => set("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/yourpage" inputMode="url" />
        </Field>
        <Field label="YouTube Channel URL">
          <input className="input-dark" value={form.youtubeChannelUrl}
            onChange={e => set("youtubeChannelUrl", e.target.value)}
            placeholder="https://youtube.com/@yourchannel" inputMode="url" />
        </Field>
      </Card>

      {/* ── Admin Security ── */}
      <Card title="🔒 Admin Password">
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
          <Field label="Current Password">
            <input type="password" className="input-dark" value={currentPw}
              onChange={e => setCurrentPw(e.target.value)} placeholder="Current password" autoComplete="current-password" />
          </Field>
          <Field label="New Password">
            <input type="password" className="input-dark" value={newPw}
              onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters" autoComplete="new-password" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" className="input-dark" value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" autoComplete="new-password" />
          </Field>
          <AnimatePresence>
            {pwError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-red-400 text-sm">{pwError}</motion.p>
            )}
            {pwSaved && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-green-400 text-sm">✅ Password updated!</motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className="btn-primary w-full sm:w-fit text-sm">
            Update Password
          </button>
        </form>
      </Card>

      {/* ── Data Management ── */}
      <Card title="💾 Data Management">
        {/* Restore demo */}
        <div className="p-3 rounded-xl" style={{ background: "rgba(0,190,255,0.06)", border: "1px solid rgba(0,190,255,0.18)" }}>
          <p className="text-xs mb-2.5" style={{ color: "#4dd9ff" }}>
            🔄 Public site showing no content? Restore the demo gallery, carousel, products and categories instantly.
          </p>
          <button onClick={handleRestoreDemo} className="btn-primary text-sm py-2.5 px-5 w-full sm:w-auto">
            Restore Demo Content
          </button>
        </div>

        {/* Export / import */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="btn-outline text-sm py-2.5 px-5">
            📤 Export JSON
          </button>
          <label className="btn-outline text-sm py-2.5 px-5 cursor-pointer">
            📥 Import JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>

        {/* Clear all */}
        <div className="pt-3" style={{ borderTop: "1px solid rgba(0,190,255,0.12)" }}>
          <p className="text-xs mb-3" style={{ color: "#2a6eb5" }}>
            ⚠️ Clear All will delete all gallery items, carousel slides, and reset settings.
          </p>
          {!clearConfirm ? (
            <button onClick={() => setClearConfirm(true)}
              className="text-sm text-red-400 hover:text-red-300 border border-red-800/40 hover:border-red-600/40 px-4 py-2.5 rounded-full transition-all w-full sm:w-auto">
              🗑️ Clear All Data
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleClearAll}
                className="px-4 py-2.5 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors">
                Yes, delete everything
              </button>
              <button onClick={() => setClearConfirm(false)} className="btn-outline text-sm py-2.5">
                Cancel
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
