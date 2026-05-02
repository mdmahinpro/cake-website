import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, type Settings } from "../../store/useStore";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-dark p-6 rounded-3xl flex flex-col gap-4">
      <h3 className="font-playfair text-lg font-bold text-white border-b border-caramel-800/30 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-caramel-300 font-medium">{label}</label>
      {children}
      {helper && <p className="text-xs text-choco-300">{helper}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState<Settings>({ ...state.settings });
  const [saved, setSaved] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  function set(key: keyof Settings, value: Settings[keyof Settings]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    dispatch({ type: "SET_SETTINGS", payload: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    const stored = localStorage.getItem("sd_admin_password") ||
      import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (currentPw !== stored) { setPwError("Current password is incorrect"); return; }
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    localStorage.setItem("sd_admin_password", newPw);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  }

  function handleExport() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sweet-dreams-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.settings) dispatch({ type: "SET_SETTINGS", payload: parsed.settings });
        if (parsed.gallery) dispatch({ type: "SET_GALLERY", payload: parsed.gallery });
        if (parsed.carousel) dispatch({ type: "SET_CAROUSEL", payload: parsed.carousel });
        setForm(parsed.settings || form);
        alert("Data imported successfully!");
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  function handleClearAll() {
    dispatch({ type: "SET_GALLERY", payload: [] });
    dispatch({ type: "SET_CAROUSEL", payload: [] });
    dispatch({ type: "SET_SETTINGS", payload: { shopName: "Sweet Dreams Cakes", tagline: "Every cake tells a story of love", heroTitle: "Your Dream Cake Starts Here", heroSubtitle: "Handcrafted custom cakes for every occasion", whatsappNumber: "8801700000000", facebookPageUrl: "https://facebook.com/yourpage", orderChannel: "whatsapp", instagramUrl: "", youtubeChannelUrl: "", accentColor: "#d4a574" } });
    setClearConfirm(false);
  }

  const isWhatsApp = form.orderChannel === "whatsapp";

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-24">
      {/* Card 1 – Shop Info */}
      <Card title="🏪 Shop Info">
        <Field label="Shop Name">
          <input className="input-dark" value={form.shopName} onChange={(e) => set("shopName", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <input className="input-dark" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Hero Title">
          <input className="input-dark" value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
        </Field>
        <Field label="Hero Subtitle">
          <input className="input-dark" value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
        </Field>
      </Card>

      {/* Card 2 – Order Channel */}
      <Card title="📲 How Customers Place Orders">
        <Field label="WhatsApp Number" helper="Include country code without +. Bangladesh: 880 then number">
          <input className="input-dark" value={form.whatsappNumber}
            onChange={(e) => set("whatsappNumber", e.target.value)}
            placeholder="8801700000000" />
        </Field>
        <Field label="Facebook Page URL">
          <input className="input-dark" value={form.facebookPageUrl}
            onChange={(e) => set("facebookPageUrl", e.target.value)}
            placeholder="https://facebook.com/yourpage" />
        </Field>

        {/* Big toggle */}
        <div className="flex items-center justify-center gap-4 p-4 rounded-2xl my-2" style={{ background: "rgba(26,10,0,0.6)" }}>
          <span className={`font-semibold text-lg transition-colors duration-300 ${!isWhatsApp ? "text-blue-400" : "text-choco-400"}`}>
            Facebook Message
          </span>
          <button
            type="button"
            onClick={() => set("orderChannel", isWhatsApp ? "facebook" : "whatsapp")}
            className={`relative w-20 h-10 rounded-full cursor-pointer transition-all duration-500 flex-shrink-0 ${
              isWhatsApp ? "bg-green-500 shadow-lg" : "bg-blue-600 shadow-lg"
            }`}
          >
            <motion.span
              className="absolute top-1 w-8 h-8 rounded-full bg-white shadow-md"
              animate={{ x: isWhatsApp ? 44 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`font-semibold text-lg transition-colors duration-300 ${isWhatsApp ? "text-green-400" : "text-choco-400"}`}>
            WhatsApp
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isWhatsApp ? (
            <motion.div key="wa" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl text-sm text-green-300 text-center"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}>
              ✅ Customers will WhatsApp your number
            </motion.div>
          ) : (
            <motion.div key="fb" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl text-sm text-blue-300 text-center"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)" }}>
              💬 Customers will message your Facebook page
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Card 3 – Social Media */}
      <Card title="📱 Social Media">
        <Field label="Instagram URL">
          <input className="input-dark" value={form.instagramUrl}
            onChange={(e) => set("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/yourpage" />
        </Field>
        <Field label="YouTube Channel URL">
          <input className="input-dark" value={form.youtubeChannelUrl}
            onChange={(e) => set("youtubeChannelUrl", e.target.value)}
            placeholder="https://youtube.com/@yourchannel" />
        </Field>
      </Card>

      {/* Card 4 – Admin Security */}
      <Card title="🔒 Admin Security">
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
          <Field label="Current Password">
            <input type="password" className="input-dark" value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)} placeholder="Current password" />
          </Field>
          <Field label="New Password">
            <input type="password" className="input-dark" value={newPw}
              onChange={(e) => setNewPw(e.target.value)} placeholder="Min 6 characters" />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" className="input-dark" value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repeat new password" />
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
          <button type="submit" className="btn-primary w-fit text-sm">Update Password</button>
        </form>
      </Card>

      {/* Card 5 – Data Management */}
      <Card title="💾 Data Management">
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="btn-outline text-sm">
            📤 Export JSON
          </button>
          <label className="btn-outline text-sm cursor-pointer">
            📥 Import JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
        <div className="border-t border-caramel-800/30 pt-4">
          <p className="text-xs text-choco-300 mb-3">
            ⚠️ This will delete all gallery items, carousel slides, and reset settings.
          </p>
          {!clearConfirm ? (
            <button onClick={() => setClearConfirm(true)}
              className="text-sm text-red-400 hover:text-red-300 border border-red-800/40 hover:border-red-600/40 px-4 py-2 rounded-full transition-all">
              🗑️ Clear All Data
            </button>
          ) : (
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleClearAll}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors">
                Yes, delete everything
              </button>
              <button onClick={() => setClearConfirm(false)} className="btn-outline text-sm">
                Cancel
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Sticky Save */}
      <div className="fixed bottom-6 right-6 z-30">
        <motion.button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2 shadow-2xl"
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="flex items-center gap-2">
                ✓ Saved!
              </motion.span>
            ) : (
              <motion.span key="label" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                💾 Save All Settings
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
