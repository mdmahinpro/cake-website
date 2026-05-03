import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdCloudDone, MdCloudOff, MdSync, MdInfo,
  MdCheckCircle, MdError,
} from "react-icons/md";
import { FaServer } from "react-icons/fa";
import { useStore } from "../../store/useStore";
import {
  getShopId, getSyncToken, getApiBase, isBackendConfigured,
} from "../../lib/api";

const CARD  = { background: "rgba(3,21,37,0.85)", border: "1px solid rgba(0,190,255,0.16)" };
const HINT  = { color: "#2a6eb5" };
const ACCENT = { color: "#00beff" };
const LBL   = { color: "#4dd9ff" };

function StatusDot({ status }: { status: "ok" | "error" | "syncing" | "idle" | "waking" }) {
  const MAP = {
    ok:      { bg: "#22c55e", label: "Synced" },
    error:   { bg: "#ef4444", label: "Error" },
    syncing: { bg: "#f59e0b", label: "Syncing…" },
    waking:  { bg: "#f59e0b", label: "Waking server…" },
    idle:    { bg: "#2a6eb5", label: "Not configured" },
  };
  const { bg, label } = MAP[status];
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {(status === "syncing" || status === "waking") && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: bg }} />
        )}
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: bg }} />
      </span>
      <span className="text-xs font-semibold" style={{ color: bg }}>{label}</span>
    </div>
  );
}


function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl text-xs leading-relaxed"
      style={{ background: "rgba(0,190,255,0.06)", border: "1px solid rgba(0,190,255,0.16)", color: "#7dd3fc" }}>
      <MdInfo size={15} className="flex-shrink-0 mt-0.5" style={ACCENT} />
      <div>{children}</div>
    </div>
  );
}

