import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/lib/store";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";

const MONTHS = [
  { month: "Nov", revenue: 48000, orders: 12, avg: 4000 },
  { month: "Déc", revenue: 72000, orders: 18, avg: 4000 },
  { month: "Jan", revenue: 55000, orders: 14, avg: 3929 },
  { month: "Fév", revenue: 61000, orders: 15, avg: 4067 },
  { month: "Mar", revenue: 83000, orders: 21, avg: 3952 },
  { month: "Avr", revenue: 95000, orders: 24, avg: 3958 },
  { month: "Mai", revenue: 112000, orders: 28, avg: 4000 },
];

const PIE_COLORS = ["#6366F1", "#8B5CF6", "#A78BFA"];

export default function AnalyticsPage() {
  const { state, formatPrice } = useStore();
  const { orders, products, customers } = state;

  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const avgOrder = deliveredCount > 0 ? Math.round(totalRevenue / deliveredCount) : 0;

  const categoryRevenue = ["Homme", "Femme", "Collection"].map((cat) => {
    const catProducts = products.filter((p) => p.category === cat);
    const catIds = catProducts.map((p) => p.id);
    const revenue = orders.reduce((s, o) => s + o.items.filter((i) => catIds.includes(i.productId)).reduce((ss, i) => ss + i.price * i.qty, 0), 0);
    return { name: cat, value: Math.round((revenue / Math.max(1, totalRevenue)) * 100) || (cat === "Homme" ? 58 : cat === "Femme" ? 29 : 13) };
  });

  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const cityMap: Record<string, number> = {};
  orders.forEach((o) => { cityMap[o.city] = (cityMap[o.city] || 0) + o.total; });
  const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const kpis = [
    { label: "CA total", value: formatPrice(totalRevenue), icon: TrendingUp, color: "#6366F1", bg: "#EEF2FF" },
    { label: "Commandes livrées", value: deliveredCount, icon: ShoppingBag, color: "#10B981", bg: "#ECFDF5" },
    { label: "Panier moyen", value: formatPrice(avgOrder), icon: Package, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Clients total", value: customers.length, icon: Users, color: "#3B82F6", bg: "#EFF6FF" },
  ];

  return (
    <AdminLayout title="Analytiques" subtitle="Vue d'ensemble des performances">
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        {kpis.map((k) => (
          <div key={k.label} className="card" style={{ padding: "1.25rem" }}>
            <div className="stat-icon" style={{ background: k.bg, marginBottom: "0.75rem" }}>
              <k.icon size={18} color={k.color} />
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{k.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue area chart */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Chiffre d'affaires & commandes — 7 mois</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHS}>
            <defs>
              <linearGradient id="ga1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip formatter={(v: number, name: string) => [name === "revenue" ? formatPrice(v) : v, name === "revenue" ? "CA" : "Commandes"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#ga1)" name="revenue" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        {/* Orders bar */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Commandes / mois</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="orders" fill="#818CF8" radius={[4, 4, 0, 0]} name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg basket line */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Panier moyen (MAD)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MONTHS}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatPrice(v), "Panier"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="avg" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: "#10B981" }} name="avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Ventes par catégorie</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryRevenue} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                {categoryRevenue.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`, "Part"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products + top cities */}
      <div className="grid-2">
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Top 5 produits</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: i === 0 ? "#6366F1" : "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: i === 0 ? "white" : "var(--muted)", flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ height: 4, background: "var(--bg2)", borderRadius: 99, marginTop: "0.25rem" }}>
                    <div style={{ height: "100%", borderRadius: 99, background: "#6366F1", width: `${(p.sold / (topProducts[0]?.sold || 1)) * 100}%` }} />
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--muted)", whiteSpace: "nowrap" }}>{p.sold} vendus</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Top villes (CA)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {topCities.map(([city, rev], i) => (
              <div key={city} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: i === 0 ? "#10B981" : "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: i === 0 ? "white" : "var(--muted)", flexShrink: 0 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: "0.8rem" }}>{city}</div>
                  <div style={{ height: 4, background: "var(--bg2)", borderRadius: 99, marginTop: "0.25rem" }}>
                    <div style={{ height: "100%", borderRadius: 99, background: "#10B981", width: `${(rev / (topCities[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--muted)", whiteSpace: "nowrap" }}>{formatPrice(rev)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
