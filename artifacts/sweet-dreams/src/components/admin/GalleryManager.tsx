import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete, MdCheckCircle, MdClose, MdPhoto, MdStar } from "react-icons/md";
import { useStore, type CakeItem } from "../../store/useStore";

const CATEGORIES = ["Chocolate","Vanilla","Custom","Wedding","Birthday","Others"];

const CARD = { background: "rgba(3,21,37,0.85)", border: "1px solid rgba(0,190,255,0.16)" } as const;
const BORDER_B = { borderColor: "rgba(0,190,255,0.14)" };
const LBL = { color: "#4dd9ff" } as const;
const HINT = { color: "#2a6eb5" } as const;

interface FormState {
  imageSource: "upload" | "url";
  imageUrl: string;
  imageBase64: string;
  caption: string;
  category: string;
  featured: boolean;
  youtubeUrl: string;
  review: string;
}

const DEFAULT_FORM: FormState = {
  imageSource: "upload", imageUrl: "", imageBase64: "",
  caption: "", category: "Chocolate",
  featured: false, youtubeUrl: "", review: "",
};

interface GalleryManagerProps { filterDelivered?: boolean; }

export default function GalleryManager({ filterDelivered = false }: GalleryManagerProps) {
  const { state, dispatch } = useStore();
  const { gallery } = state;

  const [form, setForm]             = useState<FormState>({ ...DEFAULT_FORM });
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [saved, setSaved]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch]         = useState("");
  const [urlTestImg, setUrlTestImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef      = useRef<HTMLDivElement>(null);

  const displayedItems = gallery
    .filter((item) => item.type === "delivered")
    .filter((item) =>
      !search || item.caption.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );

  const finalImage = form.imageSource === "upload" ? form.imageBase64 : form.imageUrl;

  function handleFile(file: File) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 800;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      setForm((f) => ({ ...f, imageBase64: canvas.toDataURL("image/jpeg", 0.75) }));
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const item: CakeItem = {
      id:       editingId || `cake_${Date.now()}`,
      imageUrl: finalImage,
      caption:  form.caption,
      category: form.category,
      type:     "delivered",
      featured: form.featured,
      review:   form.review.trim() || undefined,
      ...(form.youtubeUrl ? { youtubeUrl: form.youtubeUrl } : {}),
    } as CakeItem;
    if (editingId) { dispatch({ type: "UPDATE_GALLERY_ITEM", payload: item }); }
    else           { dispatch({ type: "ADD_GALLERY_ITEM",    payload: item }); }
    setForm({ ...DEFAULT_FORM }); setEditingId(null);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(item: CakeItem) {
    setEditingId(item.id);
    setForm({
      imageSource: item.imageUrl.startsWith("data:") ? "upload" : "url",
      imageUrl:    item.imageUrl.startsWith("data:") ? "" : item.imageUrl,
      imageBase64: item.imageUrl.startsWith("data:") ? item.imageUrl : "",
      caption: item.caption, category: item.category,
      featured: item.featured || false,
      youtubeUrl: item.youtubeUrl || "", review: item.review || "",
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleDelete(id: string) {
    dispatch({ type: "DELETE_GALLERY_ITEM", payload: id });
    setDeleteTarget(null);
  }

  function toggleFeatured(item: CakeItem) {
    dispatch({
      type: "UPDATE_GALLERY_ITEM",
      payload: { ...item, featured: !item.featured },
    });
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      {/* Info banner */}
      <div className="rounded-2xl p-4 text-sm flex flex-col gap-1.5"
        style={{ background: "rgba(0,190,255,0.06)", border: "1px solid rgba(0,190,255,0.18)", color: "#4dd9ff" }}>
        <p>
          Everything added here appears in <strong className="text-white">two places automatically</strong>:
        </p>
        <ul className="list-disc list-inside text-xs space-y-0.5" style={{ color: "#7dd3fc" }}>
          <li>The public <strong className="text-white">Gallery</strong> page — visible to all visitors</li>
          <li>The <strong className="text-white">"Delivered With Love"</strong> homepage section (first 6 shown)</li>
        </ul>
        <p className="text-xs mt-0.5" style={{ color: "#7dd3fc" }}>
          Tap the <strong className="text-white">⭐ star</strong> on any order to also feature it in the <strong className="text-white">Featured Carousel</strong> on the homepage.
        </p>
      </div>

      {/* ADD / EDIT FORM */}
      <div ref={formRef} className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h2 className="font-playfair text-lg font-bold text-white border-b pb-3" style={BORDER_B}>
          {editingId ? "Edit Order" : "Add Delivered Order"}
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
                      {tab === "upload" ? "Upload Photo" : "Image URL"}
                    </button>
                  ))}
                </div>
                {form.imageSource === "upload" ? (
                  <div className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors"
                    style={{ borderColor: "rgba(0,190,255,0.25)" }}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}>
                    {form.imageBase64 ? (
                      <img src={form.imageBase64} className="max-h-32 mx-auto rounded-xl object-contain" />
                    ) : (
                      <>
                        <MdPhoto size={32} className="mx-auto mb-2" style={{ color: "rgba(0,190,255,0.35)" }} />
                        <p className="text-sm" style={LBL}>Drag photo here or click to browse</p>
                        <p className="text-xs mt-1" style={HINT}>Compressed automatically for fast loading</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="url" value={form.imageUrl}
                      onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="https://..." className="input-dark flex-1" />
                    <button type="button" onClick={() => setUrlTestImg(form.imageUrl)}
                      className="btn-outline text-sm px-3 py-2 whitespace-nowrap">Test</button>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>Caption</label>
                <div className="relative">
                  <textarea value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value.slice(0, 200) }))}
                    rows={3} className="input-dark resize-none" placeholder="Describe this cake..." />
                  <span className="absolute bottom-2 right-3 text-xs" style={HINT}>{form.caption.length}/200</span>
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>Category</label>
                <select value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="input-dark">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Customer Review */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>
                  Customer Review <span className="text-xs" style={HINT}>(optional)</span>
                </label>
                <div className="relative">
                  <textarea value={form.review}
                    onChange={(e) => setForm((f) => ({ ...f, review: e.target.value.slice(0, 180) }))}
                    rows={2} className="input-dark resize-none" placeholder="What did the customer say?" />
                  <span className="absolute bottom-2 right-3 text-xs" style={HINT}>{form.review.length}/180</span>
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: form.featured ? "rgba(245,158,11,0.08)" : "rgba(0,0,0,0.2)", border: `1px solid ${form.featured ? "rgba(245,158,11,0.3)" : "rgba(0,190,255,0.1)"}` }}>
                <button type="button" onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                  aria-pressed={form.featured}
                  style={{
                    width: 44, height: 22, minWidth: 44, maxWidth: "none",
                    flexShrink: 0, overflow: "hidden", position: "relative",
                    display: "inline-block", borderRadius: 9999,
                    background: form.featured ? "#f59e0b" : "#031525",
                    border: `1.5px solid ${form.featured ? "#f59e0b" : "rgba(0,190,255,0.25)"}`,
                    transition: "background 0.25s, border-color 0.25s",
                  }}>
                  <motion.span className="absolute rounded-full bg-white shadow"
                    style={{ width: 16, height: 16, top: 2, left: 0 }}
                    animate={{ x: form.featured ? 23 : 3 }}
                    transition={{ type: "spring", stiffness: 600, damping: 38 }} />
                </button>
                <div>
                  <p className="text-sm font-medium" style={{ color: form.featured ? "#fcd34d" : "#4dd9ff" }}>
                    ⭐ Add to Featured Carousel
                  </p>
                  <p className="text-xs" style={HINT}>Shows in the Featured Creations section on the homepage</p>
                </div>
              </div>

              {/* YouTube link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>YouTube Link <span className="text-xs" style={HINT}>(optional)</span></label>
                <input type="url" value={form.youtubeUrl}
                  onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..." className="input-dark" />
                <p className="text-xs" style={HINT}>Adds a "Watch Video" button in gallery lightbox</p>
              </div>

              {/* Submit */}
              <div className="flex gap-3 mt-2">
                <motion.button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" whileTap={{ scale: 0.97 }}>
                  <AnimatePresence mode="wait">
                    {saved ? (
                      <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                        <MdCheckCircle size={18} /> Saved to Gallery & DB
                      </motion.span>
                    ) : (
                      <motion.span key="label" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        {editingId ? "Update Order" : "Add to Gallery"}
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
              <p className="text-sm font-medium" style={LBL}>Live Preview</p>
              <div className="rounded-2xl overflow-hidden" style={{ background: "#051e36", border: "1px solid rgba(0,190,255,0.14)" }}>
                <div className="aspect-square relative" style={{ background: "#031525" }}>
                  {(finalImage || urlTestImg) ? (
                    <img src={finalImage || urlTestImg || ""} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdPhoto size={40} style={{ color: "rgba(0,190,255,0.2)" }} />
                    </div>
                  )}
                  {form.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs text-white"
                      style={{ background: "#00beff", color: "#010d1e", fontWeight: 600 }}>
                      {form.category}
                    </span>
                  )}
                  {form.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: "rgba(245,158,11,0.25)", color: "#fcd34d", border: "1px solid rgba(245,158,11,0.5)" }}>
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-white line-clamp-2">{form.caption || "Your caption will appear here..."}</p>
                  {form.review && <p className="text-xs italic mt-1 line-clamp-1" style={{ color: "#4dd9ff" }}>"{form.review}"</p>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* EXISTING ITEMS */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b pb-4" style={BORDER_B}>
          <h2 className="font-playfair text-lg font-bold text-white flex-1">
            Delivered Orders <span className="text-sm font-normal" style={HINT}>({displayedItems.length})</span>
          </h2>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..." className="input-dark py-1.5 text-sm w-36" />
        </div>

        {displayedItems.length === 0 ? (
          <div className="text-center py-10">
            <MdPhoto size={36} className="mx-auto mb-2" style={{ color: "rgba(0,190,255,0.2)" }} />
            <p className="text-sm" style={HINT}>No delivered orders yet. Add your first one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedItems.map((item) => (
              <div key={item.id} className="rounded-2xl overflow-hidden relative" style={{ background: "#031525", border: "1px solid rgba(0,190,255,0.1)" }}>
                <div className="aspect-square relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdPhoto size={28} style={{ color: "rgba(0,190,255,0.2)" }} />
                    </div>
                  )}
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none"
                    style={{ background: "#00beff", color: "#010d1e" }}>{item.category}</span>

                  {/* Inline featured star — prominent overlay button */}
                  <button
                    onClick={() => toggleFeatured(item)}
                    title={item.featured ? "Remove from Featured Carousel" : "Add to Featured Carousel"}
                    className="absolute top-1.5 left-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
                    style={{
                      background: item.featured ? "rgba(245,158,11,0.9)" : "rgba(0,0,0,0.55)",
                      border: item.featured ? "1px solid #fcd34d" : "1px solid rgba(255,255,255,0.2)",
                      backdropFilter: "blur(4px)",
                    }}>
                    <MdStar size={15} style={{ color: item.featured ? "#fff" : "rgba(255,255,255,0.5)" }} />
                  </button>

                  {item.youtubeUrl && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-red-600/90 text-white leading-none">Video</span>
                  )}
                  {item.review && (
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[10px] leading-none"
                      style={{ background: "rgba(0,190,255,0.15)", color: "#4dd9ff", border: "1px solid rgba(0,190,255,0.3)" }}>
                      Review
                    </span>
                  )}
                </div>
                <div className="p-2 flex items-center justify-between gap-1" style={{ background: "#051e36" }}>
                  <p className="text-xs text-white truncate flex-1">{item.caption}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(item)} className="p-1 transition-colors" style={{ color: "#4dd9ff" }}><MdEdit size={16} /></button>
                    <button onClick={() => setDeleteTarget(item.id)} className="p-1 text-red-400 hover:text-red-300 transition-colors"><MdDelete size={16} /></button>
                  </div>
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
                <h3 className="font-playfair text-lg font-bold text-white">Delete this order?</h3>
                <button onClick={() => setDeleteTarget(null)} style={{ color: "#2a6eb5" }}><MdClose size={20} /></button>
              </div>
              <p className="text-sm mb-2" style={HINT}>This will remove it from the gallery and the delivered section.</p>
              <p className="text-sm mb-6" style={{ color: "#ef4444", opacity: 0.8 }}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1 text-sm py-2">Cancel</button>
                <button onClick={() => handleDelete(deleteTarget)}
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
