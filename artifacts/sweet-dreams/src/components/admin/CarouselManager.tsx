import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete, MdCheckCircle, MdClose, MdArrowUpward, MdArrowDownward, MdPhoto } from "react-icons/md";
import { useStore, type CarouselSlide } from "../../store/useStore";

const CARD    = { background: "rgba(3,21,37,0.85)", border: "1px solid rgba(0,190,255,0.16)" } as const;
const BORDER_B = { borderColor: "rgba(0,190,255,0.14)" };
const LBL     = { color: "#4dd9ff" } as const;
const HINT    = { color: "#2a6eb5" } as const;

interface FormState {
  imageSource: "upload" | "url";
  imageUrl: string;
  imageBase64: string;
  title: string;
  subtitle: string;
  caption: string;
  isActive: boolean;
}

const DEFAULT_FORM: FormState = {
  imageSource: "url", imageUrl: "", imageBase64: "",
  title: "", subtitle: "", caption: "", isActive: true,
};

export default function CarouselManager() {
  const { state, dispatch } = useStore();
  const { carousel } = state;

  const [form, setForm]           = useState<FormState>({ ...DEFAULT_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef      = useRef<HTMLDivElement>(null);

  const finalImage = form.imageSource === "upload" ? form.imageBase64 : form.imageUrl;

  function handleFile(file: File) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 900;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      setForm((f) => ({ ...f, imageBase64: canvas.toDataURL("image/jpeg", 0.72) }));
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slide: CarouselSlide = {
      id: editingId || `slide_${Date.now()}`,
      title: form.title, subtitle: form.subtitle,
      imageUrl: finalImage, ctaText: form.caption,
    };
    if (editingId) { dispatch({ type: "UPDATE_CAROUSEL_SLIDE", payload: slide }); }
    else           { dispatch({ type: "ADD_CAROUSEL_SLIDE",    payload: slide }); }
    setForm({ ...DEFAULT_FORM }); setEditingId(null);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(slide: CarouselSlide) {
    setEditingId(slide.id);
    setForm({
      imageSource: slide.imageUrl.startsWith("data:") ? "upload" : "url",
      imageUrl:    slide.imageUrl.startsWith("data:") ? "" : slide.imageUrl,
      imageBase64: slide.imageUrl.startsWith("data:") ? slide.imageUrl : "",
      title: slide.title, subtitle: slide.subtitle,
      caption: slide.ctaText || "", isActive: true,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function moveSlide(index: number, dir: -1 | 1) {
    const next = [...carousel];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    dispatch({ type: "SET_CAROUSEL", payload: next });
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      {/* Add / Edit form */}
      <div ref={formRef} className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h2 className="font-playfair text-lg font-bold text-white border-b pb-3" style={BORDER_B}>
          {editingId ? "Edit Slide" : "Add New Slide"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">

              {/* Image source tabs */}
              <div>
                <div className="flex gap-2 mb-3">
                  {(["upload", "url"] as const).map((tab) => (
                    <button key={tab} type="button"
                      onClick={() => setForm((f) => ({ ...f, imageSource: tab }))}
                      className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                      style={form.imageSource === tab
                        ? { background: "#00beff", color: "#010d1e" }
                        : { border: "1px solid rgba(0,190,255,0.25)", color: "#4dd9ff" }}>
                      {tab === "upload" ? "Upload File" : "Image URL"}
                    </button>
                  ))}
                </div>
                {form.imageSource === "upload" ? (
                  <div className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors"
                    style={{ borderColor: "rgba(0,190,255,0.25)" }}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onDragOver={(e) => e.preventDefault()}>
                    {form.imageBase64 ? (
                      <img src={form.imageBase64} className="max-h-28 mx-auto rounded-xl object-contain" />
                    ) : (
                      <>
                        <MdPhoto size={32} className="mx-auto mb-2" style={{ color: "rgba(0,190,255,0.35)" }} />
                        <p className="text-sm" style={LBL}>Drag image here or click to browse</p>
                        <p className="text-xs mt-1" style={HINT}>Compressed automatically</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  </div>
                ) : (
                  <input type="url" value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..." className="input-dark" />
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>Title</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Your Dream Cake..." className="input-dark" />
              </div>

              {/* Subtitle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>Subtitle</label>
                <input type="text" value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Handcrafted with love..." className="input-dark" />
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>
                  CTA Button Text <span className="text-xs" style={HINT}>(optional)</span>
                </label>
                <input type="text" value={form.caption}
                  onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                  placeholder="Order Now" className="input-dark" />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  aria-pressed={form.isActive}
                  style={{
                    width: 44, height: 22, minWidth: 44, maxWidth: "none",
                    flexShrink: 0, overflow: "hidden", position: "relative",
                    display: "inline-block", borderRadius: 9999,
                    background: form.isActive ? "#00beff" : "#031525",
                    border: `1.5px solid ${form.isActive ? "#00beff" : "rgba(0,190,255,0.25)"}`,
                    transition: "background 0.25s, border-color 0.25s",
                  }}>
                  <motion.span className="absolute rounded-full bg-white shadow"
                    style={{ width: 16, height: 16, top: 2, left: 0 }}
                    animate={{ x: form.isActive ? 23 : 3 }}
                    transition={{ type: "spring", stiffness: 600, damping: 38 }} />
                </button>
                <span className="text-sm" style={LBL}>Active (visible on site)</span>
              </div>

              {/* Submit */}
              <div className="flex gap-3 mt-2">
                <motion.button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" whileTap={{ scale: 0.97 }}>
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                        <MdCheckCircle size={18} /> Saved
                      </motion.span>
                    ) : (
                      <motion.span key="label" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        {editingId ? "Update Slide" : "Add Slide"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ ...DEFAULT_FORM }); }}
                    className="btn-outline text-sm px-4">Cancel</button>
                )}
              </div>
            </div>

            {/* Live preview */}
            <div className="lg:w-52 flex flex-col gap-3">
              <p className="text-sm font-medium" style={LBL}>Preview</p>
              <div className="rounded-2xl overflow-hidden aspect-video relative" style={{ background: "#031525", border: "1px solid rgba(0,190,255,0.14)" }}>
                {finalImage ? (
                  <img src={finalImage} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MdPhoto size={36} style={{ color: "rgba(0,190,255,0.2)" }} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                  <p className="font-playfair text-white font-bold text-sm leading-tight">{form.title || "Title"}</p>
                  <p className="text-xs" style={{ color: "#4dd9ff" }}>{form.subtitle || "Subtitle"}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Existing slides */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h2 className="font-playfair text-lg font-bold text-white border-b pb-3" style={BORDER_B}>
          Current Slides ({carousel.length})
        </h2>
        {carousel.length === 0 ? (
          <div className="text-center py-10">
            <MdPhoto size={36} className="mx-auto mb-2" style={{ color: "rgba(0,190,255,0.2)" }} />
            <p className="text-sm" style={HINT}>No carousel slides yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {carousel.map((slide, i) => (
              <div key={slide.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "rgba(0,190,255,0.04)", border: "1px solid rgba(0,190,255,0.1)" }}>
                <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "#031525" }}>
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdPhoto size={16} style={{ color: "rgba(0,190,255,0.3)" }} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{slide.title || "Untitled"}</p>
                  <p className="text-xs truncate" style={HINT}>{slide.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveSlide(i, -1)} disabled={i === 0}
                    className="p-1 transition-colors disabled:opacity-30" style={{ color: "#4dd9ff" }}>
                    <MdArrowUpward size={16} />
                  </button>
                  <button onClick={() => moveSlide(i, 1)} disabled={i === carousel.length - 1}
                    className="p-1 transition-colors disabled:opacity-30" style={{ color: "#4dd9ff" }}>
                    <MdArrowDownward size={16} />
                  </button>
                  <button onClick={() => handleEdit(slide)} className="p-1 transition-colors" style={{ color: "#4dd9ff" }}>
                    <MdEdit size={16} />
                  </button>
                  <button onClick={() => setDeleteTarget(slide.id)} className="p-1 text-red-400 hover:text-red-300 transition-colors">
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="rounded-2xl p-6 max-w-sm w-full" style={CARD}
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-playfair text-lg font-bold text-white">Delete this slide?</h3>
                <button onClick={() => setDeleteTarget(null)} style={{ color: "#2a6eb5" }}><MdClose size={20} /></button>
              </div>
              <p className="text-sm mb-6" style={HINT}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1 text-sm py-2">Cancel</button>
                <button onClick={() => { dispatch({ type: "DELETE_CAROUSEL_SLIDE", payload: deleteTarget }); setDeleteTarget(null); }}
                  className="flex-1 py-2 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
