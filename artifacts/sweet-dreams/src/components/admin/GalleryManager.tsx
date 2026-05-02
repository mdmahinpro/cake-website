import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete, MdCheckCircle, MdClose } from "react-icons/md";
import { useStore, type CakeItem } from "../../store/useStore";

const CATEGORIES = [
  "Chocolate",
  "Vanilla",
  "Custom",
  "Wedding",
  "Birthday",
  "Others",
];

interface FormState {
  imageSource: "upload" | "url";
  imageUrl: string;
  imageBase64: string;
  caption: string;
  category: string;
  type: "gallery" | "delivered";
  featured: boolean;
  youtubeUrl: string;
  review: string;
}

const DEFAULT_FORM: FormState = {
  imageSource: "upload",
  imageUrl: "",
  imageBase64: "",
  caption: "",
  category: "Chocolate",
  type: "gallery",
  featured: false,
  youtubeUrl: "",
  review: "",
};

interface GalleryManagerProps {
  filterDelivered?: boolean;
}

export default function GalleryManager({ filterDelivered = false }: GalleryManagerProps) {
  const { state, dispatch } = useStore();
  const { gallery } = state;

  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "gallery" | "delivered">("all");
  const [search, setSearch] = useState("");
  const [urlTestImg, setUrlTestImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const displayedItems = gallery.filter((item) => {
    if (filterDelivered) return item.type === "delivered";
    if (activeTab === "gallery")   return item.type !== "delivered";
    if (activeTab === "delivered") return item.type === "delivered";
    return true;
  }).filter((item) =>
    !search || item.caption.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const finalImage = form.imageSource === "upload" ? form.imageBase64 : form.imageUrl;

  function handleFile(file: File) {
    if (file.size > 1.5 * 1024 * 1024) alert("Image is larger than 1.5MB. It will still work but may slow the page.");
    const reader = new FileReader();
    reader.onload = (e) => setForm((f) => ({ ...f, imageBase64: e.target?.result as string }));
    reader.readAsDataURL(file);
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
      type:     form.type === "delivered" ? "delivered" : undefined,
      featured: form.featured,
      review:   form.type === "delivered" && form.review.trim() ? form.review.trim() : undefined,
      ...(form.youtubeUrl ? { youtubeUrl: form.youtubeUrl } : {}),
    } as CakeItem;

    if (editingId) {
      dispatch({ type: "UPDATE_GALLERY_ITEM", payload: item });
    } else {
      dispatch({ type: "ADD_GALLERY_ITEM", payload: item });
    }
    setForm({ ...DEFAULT_FORM });
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(item: CakeItem) {
    const ext = item as CakeItem & { youtubeUrl?: string };
    setEditingId(item.id);
    setForm({
      imageSource: item.imageUrl.startsWith("data:") ? "upload" : "url",
      imageUrl:    item.imageUrl.startsWith("data:") ? "" : item.imageUrl,
      imageBase64: item.imageUrl.startsWith("data:") ? item.imageUrl : "",
      caption:  item.caption,
      category: item.category,
      type:     item.type === "delivered" ? "delivered" : "gallery",
      featured: item.featured || false,
      youtubeUrl: ext.youtubeUrl || "",
      review:   item.review || "",
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleDelete(id: string) {
    dispatch({ type: "DELETE_GALLERY_ITEM", payload: id });
    setDeleteTarget(null);
  }

  const title = filterDelivered ? "Add Delivered Order" : editingId ? "Edit Cake" : "Add New Cake";

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {filterDelivered && (
        <div className="bg-caramel-400/10 border border-caramel-400/30 rounded-2xl p-4 text-sm text-caramel-300">
          📦 These appear in the <strong>"Delivered With Love"</strong> section on the homepage (max 6 shown).
          Add a customer review to make each delivery card more personal!
        </div>
      )}

      {/* ADD / EDIT FORM */}
      <div ref={formRef} className="card-dark p-6 rounded-3xl">
        <h2 className="font-playfair text-xl font-bold text-white mb-5">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              {/* Image source */}
              <div>
                <div className="flex gap-2 mb-3">
                  {(["upload", "url"] as const).map((tab) => (
                    <button key={tab} type="button"
                      onClick={() => setForm((f) => ({ ...f, imageSource: tab }))}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${form.imageSource === tab ? "bg-caramel-400 text-white" : "border border-caramel-700/50 text-caramel-300"}`}>
                      {tab === "upload" ? "Upload File" : "Image URL"}
                    </button>
                  ))}
                </div>
                {form.imageSource === "upload" ? (
                  <div className="border-2 border-dashed border-caramel-700/50 rounded-2xl p-6 text-center cursor-pointer hover:border-caramel-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    {form.imageBase64 ? (
                      <img src={form.imageBase64} className="max-h-32 mx-auto rounded-xl object-contain" />
                    ) : (
                      <><p className="text-3xl mb-2">📸</p>
                        <p className="text-caramel-400 text-sm">Drag image here or click to browse</p>
                        <p className="text-choco-300 text-xs mt-1">Max recommended size: 1.5MB</p></>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); }} />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="url" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="https://..." className="input-dark flex-1" />
                    <button type="button" onClick={() => setUrlTestImg(form.imageUrl)} className="btn-outline text-sm px-3 py-2 whitespace-nowrap">Test</button>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">Caption</label>
                <div className="relative">
                  <textarea value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value.slice(0, 200) }))}
                    rows={3} className="input-dark resize-none" placeholder="Describe this cake..." />
                  <span className="absolute bottom-2 right-3 text-xs text-choco-300">{form.caption.length}/200</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-dark">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Type */}
              {!filterDelivered && (
                <div>
                  <label className="text-sm text-caramel-300 mb-2 block">Type</label>
                  <div className="flex gap-2">
                    {(["gallery", "delivered"] as const).map((t) => (
                      <button key={t} type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${form.type === t ? "bg-caramel-400 text-white" : "border border-caramel-700/50 text-caramel-300"}`}>
                        {t === "gallery" ? "Gallery Work" : "Delivered Order"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Review — only for delivered type */}
              {(form.type === "delivered" || filterDelivered) && (
                <div>
                  <label className="text-sm text-caramel-300 mb-1 block">Customer Review <span className="text-xs text-choco-300">(optional — shown on homepage)</span></label>
                  <div className="relative">
                    <textarea value={form.review}
                      onChange={(e) => setForm((f) => ({ ...f, review: e.target.value.slice(0, 180) }))}
                      rows={2} className="input-dark resize-none" placeholder="What did the customer say? e.g. Absolutely loved it!" />
                    <span className="absolute bottom-2 right-3 text-xs text-choco-300">{form.review.length}/180</span>
                  </div>
                </div>
              )}

              {/* Featured toggle */}
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${form.featured ? "bg-caramel-400" : "bg-choco-700"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${form.featured ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-caramel-300">Mark as Featured (shows in Featured Creations)</span>
              </div>

              {/* YouTube link */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">YouTube Link (optional)</label>
                <input type="url" value={form.youtubeUrl}
                  onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..." className="input-dark" />
                <p className="text-xs text-choco-300 mt-1">Adds a "Watch Video" button in gallery lightbox</p>
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
                        {editingId ? "Update Item" : "Add to Gallery"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ ...DEFAULT_FORM }); }} className="btn-outline text-sm px-4">Cancel</button>
                )}
              </div>
            </div>

            {/* Live preview */}
            <div className="lg:w-56 flex flex-col gap-3">
              <p className="text-sm text-caramel-300 font-medium">Live Preview</p>
              <div className="rounded-2xl overflow-hidden bg-choco-800 border border-caramel-800/30">
                <div className="aspect-square bg-choco-700 relative">
                  {(finalImage || urlTestImg) ? (
                    <img src={finalImage || urlTestImg || ""} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-choco-500">🎂</div>
                  )}
                  {form.category && <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs bg-caramel-400/90 text-white">{form.category}</span>}
                  {form.featured && <span className="absolute top-2 right-2 text-sm">⭐</span>}
                </div>
                <div className="p-3">
                  <p className="text-xs text-white line-clamp-2">{form.caption || "Your caption will appear here..."}</p>
                  {form.review && <p className="text-xs text-caramel-400 italic mt-1 line-clamp-1">"{form.review}"</p>}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* EXISTING ITEMS */}
      <div className="card-dark p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <h2 className="font-playfair text-xl font-bold text-white flex-1">
            {filterDelivered ? "Delivered Orders" : "Gallery Items"}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {!filterDelivered && (
              <>
                {(["all", "gallery", "delivered"] as const).map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${activeTab === t ? "bg-caramel-400 text-white" : "border border-caramel-700/50 text-caramel-300"}`}>
                    {t}
                  </button>
                ))}
              </>
            )}
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..." className="input-dark py-1.5 text-sm w-32" />
          </div>
        </div>
        <p className="text-xs text-choco-300 mb-4">Showing {displayedItems.length} item{displayedItems.length !== 1 ? "s" : ""}</p>

        {displayedItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-2">🎂</p>
            <p className="text-choco-300 text-sm">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedItems.map((item) => (
              <div key={item.id} className="rounded-2xl overflow-hidden relative bg-choco-700">
                <div className="aspect-square relative">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎂</div>
                  )}
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-caramel-400/90 text-white leading-none">{item.category}</span>
                  {item.featured && <span className="absolute top-1.5 left-1.5 text-xs">⭐</span>}
                  {(item as CakeItem & { youtubeUrl?: string }).youtubeUrl && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-red-600/90 text-white leading-none">Video</span>
                  )}
                  {item.review && <span className="absolute bottom-1.5 right-1.5 text-xs">💬</span>}
                </div>
                <div className="bg-choco-800 p-2 flex items-center justify-between gap-1">
                  <p className="text-xs text-white truncate flex-1">{item.caption}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(item)} className="text-caramel-400 hover:text-caramel-300 p-1 transition-colors"><MdEdit size={16} /></button>
                    <button onClick={() => setDeleteTarget(item.id)} className="text-red-400 hover:text-red-300 p-1 transition-colors"><MdDelete size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="card-dark p-6 rounded-3xl max-w-sm w-full"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-playfair text-lg font-bold text-white">Delete this cake?</h3>
                <button onClick={() => setDeleteTarget(null)} className="text-choco-300 hover:text-white"><MdClose size={20} /></button>
              </div>
              <p className="text-sm text-choco-300 mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1 text-sm py-2">Cancel</button>
                <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
