import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdCloudUpload, MdFileDownload, MdFileUpload,
  MdCheckCircle, MdError, MdInfoOutline,
} from "react-icons/md";
import { FaServer } from "react-icons/fa";
import { useStore } from "../../store/useStore";

type Status = { kind: "idle" } | { kind: "success"; msg: string } | { kind: "error"; msg: string };

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: "rgba(0,190,255,0.15)", border: "1.5px solid rgba(0,190,255,0.4)", color: "#00beff" }}>
        {n}
      </div>
      <div className="flex-1 pb-6 border-b border-white/5">
        <p className="text-white font-semibold text-sm mb-1">{title}</p>
        <div className="text-sm text-blue-200/70 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function PublishPanel() {
  const { state, dispatch } = useStore();
  const importRef = useRef<HTMLInputElement>(null);
  const [exportStatus, setExportStatus] = useState<Status>({ kind: "idle" });
  const [importStatus, setImportStatus] = useState<Status>({ kind: "idle" });

  /* ── Export / Publish ── */
  function handleExport() {
    try {
      const { isAuthenticated: _, ...data } = state;
      const payload = { ...data, publishedAt: Date.now() };
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sweet-dreams-data.json";
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus({ kind: "success", msg: "File downloaded! Now upload it to your hosting root folder." });
      setTimeout(() => setExportStatus({ kind: "idle" }), 6000);
    } catch {
      setExportStatus({ kind: "error", msg: "Export failed. Please try again." });
    }
  }

  /* ── Import ── */
  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.settings || !Array.isArray(data.gallery)) {
          setImportStatus({ kind: "error", msg: "Invalid file format. Make sure you're importing a Sweet Dreams export file." });
          return;
        }
        dispatch({
          type: "LOAD_STATE",
          payload: { ...data, isAuthenticated: true },
        });
        setImportStatus({ kind: "success", msg: "Data imported successfully! All your content is now loaded on this device." });
        setTimeout(() => setImportStatus({ kind: "idle" }), 6000);
      } catch {
        setImportStatus({ kind: "error", msg: "Failed to read file. Make sure it's a valid JSON export." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const itemCount = state.gallery.length + state.products.length;
  const cardBase = "rounded-2xl p-5 border";
  const cardStyle = { background: "rgba(0,190,255,0.04)", borderColor: "rgba(0,190,255,0.14)" };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">

      {/* ── Header ── */}
      <div>
        <h2 className="font-playfair text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <MdCloudUpload size={26} style={{ color: "#00beff" }} />
          Publish Your Website
        </h2>
        <p className="text-sm text-blue-200/60 leading-relaxed">
          Export your content as one file and upload it to your hosting. Every visitor — on any
          device, anywhere in the world — will immediately see your latest updates.
        </p>
      </div>

      {/* ── Content snapshot ── */}
      <div className={`${cardBase} flex items-center justify-between gap-4`} style={cardStyle}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-300/50 mb-1">Current Content</p>
          <p className="text-white font-semibold">
            {itemCount} items &nbsp;·&nbsp; {state.categories.length} categories &nbsp;·&nbsp; {state.gallery.length} gallery photos
          </p>
          <p className="text-xs text-blue-200/50 mt-0.5">
            Shop: <span className="text-blue-200/80">{state.settings.shopName}</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(0,190,255,0.12)", border: "1.5px solid rgba(0,190,255,0.3)" }}>
          <span className="text-lg font-bold" style={{ color: "#00beff" }}>{itemCount}</span>
        </div>
      </div>

      {/* ── Export card ── */}
      <div className={`${cardBase} flex flex-col gap-4`} style={cardStyle}>
        <div className="flex items-start gap-3">
          <MdFileDownload size={22} style={{ color: "#00beff" }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold">Step 1 — Download Your Content File</p>
            <p className="text-sm text-blue-200/60 mt-0.5">
              This downloads <code className="bg-white/10 px-1 rounded text-xs">sweet-dreams-data.json</code> — a snapshot
              of everything: gallery, products, settings, and categories.
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleExport}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #00beff, #0088bb)",
            boxShadow: "0 8px 24px rgba(0,190,255,0.25)",
            color: "white",
          }}>
          <MdFileDownload size={20} />
          Download sweet-dreams-data.json
        </motion.button>

        <AnimatePresence>
          {exportStatus.kind !== "idle" && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{
                background: exportStatus.kind === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${exportStatus.kind === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: exportStatus.kind === "success" ? "#86efac" : "#fca5a5",
              }}>
              {exportStatus.kind === "success" ? <MdCheckCircle size={16} /> : <MdError size={16} />}
              {exportStatus.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Step-by-step guide ── */}
      <div className={`${cardBase} flex flex-col gap-0`} style={cardStyle}>
        <div className="flex items-center gap-2 mb-5">
          <FaServer size={18} style={{ color: "#00beff" }} />
          <p className="text-white font-semibold">Step 2 — Upload to Your Hosting</p>
        </div>

        <div className="flex flex-col gap-0 pl-1">
          <Step n={1} title="Log in to your hosting control panel">
            For Hostinger: go to <span className="text-blue-300">hpanel.hostinger.com</span> → select your website → open <strong>File Manager</strong>.
            For Render/Vercel: just put the file in your <code className="bg-white/10 px-1 rounded text-xs">public/</code> folder and redeploy.
          </Step>
          <Step n={2} title="Navigate to the public root folder">
            In File Manager, open the <code className="bg-white/10 px-1 rounded text-xs">public_html</code> folder
            (this is your website's root — the same folder where your <code className="bg-white/10 px-1 rounded text-xs">index.html</code> lives).
          </Step>
          <Step n={3} title="Upload the file">
            Click <strong>Upload</strong> and select the <code className="bg-white/10 px-1 rounded text-xs">sweet-dreams-data.json</code> file you just downloaded.
            If the file already exists, choose <strong>overwrite</strong>.
          </Step>
          <Step n={4} title="Done — all visitors see your updates instantly">
            No restart, no rebuild needed. Every new visitor loads your published content automatically.
            Existing visitors will see it on their next page refresh.
          </Step>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl mt-2"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <MdInfoOutline size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#fbbf24" }} />
          <p className="text-xs leading-relaxed" style={{ color: "#fde68a" }}>
            <strong>Important:</strong> Images you uploaded using external URLs (e.g. from Google Photos or Imgur) will work fine.
            Images you pasted as base64 or data URLs are embedded in the JSON file and will also work, but the file size may be larger.
          </p>
        </div>
      </div>

      {/* ── Import card ── */}
      <div className={`${cardBase} flex flex-col gap-4`} style={cardStyle}>
        <div className="flex items-start gap-3">
          <MdFileUpload size={22} style={{ color: "#a78bfa" }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold">Import — Load Data on a New Device</p>
            <p className="text-sm text-blue-200/60 mt-0.5">
              Switching from mobile to laptop? Import a previously exported file to bring all your content to this device.
              Your local data will be replaced with the imported content.
            </p>
          </div>
        </div>

        <input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImportFile} />

        <motion.button
          onClick={() => importRef.current?.click()}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm border transition-all"
          style={{
            background: "rgba(167,139,250,0.1)",
            borderColor: "rgba(167,139,250,0.35)",
            color: "#c4b5fd",
          }}>
          <MdFileUpload size={20} />
          Import sweet-dreams-data.json
        </motion.button>

        <AnimatePresence>
          {importStatus.kind !== "idle" && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{
                background: importStatus.kind === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${importStatus.kind === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: importStatus.kind === "success" ? "#86efac" : "#fca5a5",
              }}>
              {importStatus.kind === "success" ? <MdCheckCircle size={16} /> : <MdError size={16} />}
              {importStatus.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Workflow summary ── */}
      <div className={`${cardBase} p-4`} style={cardStyle}>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-300/40 mb-3">Your Publishing Workflow</p>
        <div className="flex flex-col gap-1.5 text-sm text-blue-200/70">
          {[
            "1. Make changes in the admin panel (on any device)",
            "2. Click \"Download\" above → get sweet-dreams-data.json",
            "3. Upload the file to your hosting root folder",
            "4. All visitors worldwide see the updated content immediately",
            "5. To continue editing on another device → use Import first",
          ].map((line) => (
            <div key={line} className="flex items-start gap-2">
              <span style={{ color: "#00beff" }}>›</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