export default function SyncPanel() {
  const { state, syncStatus, lastSyncedAt, syncError, manualSync } = useStore();

  /* ── Local form state ── */
  const [shopId, setShopId]   = useState(() => getShopId());
  const [token,  setToken]    = useState(() => getSyncToken());
  const [apiUrl, setApiUrl]   = useState(() => getApiBase() || localStorage.getItem("sd_api_url") || "");
  const [saved,  setSaved]    = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  /* Reflect env-var values */
  useEffect(() => {
    if (import.meta.env.VITE_SHOP_ID) setShopId(import.meta.env.VITE_SHOP_ID as string);
    if (import.meta.env.VITE_API_URL) setApiUrl(import.meta.env.VITE_API_URL as string);
  }, []);

  const envLocked = Boolean(import.meta.env.VITE_SHOP_ID);

  function saveConfig() {
    localStorage.setItem("sd_shop_id",    shopId.trim());
    localStorage.setItem("sd_sync_token", token.trim());
    if (apiUrl.trim()) localStorage.setItem("sd_api_url", apiUrl.trim());
    else localStorage.removeItem("sd_api_url");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function testSync() {
    setTesting(true);
    setTestResult(null);

    /* Temporarily apply the form values without saving */
    const prevShopId = localStorage.getItem("sd_shop_id");
    const prevToken  = localStorage.getItem("sd_sync_token");
    const prevUrl    = localStorage.getItem("sd_api_url");

    localStorage.setItem("sd_shop_id",    shopId.trim());
    localStorage.setItem("sd_sync_token", token.trim());
    if (apiUrl.trim()) localStorage.setItem("sd_api_url", apiUrl.trim());

    const { isAuthenticated: _, ...payload } = state;
    const { saveShopData } = await import("../../lib/api");
    const result = await saveShopData(payload as Record<string, unknown>);

    /* Restore if test only (we don't overwrite unless user clicks Save) */
    if (prevShopId !== null) localStorage.setItem("sd_shop_id", prevShopId);
    else localStorage.removeItem("sd_shop_id");
    if (prevToken !== null) localStorage.setItem("sd_sync_token", prevToken);
    else localStorage.removeItem("sd_sync_token");
    if (prevUrl !== null) localStorage.setItem("sd_api_url", prevUrl);
    else localStorage.removeItem("sd_api_url");

    if (result.ok) {
      setTestResult({ ok: true, msg: result.created ? "Connected! Shop created on backend." : "Connected! Data synced successfully." });
      /* Auto-save on successful test */
      localStorage.setItem("sd_shop_id",    shopId.trim());
      localStorage.setItem("sd_sync_token", token.trim());
      if (apiUrl.trim()) localStorage.setItem("sd_api_url", apiUrl.trim());
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } else {
      setTestResult({ ok: false, msg: result.error ?? "Connection failed" });
    }
    setTesting(false);
  }

  const configured = isBackendConfigured();
  const itemCount = state.gallery.length + state.products.length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5 pb-6">

      {/* ── Header ── */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaServer size={18} style={ACCENT} />
              <h2 className="font-playfair text-lg font-bold text-white">Live Backend Sync</h2>
            </div>
            <p className="text-xs leading-relaxed" style={HINT}>
              Every change you make in the admin panel is automatically pushed to the Render backend.
              All visitors worldwide see the latest content instantly — no file uploads needed.
            </p>
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-xl"
          style={{ background: "rgba(0,190,255,0.04)", border: "1px solid rgba(0,190,255,0.1)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={HINT}>Sync Status</p>
            <StatusDot status={syncStatus} />
          </div>
          {lastSyncedAt && (
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={HINT}>Last Saved</p>
              <p className="text-xs font-semibold text-white">
                {new Date(lastSyncedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          )}
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={HINT}>Content</p>
            <p className="text-xs font-semibold text-white">{itemCount} items</p>
          </div>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {syncStatus === "error" && syncError && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-xs"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
              <MdError size={15} className="flex-shrink-0" /> {syncError}
            </motion.div>
          )}
          {syncStatus === "waking" && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-xs"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fde68a" }}>
              <MdSync size={15} className="flex-shrink-0 animate-spin" />
              Waking up Render server — this takes up to 30s on the free tier. Data loads once it's ready.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual sync */}
        {configured && (
          <motion.button onClick={manualSync} disabled={syncStatus === "syncing" || syncStatus === "waking"}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all self-start"
            style={{
              background: "rgba(0,190,255,0.12)", border: "1px solid rgba(0,190,255,0.3)",
              color: "#00beff", opacity: (syncStatus === "syncing" || syncStatus === "waking") ? 0.5 : 1,
            }}>
            <MdSync size={16} className={syncStatus === "syncing" ? "animate-spin" : ""} />
            {syncStatus === "syncing" ? "Saving…" : "Save Now"}
          </motion.button>
        )}
      </div>

      {/* ── Configuration ── */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h3 className="font-playfair text-base font-bold text-white border-b pb-3"
          style={{ borderColor: "rgba(0,190,255,0.14)" }}>
          Connection Settings
        </h3>

        {envLocked && (
          <InfoBox>
            Shop ID and API URL are set via environment variables (VITE_SHOP_ID / VITE_API_URL) and cannot be changed here.
            Update them in your Replit secrets to change them.
          </InfoBox>
        )}

        <div className="flex flex-col gap-3">
          {/* API URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={LBL}>
              API URL <span className="text-xs" style={HINT}>(your Render backend URL)</span>
            </label>
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://your-api.onrender.com  (leave empty to use /api)"
              className="input-dark"
              disabled={Boolean(import.meta.env.VITE_API_URL)}
            />
            {!apiUrl && (
              <p className="text-xs" style={HINT}>
                Empty = uses the built-in API server at /api (for Replit dev and all-in-one deployments)
              </p>
            )}
          </div>

          {/* Shop ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={LBL}>
              Shop ID <span className="text-xs" style={HINT}>(unique slug for this client, e.g. "sweet-dreams-dhaka")</span>
            </label>
            <input
              value={shopId}
              onChange={(e) => setShopId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="e.g. sweet-dreams-dhaka"
              className="input-dark font-mono"
              disabled={envLocked}
            />
          </div>

          {/* Sync token */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={LBL}>
              Sync Token <span className="text-xs" style={HINT}>(password that protects backend writes)</span>
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Min 8 characters recommended"
              className="input-dark"
            />
            <p className="text-xs" style={HINT}>
              Set this once on first connect. Anyone with this token can overwrite the backend data.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <motion.button
            onClick={testSync}
            disabled={testing || !shopId.trim() || !token.trim()}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2 text-sm"
            style={{ opacity: testing || !shopId.trim() || !token.trim() ? 0.5 : 1 }}>
            {testing
              ? <><MdSync size={16} className="animate-spin" /> Testing…</>
              : <><MdCloudDone size={16} /> Connect & Test</>}
          </motion.button>
          <button onClick={saveConfig}
            className="btn-outline text-sm flex items-center gap-2">
            {saved ? <><MdCheckCircle size={16} style={{ color: "#22c55e" }} /> Saved!</> : "Save Config"}
          </button>
        </div>

        <AnimatePresence>
          {testResult && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{
                background: testResult.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${testResult.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: testResult.ok ? "#86efac" : "#fca5a5",
              }}>
              {testResult.ok ? <MdCheckCircle size={16} /> : <MdError size={16} />}
              {testResult.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Quick help ── */}
      <InfoBox>
        <strong className="text-white">First time?</strong> See the <code className="bg-white/10 px-1 rounded">README.md</code> in
        the GitHub repo for the full Render setup guide — database, deployment, and how to connect this panel.
        On the free tier the server sleeps after 15 min of no traffic; the first visitor may wait ~30s to wake it.
      </InfoBox>

      {/* ── Current sync token reminder ── */}
      {configured && (
        <div className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)" }}>
          <div className="flex items-center gap-2">
            <MdCloudDone size={16} style={{ color: "#22c55e" }} />
            <p className="text-sm font-semibold text-white">Backend Connected</p>
          </div>
          <p className="text-xs" style={{ color: "#86efac" }}>
            Shop: <strong>{getShopId()}</strong> — Changes auto-save every 1.5 seconds while you're in the admin panel.
          </p>
          <button onClick={() => {
            localStorage.removeItem("sd_shop_id");
            localStorage.removeItem("sd_sync_token");
            localStorage.removeItem("sd_api_url");
            window.location.reload();
          }} className="text-xs text-red-400 hover:text-red-300 transition-colors self-start mt-1">
            Disconnect backend
          </button>
        </div>
      )}

      {!configured && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <MdCloudOff size={18} style={{ color: "#f59e0b" }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#fde68a" }}>Running offline (local only)</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#fcd34d" }}>
              Data is saved only on this device. Enter a Shop ID and connect to the backend to sync across all devices and share with visitors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
