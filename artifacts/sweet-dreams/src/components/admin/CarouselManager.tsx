import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete, MdCheckCircle, MdClose, MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { useStore, type CarouselSlide } from "../../store/useStore";

interface FormState {
  imageSource: "upload" | "url";
  imageUrl: string;
  imageBase64: string;
  title: string;
  subtitle: string;
  caption: string;
  youtubeUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const DEFAULT_FORM: FormState = {
  imageSource: "url",
  imageUrl: "",
  imageBase64: "",
  title: "",
  subtitle: "",
  caption: "",
  youtubeUrl: "",
  isActive: true,
  sortOrder: 0,
};

export default function CarouselManager() {
  const { state, dispatch } = useStore();
  const { carousel } = state;

  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

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
    img.onerror = () => { URL.revokeObjectURL(url); };
    img.src = url;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slide: CarouselSlide = {
      id: editingId || `slide_${Date.now()}`,
      title: form.title,
      subtitle: form.subtitle,
      imageUrl: finalImage,
      ctaText: form.caption,
    };
    if (editingId) {
      dispatch({ type: "UPDATE_CAROUSEL_SLIDE", payload: slide });
    } else {
      dispatch({ type: "ADD_CAROUSEL_SLIDE", payload: slide });
    }
    setForm({ ...DEFAULT_FORM });
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(slide: CarouselSlide) {
    setEditingId(slide.id);
    setForm({
      imageSource: slide.imageUrl.startsWith("data:") ? "upload" : "url",
      imageUrl: slide.imageUrl.startsWith("data:") ? "" : slide.imageUrl,
      imageBase64: slide.imageUrl.startsWith("data:") ? slide.imageUrl : "",
      title: slide.title,
      subtitle: slide.subtitle,
      caption: slide.ctaText || "",
      youtubeUrl: "",
      isActive: true,
      sortOrder: 0,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function moveSlide(index: number, dir: -1 | 1) {
    const newOrder = [...carousel];
    const target = index + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    dispatch({ type: "SET_CAROUSEL", payload: newOrder });
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Add / Edit form */}
      <div ref={formRef} className="card-dark p-6 rounded-3xl">
        <h2 className="font-playfair text-xl font-bold text-white mb-5">
          {editingId ? "Edit Slide" : "Add New Slide"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              {/* Image source tabs */}
              <div>
                <div className="flex gap-2 mb-3">
                  {(["upload", "url"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, imageSource: tab }))}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.imageSource === tab
                          ? "bg-caramel-400 text-white"
                          : "border border-caramel-700/50 text-caramel-300"
                      }`}
                    >
                      {tab === "upload" ? "Upload File" : "Image URL"}
                    </button>
                  ))}
                </div>
                {form.imageSource === "upload" ? (
                  <div
                    className="border-2 border-dashed border-caramel-700/50 rounded-2xl p-6 text-center cursor-pointer hover:border-caramel-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {form.imageBase64 ? (
                      <img src={form.imageBase64} className="max-h-28 mx-auto rounded-xl object-contain" />
                    ) : (
                      <>
                        <p className="text-3xl mb-2">🖼️</p>
                        <p className="text-caramel-400 text-sm">Drag image here or click to browse</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  </div>
                ) : (
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className="input-dark"
                  />
                )}
              </div>

              {/* Title */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">Title</label>
                <input type="text" value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Your Dream Cake..." className="input-dark" />
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">Subtitle</label>
                <input type="text" value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Handcrafted with love..." className="input-dark" />
              </div>

              {/* Caption / CTA */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">CTA Button Text (optional)</label>
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
                  <motion.span
                    className="absolute rounded-full bg-white shadow"
                    style={{ width: 16, height: 16, top: 2, left: 0 }}
                    animate={{ x: form.isActive ? 23 : 3 }}
                    transition={{ type: "spring", stiffness: 600, damping: 38 }}
                  />
                </button>
                <span className="text-sm text-caramel-300">Active (visible on site)</span>
              </div>

              {/* Submit */}
              <div className="flex gap-3 mt-2">
                <motion.button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" whileTap={{ scale: 0.97 }}>
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                        <MdCheckCircle size={18} /> Saved!
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
            <div className="lg:w-56 flex flex-col gap-3">
              <p className="text-sm text-caramel-300 font-medium">Preview</p>
              <div className="rounded-2xl overflow-hidden bg-choco-800 border border-caramel-800/30 aspect-video relative">
                {finalImage ? (
                  <img src={finalImage} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-choco-700">🎂</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                  <p className="font-playfair text-white font-bold text-sm leading-tight">{form.title || "Title"}</p>
                  <p className="text-caramel-300 text-xs">{form.subtitle || "Subtitle"}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Existing slides */}
      <div className="card-dark p-6 rounded-3xl">
        <h2 className="font-playfair text-xl font-bold text-white mb-4">
          Current Slides ({carousel.length})
        </h2>
        {carousel.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-2">🎠</p>
            <p className="text-choco-300 text-sm">No carousel slides yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {carousel.map((slide, i) => (
              <div key={slide.id} className="flex items-center gap-3 p-3 rounded-2xl bg-choco-800/60 border border-caramel-800/20">
                <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-choco-700">
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🎂</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{slide.title || "Untitled"}</p>
                  <p className="text-xs text-choco-300 truncate">{slide.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => moveSlide(i, -1)} disabled={i === 0}
                    className="text-caramel-400 hover:text-white disabled:opacity-30 p-1 transition-colors">
                    <MdArrowUpward size={16} />
                  </button>
                  <button onClick={() => moveSlide(i, 1)} disabled={i === carousel.length - 1}
                    className="text-caramel-400 hover:text-white disabled:opacity-30 p-1 transition-colors">
                    <MdArrowDownward size={16} />
                  </button>
                  <button onClick={() => handleEdit(slide)} className="text-caramel-400 hover:text-caramel-300 p-1 transition-colors">
                    <MdEdit size={16} />
                  </button>
                  <button onClick={() => setDeleteTarget(slide.id)} className="text-red-400 hover:text-red-300 p-1 transition-colors">
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
            style={{ background: "rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="card-dark p-6 rounded-3xl max-w-sm w-full"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-playfair text-lg font-bold text-white">Delete this slide?</h3>
                <button onClick={() => setDeleteTarget(null)} className="text-choco-300 hover:text-white"><MdClose size={20} /></button>
              </div>
              <p className="text-sm text-choco-300 mb-6">This action cannot be undone.</p>
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
