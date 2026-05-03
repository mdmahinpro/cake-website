import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete, MdCheckCircle, MdClose, MdAdd, MdPhoto } from "react-icons/md";
import { useStore, type ProductCategory, type Product } from "../../store/useStore";

function formatPrice(p: string): string {
  const t = p.trim();
  return t.startsWith("৳") ? t : "৳" + t;
}

const GRADIENTS = [
  { label: "Dark Chocolate", value: "from-choco-800 to-choco-600" },
  { label: "Warm Amber",     value: "from-amber-900 to-yellow-800" },
  { label: "Rose Pink",      value: "from-rose-900 to-pink-900" },
  { label: "Stone",          value: "from-stone-900 to-choco-800" },
  { label: "Violet",         value: "from-violet-900 to-purple-900" },
  { label: "Teal",           value: "from-teal-900 to-emerald-900" },
];

const CARD    = { background: "rgba(3,21,37,0.85)", border: "1px solid rgba(0,190,255,0.16)" } as const;
const BORDER_B = { borderColor: "rgba(0,190,255,0.14)" };
const LBL     = { color: "#4dd9ff" } as const;
const HINT    = { color: "#2a6eb5" } as const;

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ─────────────────────────────────────────
   CATEGORY MANAGER
───────────────────────────────────────── */
function CategoryManager() {
  const { state, dispatch } = useStore();
  const { categories } = state;

  const [name, setName]           = useState("");
  const [gradient, setGradient]   = useState(GRADIENTS[0].value);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const cat: ProductCategory = {
      id: editingId || `cat_${Date.now()}`,
      name: name.trim(), slug: slugify(name.trim()), gradient,
    };
    if (editingId) { dispatch({ type: "UPDATE_CATEGORY", payload: cat }); }
    else           { dispatch({ type: "ADD_CATEGORY",    payload: cat }); }
    setName(""); setGradient(GRADIENTS[0].value); setEditingId(null);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(cat: ProductCategory) {
    setEditingId(cat.id); setName(cat.name); setGradient(cat.gradient ?? GRADIENTS[0].value);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Add/Edit form */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h3 className="font-playfair text-base font-bold text-white border-b pb-3" style={BORDER_B}>
          {editingId ? "Edit Category" : "Add Category"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={LBL}>Category Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chocolate, Vanilla..." className="input-dark" required />
            {name && <p className="text-xs" style={HINT}>Slug: /{slugify(name)}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={LBL}>Card Background</label>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map((g) => (
                <button key={g.value} type="button"
                  onClick={() => setGradient(g.value)}
                  className={`h-8 w-20 rounded-xl bg-gradient-to-br ${g.value} text-[10px] text-white/80 font-medium transition-all ${
                    gradient === g.value ? "ring-2 ring-caramel-400 scale-105" : "opacity-60 hover:opacity-100"}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button type="submit" className="btn-primary flex items-center gap-2" whileTap={{ scale: 0.97 }}>
              <AnimatePresence mode="wait">
                {saved
                  ? <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1"><MdCheckCircle /> Saved</motion.span>
                  : <motion.span key="l" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1"><MdAdd size={18} />{editingId ? "Update" : "Add Category"}</motion.span>
                }
              </AnimatePresence>
            </motion.button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setName(""); setGradient(GRADIENTS[0].value); }}
                className="btn-outline text-sm px-4">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* Category list */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h3 className="font-playfair text-base font-bold text-white border-b pb-3" style={BORDER_B}>
          Categories ({categories.length})
        </h3>
        {categories.length === 0 ? (
          <p className="text-sm text-center py-6" style={HINT}>No categories yet. Add one above.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                style={{ background: "rgba(0,190,255,0.04)" }}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 bg-gradient-to-br ${cat.gradient ?? GRADIENTS[0].value}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  <p className="text-xs" style={HINT}>/{cat.slug}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(cat)} className="p-1.5 transition-colors" style={{ color: "#4dd9ff" }}><MdEdit size={18} /></button>
                  <button onClick={() => setDeleteTarget(cat.id)} className="p-1.5 text-red-400 hover:text-red-300 transition-colors"><MdDelete size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="rounded-2xl p-6 max-w-sm w-full" style={CARD}
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-playfair text-lg font-bold text-white">Delete this category?</h3>
                <button onClick={() => setDeleteTarget(null)} style={{ color: "#2a6eb5" }}><MdClose size={20} /></button>
              </div>
              <p className="text-sm mb-6" style={HINT}>Products in this category won't be deleted but will become uncategorised.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1 text-sm py-2">Cancel</button>
                <button onClick={() => { dispatch({ type: "DELETE_CATEGORY", payload: deleteTarget }); setDeleteTarget(null); }}
                  className="flex-1 py-2 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   PRODUCT MANAGER TAB
───────────────────────────────────────── */
interface ProductForm {
  imageSource: "upload" | "url";
  imageUrl: string;
  imageBase64: string;
  name: string;
  categoryId: string;
  caption: string;
  price: string;
}

function ProductManagerTab() {
  const { state, dispatch } = useStore();
  const { products, categories, settings } = state;

  const defaultCat = categories[0]?.id ?? "";
  const DEFAULT_FORM: ProductForm = {
    imageSource: "upload", imageUrl: "", imageBase64: "",
    name: "", categoryId: defaultCat, caption: "", price: "",
  };

  const [form, setForm]           = useState<ProductForm>({ ...DEFAULT_FORM, categoryId: defaultCat });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const product: Product = {
      id: editingId || `prod_${Date.now()}`,
      name: form.name.trim(), categoryId: form.categoryId,
      caption: form.caption, imageUrl: finalImage,
      price: form.price.trim() || undefined,
    };
    if (editingId) { dispatch({ type: "UPDATE_PRODUCT", payload: product }); }
    else           { dispatch({ type: "ADD_PRODUCT",    payload: product }); }
    setForm({ ...DEFAULT_FORM, categoryId: defaultCat });
    setEditingId(null); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      imageSource: p.imageUrl.startsWith("data:") ? "upload" : "url",
      imageUrl:    p.imageUrl.startsWith("data:") ? "" : p.imageUrl,
      imageBase64: p.imageUrl.startsWith("data:") ? p.imageUrl : "",
      name: p.name, categoryId: p.categoryId, caption: p.caption,
      price: p.price ?? "",
    });
  }

  const displayedProducts = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.caption.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Add/Edit form */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h3 className="font-playfair text-base font-bold text-white border-b pb-3" style={BORDER_B}>
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>
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
                      <img src={form.imageBase64} className="max-h-32 mx-auto rounded-xl object-contain" />
                    ) : (
                      <>
                        <MdPhoto size={32} className="mx-auto mb-2" style={{ color: "rgba(0,190,255,0.35)" }} />
                        <p className="text-sm" style={LBL}>Drag image here or click to browse</p>
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

              {/* Product name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>
                  Product Name <span className="text-xs" style={HINT}>(used as order name)</span>
                </label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Triple Chocolate Layer Cake" className="input-dark" required />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>Category</label>
                {categories.length === 0 ? (
                  <p className="text-xs text-red-400 py-2">Add a category first in the Categories tab.</p>
                ) : (
                  <select value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="input-dark" required>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>
                  Price <span className="text-xs" style={HINT}>(optional — e.g. ৳500, ৳500–800, From ৳600)</span>
                </label>
                <input value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. ৳800 or From ৳500"
                  className="input-dark" />
                {!settings.showPrices && (
                  <p className="text-xs" style={{ color: "#f59e0b" }}>
                    ⚠ Price display is currently OFF in Settings → Appearance. Enable it for prices to appear on the public site.
                  </p>
                )}
              </div>

              {/* Caption */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={LBL}>Caption / Description</label>
                <div className="relative">
                  <textarea value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value.slice(0, 200) }))}
                    rows={3} className="input-dark resize-none" placeholder="Describe this cake..." />
                  <span className="absolute bottom-2 right-3 text-xs" style={HINT}>{form.caption.length}/200</span>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <motion.button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" whileTap={{ scale: 0.97 }}>
                  <AnimatePresence mode="wait">
                    {saved
                      ? <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2"><MdCheckCircle size={18} /> Saved</motion.span>
                      : <motion.span key="l" initial={{ scale: 0 }} animate={{ scale: 1 }}>{editingId ? "Update Product" : "Add Product"}</motion.span>
                    }
                  </AnimatePresence>
                </motion.button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ ...DEFAULT_FORM, categoryId: defaultCat }); }}
                    className="btn-outline text-sm px-4">Cancel</button>
                )}
              </div>
            </div>

            {/* Live preview */}
            <div className="lg:w-48 flex flex-col gap-3">
              <p className="text-sm font-medium" style={LBL}>Preview</p>
              <div className="rounded-2xl overflow-hidden" style={{ background: "#051e36", border: "1px solid rgba(0,190,255,0.14)" }}>
                <div className="aspect-square relative" style={{ background: "#031525" }}>
                  {finalImage ? (
                    <img src={finalImage} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdPhoto size={36} style={{ color: "rgba(0,190,255,0.2)" }} />
                    </div>
                  )}
                  {form.categoryId && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: "#00beff", color: "#010d1e" }}>
                      {categories.find((c) => c.id === form.categoryId)?.name}
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <p className="text-xs font-semibold text-white truncate">{form.name || "Product name..."}</p>
                  {form.price && settings.showPrices && (
                    <p className="text-xs font-bold" style={{ color: "#00beff" }}>{formatPrice(form.price)}</p>
                  )}
                  <p className="text-xs line-clamp-2" style={HINT}>{form.caption || "Caption..."}</p>
                </div>
              </div>
              {form.price && !settings.showPrices && (
                <p className="text-[10px] text-amber-400/70 text-center">Price hidden (toggle in Settings)</p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Product list */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b pb-4" style={BORDER_B}>
          <h3 className="font-playfair text-base font-bold text-white flex-1">Products ({products.length})</h3>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..." className="input-dark py-1.5 text-sm w-36" />
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-10">
            <MdPhoto size={36} className="mx-auto mb-2" style={{ color: "rgba(0,190,255,0.2)" }} />
            <p className="text-sm" style={HINT}>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedProducts.map((product) => (
              <div key={product.id} className="rounded-2xl overflow-hidden" style={{ background: "#031525", border: "1px solid rgba(0,190,255,0.1)" }}>
                <div className="aspect-square relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdPhoto size={28} style={{ color: "rgba(0,190,255,0.2)" }} />
                    </div>
                  )}
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none"
                    style={{ background: "#00beff", color: "#010d1e" }}>
                    {categories.find((c) => c.id === product.categoryId)?.name ?? "—"}
                  </span>
                </div>
                <div className="px-2 pt-1.5 pb-2 flex flex-col gap-0.5" style={{ background: "#051e36" }}>
                  <p className="text-xs text-white truncate font-medium">{product.name}</p>
                  {product.price && (
                    <p className="text-[11px] font-bold" style={{ color: "#00beff" }}>{formatPrice(product.price)}</p>
                  )}
                  <div className="flex items-center justify-end gap-1 pt-0.5">
                    <button onClick={() => handleEdit(product)} className="p-1 transition-colors" style={{ color: "#4dd9ff" }}><MdEdit size={16} /></button>
                    <button onClick={() => setDeleteTarget(product.id)} className="p-1 text-red-400 hover:text-red-300 transition-colors"><MdDelete size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="rounded-2xl p-6 max-w-sm w-full" style={CARD}
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-playfair text-lg font-bold text-white">Delete this product?</h3>
                <button onClick={() => setDeleteTarget(null)} style={{ color: "#2a6eb5" }}><MdClose size={20} /></button>
              </div>
              <p className="text-sm mb-6" style={HINT}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1 text-sm py-2">Cancel</button>
                <button onClick={() => { dispatch({ type: "DELETE_PRODUCT", payload: deleteTarget }); setDeleteTarget(null); }}
                  className="flex-1 py-2 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT — Tab wrapper
───────────────────────────────────────── */
export default function ProductManager() {
  const [tab, setTab] = useState<"categories" | "products">("products");

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      {/* Info banner */}
      <div className="rounded-2xl p-4 text-sm" style={{ background: "rgba(0,190,255,0.06)", border: "1px solid rgba(0,190,255,0.18)", color: "#4dd9ff" }}>
        Manage the <strong className="text-white">categories</strong> and <strong className="text-white">products</strong> shown on the <em>Our Menu</em> page.
        The <strong className="text-white">Product Name</strong> is used as the order item name when customers tap "Order".
        Toggle price visibility in <strong className="text-white">Settings → Appearance</strong>.
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(["products", "categories"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all"
            style={tab === t
              ? { background: "#00beff", color: "#010d1e" }
              : { border: "1px solid rgba(0,190,255,0.25)", color: "#4dd9ff" }}>
            {t === "products" ? "Products" : "Categories"}
          </button>
        ))}
      </div>

      {tab === "categories" ? <CategoryManager /> : <ProductManagerTab />}
    </div>
  );
}
