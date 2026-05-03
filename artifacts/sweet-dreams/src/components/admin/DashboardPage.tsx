import {
  MdShoppingBag, MdCategory, MdCheckCircle,
  MdStar, MdPhoto, MdCalendarToday,
} from "react-icons/md";
import { useStore } from "../../store/useStore";
import type { AdminPage } from "./AdminLayout";

const CARD = {
  background: "rgba(3,21,37,0.85)",
  border: "1px solid rgba(0,190,255,0.16)",
} as const;

interface StatCardProps { value: string | number; label: string; Icon: React.ElementType; }
function StatCard({ value, label, Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-2" style={CARD}>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold font-playfair" style={{ color: "#00beff" }}>{value}</p>
        <Icon size={22} style={{ color: "rgba(0,190,255,0.4)" }} />
      </div>
      <p className="text-xs font-medium" style={{ color: "#2a6eb5" }}>{label}</p>
    </div>
  );
}

interface Props { onNavigate: (page: AdminPage) => void; }

export default function DashboardPage({ onNavigate }: Props) {
  const { state } = useStore();
  const { gallery, categories, products } = state;

  const delivered   = gallery.filter((g) => g.type === "delivered").length;
  const featured    = gallery.filter((g) => g.featured).length;
  const lastUpdated = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const recent      = gallery.filter((g) => g.type === "delivered").slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="rounded-2xl p-5" style={CARD}>
        <h2 className="font-playfair text-xl font-bold text-white mb-1">Shop Overview</h2>
        <p className="text-sm" style={{ color: "#2a6eb5" }}>
          Real-time snapshot of your cake shop. All changes reflect instantly on the public site.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard value={products.length}   label="Menu Products"      Icon={MdShoppingBag} />
        <StatCard value={categories.length} label="Categories"         Icon={MdCategory} />
        <StatCard value={delivered}         label="Delivered Orders"   Icon={MdCheckCircle} />
        <StatCard value={featured}          label="Featured in Carousel" Icon={MdStar} />
        <StatCard value={gallery.length}    label="Total in Gallery"   Icon={MdPhoto} />
        <StatCard value={lastUpdated}       label="Today"              Icon={MdCalendarToday} />
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h3 className="font-playfair text-base font-bold text-white border-b pb-3"
          style={{ borderColor: "rgba(0,190,255,0.14)" }}>
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate("delivered")} className="btn-primary text-sm">Add Delivered Order</button>
          <button onClick={() => onNavigate("products")}  className="btn-primary text-sm">Add Product</button>
          <button onClick={() => onNavigate("settings")}  className="btn-outline text-sm">Settings</button>
        </div>
      </div>

      {/* Recent delivered orders */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={CARD}>
        <h3 className="font-playfair text-base font-bold text-white border-b pb-3"
          style={{ borderColor: "rgba(0,190,255,0.14)" }}>
          Recent Delivered Orders
        </h3>
        {recent.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm mb-3" style={{ color: "#2a6eb5" }}>No delivered orders yet.</p>
            <button onClick={() => onNavigate("delivered")} className="btn-primary text-sm">Add Your First Order</button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl transition-colors"
                style={{ borderBottom: "1px solid rgba(0,190,255,0.06)" }}>
                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: "#051e36" }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MdPhoto size={18} style={{ color: "rgba(0,190,255,0.35)" }} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.caption}</p>
                  <p className="text-xs capitalize" style={{ color: "#00beff" }}>
                    {item.category}
                    {item.featured && " · ⭐ Featured in Carousel"}
                    {item.review && " · Has Review"}
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
