import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEdit, MdDelete, MdCheckCircle, MdClose, MdAdd } from "react-icons/md";
import { useStore, type ProductCategory, type Product } from "../../store/useStore";

/* ─── Preset gradients the admin can pick from ─── */
const GRADIENTS = [
  { label: "Dark Chocolate", value: "from-choco-800 to-choco-600" },
  { label: "Warm Amber",     value: "from-amber-900 to-yellow-800" },
  { label: "Rose Pink",      value: "from-rose-900 to-pink-900" },
  { label: "Stone",          value: "from-stone-900 to-choco-800" },
  { label: "Violet",         value: "from-violet-900 to-purple-900" },
  { label: "Teal",           value: "from-teal-900 to-emerald-900" },
];

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ═══════════════════════════════════════════
   CATEGORY MANAGER
   ═══════════════════════════════════════════ */
function CategoryManager() {
  const { state, dispatch } = useStore();
  const { categories } = state;

  const [name, setName] = useState("");
  const [gradient, setGradient] = useState(GRADIENTS[0].value);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const cat: ProductCategory = {
      id:       editingId || `cat_${Date.now()}`,
      name:     name.trim(),
      slug:     slugify(name.trim()),
      gradient,
    };
    if (editingId) {
      dispatch({ type: "UPDATE_CATEGORY", payload: cat });
    } else {
      dispatch({ type: "ADD_CATEGORY", payload: cat });
    }
    setName(""); setGradient(GRADIENTS[0].value); setEditingId(null);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(cat: ProductCategory) {
    setEditingId(cat.id); setName(cat.name); setGradient(cat.gradient ?? GRADIENTS[0].value);
  }

  function handleDelete(id: string) {
    dispatch({ type: "DELETE_CATEGORY", payload: id });
    setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Add/Edit form */}
      <div className="card-dark p-5 rounded-2xl">
        <h3 className="font-playfair text-lg font-bold text-white mb-4">
          {editingId ? "Edit Category" : "Add Category"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-caramel-300 mb-1 block">Category Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chocolate, Vanilla..." className="input-dark" required
            />
            {name && <p className="text-xs text-choco-300 mt-1">Slug: /{slugify(name)}</p>}
          </div>
          <div>
            <label className="text-sm text-caramel-300 mb-2 block">Card Background</label>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map((g) => (
                <button key={g.value} type="button"
                  onClick={() => setGradient(g.value)}
                  className={`h-8 w-20 rounded-xl bg-gradient-to-br ${g.value} text-[10px] text-white/80 font-medium transition-all ${
                    gradient === g.value ? "ring-2 ring-caramel-400 scale-105" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <motion.button type="submit" className="btn-primary flex items-center gap-2" whileTap={{ scale: 0.97 }}>
              <AnimatePresence mode="wait">
                {saved
                  ? <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1"><MdCheckCircle /> Saved!</motion.span>
                  : <motion.span key="l" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1"><MdAdd size={18} />{editingId ? "Update" : "Add Category"}</motion.span>
                }
              </AnimatePresence>
            </motion.button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setName(""); setGradient(GRADIENTS[0].value); }} className="btn-outline text-sm px-4">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category list */}
      <div className="card-dark p-5 rounded-2xl">
        <h3 className="font-playfair text-lg font-bold text-white mb-4">
          Categories ({categories.length})
        </h3>
        {categories.length === 0 ? (
          <p className="text-choco-300 text-sm text-center py-6">No categories yet. Add one above.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 bg-gradient-to-br ${cat.gradient ?? GRADIENTS[0].value}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  <p className="text-xs text-choco-300">/{cat.slug}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => handleEdit(cat)} className="text-caramel-400 hover:text-caramel-300 p-1.5 transition-colors"><MdEdit size={18} /></button>
                  <button onClick={() => setDeleteTarget(cat.id)} className="text-red-400 hover:text-red-300 p-1.5 transition-colors"><MdDelete size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="card-dark p-6 rounded-3xl max-w-sm w-full"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-playfair text-lg font-bold text-white">Delete this category?</h3>
                <button onClick={() => setDeleteTarget(null)} className="text-choco-300 hover:text-white"><MdClose size={20} /></button>
              </div>
              <p className="text-sm text-choco-300 mb-6">Products in this category won't be deleted but will become uncategorised.</p>
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

/* ═══════════════════════════════════════════
   PRODUCT MANAGER
   ═══════════════════════════════════════════ */
interface ProductForm {
  imageSource: "upload" | "url";
  imageUrl: string;
  imageBase64: string;
  name: string;
  categoryId: string;
  caption: string;
}

function ProductManagerTab() {
  const { state, dispatch } = useStore();
  const { products, categories } = state;

  const defaultCat = categories[0]?.id ?? "";
  const DEFAULT_FORM: ProductForm = { imageSource: "upload", imageUrl: "", imageBase64: "", name: "", categoryId: defaultCat, caption: "" };

  const [form, setForm] = useState<ProductForm>({ ...DEFAULT_FORM, categoryId: defaultCat });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const finalImage = form.imageSource === "upload" ? form.imageBase64 : form.imageUrl;

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => setForm((f) => ({ ...f, imageBase64: e.target?.result as string }));
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const product: Product = {
      id:         editingId || `prod_${Date.now()}`,
      name:       form.name.trim(),
      categoryId: form.categoryId,
      caption:    form.caption,
      imageUrl:   finalImage,
    };
    if (editingId) {
      dispatch({ type: "UPDATE_PRODUCT", payload: product });
    } else {
      dispatch({ type: "ADD_PRODUCT", payload: product });
    }
    setForm({ ...DEFAULT_FORM, categoryId: defaultCat });
    setEditingId(null); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      imageSource: p.imageUrl.startsWith("data:") ? "upload" : "url",
      imageUrl: p.imageUrl.startsWith("data:") ? "" : p.imageUrl,
      imageBase64: p.imageUrl.startsWith("data:") ? p.imageUrl : "",
      name: p.name, categoryId: p.categoryId, caption: p.caption,
    });
  }

  const displayedProducts = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.caption.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Add/Edit form */}
      <div className="card-dark p-6 rounded-3xl">
        <h3 className="font-playfair text-xl font-bold text-white mb-5">
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>
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
                  <div
                    className="border-2 border-dashed border-caramel-700/50 rounded-2xl p-6 text-center cursor-pointer hover:border-caramel-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {form.imageBase64 ? (
                      <img src={form.imageBase64} className="max-h-32 mx-auto rounded-xl object-contain" />
                    ) : (
                      <><p className="text-3xl mb-2">📸</p><p className="text-caramel-400 text-sm">Drag image here or click to browse</p></>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  </div>
                ) : (
                  <input type="url" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..." className="input-dark" />
                )}
              </div>

              {/* Product name */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">Product Name <span className="text-xs text-choco-300">(used as order name)</span></label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Triple Chocolate Layer Cake" className="input-dark" required />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">Category</label>
                {categories.length === 0 ? (
                  <p className="text-xs text-red-400 py-2">Add a category first in the Categories tab.</p>
                ) : (
                  <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className="input-dark" required>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="text-sm text-caramel-300 mb-1 block">Caption / Description</label>
                <div className="relative">
                  <textarea value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value.slice(0, 200) }))}
                    rows={3} className="input-dark resize-none" placeholder="Describe this cake..." />
                  <span className="absolute bottom-2 right-3 text-xs text-choco-300">{form.caption.length}/200</span>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <motion.button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" whileTap={{ scale: 0.97 }}>
                  <AnimatePresence mode="wait">
                    {saved
                      ? <motion.span key="s" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2"><MdCheckCircle size={18} /> Saved!</motion.span>
                      : <motion.span key="l" initial={{ scale: 0 }} animate={{ scale: 1 }}>{editingId ? "Update Product" : "Add Product"}</motion.span>
                    }
                  </AnimatePresence>
                </motion.button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({ ...DEFAULT_FORM, categoryId: defaultCat }); }} className="btn-outline text-sm px-4">
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Live preview */}
            <div className="lg:w-52 flex flex-col gap-3">
              <p className="text-sm text-caramel-300 font-medium">Preview</p>
              <div className="rounded-2xl overflow-hidden bg-choco-800 border border-caramel-800/30">
                <div className="aspect-square bg-choco-700 relative">
                  {finalImage ? (
                    <img src={finalImage} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-choco-500">🎂</div>
                  )}
                  {form.categoryId && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs bg-caramel-400/90 text-white">
                      {categories.find((c) => c.id === form.categoryId)?.name}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-white truncate">{form.name || "Product name..."}</p>
                  <p className="text-xs text-choco-300 line-clamp-2 mt-1">{form.caption || "Caption..."}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Product list */}
      <div className="card-dark p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <h3 className="font-playfair text-xl font-bold text-white flex-1">Products ({products.length})</h3>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..." className="input-dark py-1.5 text-sm w-40" />
        </div>

        {displayedProducts.length === 0 ? (
          <div className="text-center py-10"><p className="text-4xl mb-2">🎂</p><p className="text-choco-300 text-sm">No products found</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedProducts.map((product) => (
              <div key={product.id} className="rounded-2xl overflow-hidden relative bg-choco-700">
                <div className="aspect-square relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎂</div>
                  )}
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-caramel-400/90 text-white leading-none">
                    {categories.find((c) => c.id === product.categoryId)?.name ?? "—"}
                  </span>
                </div>
                <div className="bg-choco-800 p-2 flex items-center justify-between gap-1">
                  <p className="text-xs text-white truncate flex-1">{product.name}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleEdit(product)} className="text-caramel-400 hover:text-caramel-300 p-1 transition-colors"><MdEdit size={16} /></button>
                    <button onClick={() => setDeleteTarget(product.id)} className="text-red-400 hover:text-red-300 p-1 transition-colors"><MdDelete size={16} /></button>
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
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="card-dark p-6 rounded-3xl max-w-sm w-full"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-playfair text-lg font-bold text-white">Delete this product?</h3>
                <button onClick={() => setDeleteTarget(null)} className="text-choco-300 hover:text-white"><MdClose size={20} /></button>
              </div>
              <p className="text-sm text-choco-300 mb-6">This action cannot be undone.</p>
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

/* ═══════════════════════════════════════════
   MAIN EXPORT — Tabs wrapper
   ═══════════════════════════════════════════ */
export default function ProductManager() {
  const [tab, setTab] = useState<"categories" | "products">("products");

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      <div className="bg-caramel-400/10 border border-caramel-400/30 rounded-2xl p-4 text-sm text-caramel-300">
        🛍️ Manage the <strong>categories</strong> and <strong>products</strong> shown on the <em>Our Menu</em> page.
        The <strong>Product Name</strong> is used as the order item name when customers tap "Order".
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(["products", "categories"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all ${tab === t ? "bg-caramel-400 text-white" : "border border-caramel-700/50 text-caramel-300 hover:border-caramel-400"}`}>
            {t === "products" ? "🎂 Products" : "📂 Categories"}
          </button>
        ))}
      </div>

      {tab === "categories" ? <CategoryManager /> : <ProductManagerTab />}
    </div>
  );
}
