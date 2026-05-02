import { useStore } from "../../store/useStore";
import type { AdminPage } from "./AdminLayout";

interface DashboardPageProps {
  onNavigate: (page: AdminPage) => void;
}

function StatsCard({ value, label, icon }: { value: string | number; label: string; icon: string }) {
  return (
    <div className="card-dark p-5 rounded-2xl relative">
      <div className="absolute top-4 right-4 text-2xl">{icon}</div>
      <p className="text-3xl font-bold text-caramel-400 mb-1">{value}</p>
      <p className="text-sm text-choco-300">{label}</p>
    </div>
  );
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { state } = useStore();
  const { gallery, carousel, categories, products } = state;

  const delivered = gallery.filter((g) => g.type === "delivered").length;
  const featured  = gallery.filter((g) => g.featured).length;
  const lastUpdated = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const recent = [...gallery].reverse().slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-white mb-1">Welcome back! 🎂</h2>
        <p className="text-choco-300 text-sm">Here's an overview of your cake shop.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard value={products.length}  label="Menu Products"     icon="🛍️" />
        <StatsCard value={categories.length} label="Product Categories" icon="📂" />
        <StatsCard value={gallery.length}   label="Gallery Items"     icon="🖼️" />
        <StatsCard value={delivered}        label="Delivered Orders"  icon="✅" />
        <StatsCard value={featured}         label="Featured Picks"    icon="⭐" />
        <StatsCard value={carousel.length}  label="Carousel Slides"   icon="🎠" />
        <StatsCard value={lastUpdated}      label="Last Updated"      icon="📅" />
      </div>

      {/* Quick actions */}
      <div className="card-dark p-5 rounded-2xl">
        <h3 className="font-playfair text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate("products")} className="btn-primary text-sm">+ Add Product</button>
          <button onClick={() => onNavigate("gallery")}  className="btn-primary text-sm">+ Add Gallery Item</button>
          <button onClick={() => onNavigate("carousel")} className="btn-primary text-sm">+ Add Carousel Slide</button>
          <button onClick={() => onNavigate("settings")} className="btn-outline text-sm">⚙️ Settings</button>
        </div>
      </div>

      {/* Recent items */}
      <div className="card-dark p-5 rounded-2xl">
        <h3 className="font-playfair text-lg font-bold text-white mb-4">Recent Gallery Items</h3>
        {recent.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">🎂</p>
            <p className="text-choco-300 text-sm">No gallery items yet.</p>
            <button onClick={() => onNavigate("gallery")} className="btn-primary text-sm mt-3">Add Your First Cake</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-choco-700">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🎂</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.caption}</p>
                  <p className="text-xs text-caramel-400 capitalize">
                    {item.category}
                    {item.featured && " · ⭐ Featured"}
                    {item.type === "delivered" && " · ✅ Delivered"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
