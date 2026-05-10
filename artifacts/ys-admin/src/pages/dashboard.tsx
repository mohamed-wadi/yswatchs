import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  TrendingUp, ShoppingBag, Package, Users, AlertTriangle,
  Clock, CheckCircle2, Truck, Ban, ArrowRight,
} from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  pending: "#F59E0B", confirmed: "#3B82F6", shipped: "#F97316",
  delivered: "#10B981", cancelled: "#EF4444", refused: "#94A3B8",
};

export default function Dashboard() {
  const { state, formatPrice, formatDate, isBlacklisted } = useStore();
  const { orders, products, customers, blacklist } = state;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const monthStr = now.toISOString().slice(0, 7);

  const todayOrders = orders.filter((o) => o.date.startsWith(todayStr));
  const monthOrders = orders.filter((o) => o.date.startsWith(monthStr));
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const blacklistAlerts = orders.filter((o) => isBlacklisted(o.phone) && o.status === "pending");

  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const monthRevenue = monthOrders.filter((o) => o.status !== "cancelled" && o.status !== "refused").reduce((s, o) => s + o.total, 0);
  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);

  const revenueData = [
    { month: "Nov", revenue: 48000, orders: 12 },
    { month: "Déc", revenue: 72000, orders: 18 },
    { month: "Jan", revenue: 55000, orders: 14 },
    { month: "Fév", revenue: 61000, orders: 15 },
    { month: "Mar", revenue: 83000, orders: 21 },
    { month: "Avr", revenue: 95000, orders: 24 },
    { month: "Mai", revenue: monthRevenue || 112000, orders: monthOrders.length || 28 },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const kpis = [
    {
      label: "Commandes ce mois",
      value: monthOrders.length,
      sub: `${todayOrders.length} aujourd'hui`,
      icon: ShoppingBag,
      color: "#6366F1",
      bg: "#EEF2FF",
    },
    {
      label: "Chiffre d'affaires",
      value: formatPrice(totalRevenue),
      sub: `${formatPrice(monthRevenue)} ce mois`,
      icon: TrendingUp,
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      label: "En attente",
      value: pendingOrders.length,
      sub: `${deliveredOrders.length} livrées au total`,
      icon: Clock,
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
    {
      label: "Clients",
      value: customers.length,
      sub: `${blacklist.length} blacklisté${blacklist.length > 1 ? "s" : ""}`,
      icon: Users,
      color: "#3B82F6",
      bg: "#EFF6FF",
    },
  ];

  return (
    <AdminLayout title="Tableau de bord" subtitle={`Bonjour — ${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}`}>

      {/* Blacklist Alerts */}
      {blacklistAlerts.length > 0 && (
        <div className="alert alert-danger" style={{ marginBottom: "1.25rem", alignItems: "center" }}>
          <Ban size={16} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>{blacklistAlerts.length} commande{blacklistAlerts.length > 1 ? "s" : ""} provenant de numéros blacklistés</strong>
            <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>— Vérifiez les commandes en attente.</span>
          </div>
          <Link href="/admin/orders">
            <button className="btn btn-sm" style={{ background: "var(--danger)", color: "white" }}>Voir <ArrowRight size={12} /></button>
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        {kpis.map((k) => (
          <div key={k.label} className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
              <div className="stat-icon" style={{ background: k.bg }}>
                <k.icon size={18} color={k.color} />
              </div>
            </div>
            <div style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.25rem" }}>{k.value}</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 500, marginBottom: "0.125rem" }}>{k.label}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Revenue chart */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Chiffre d'affaires — 7 derniers mois</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip formatter={(v: number) => [formatPrice(v), "CA"]} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders bar */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Commandes / mois</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="orders" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1rem" }}>
        {/* Recent orders */}
        <div className="card">
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Dernières commandes</h3>
            <Link href="/admin/orders"><button className="btn btn-ghost btn-sm">Tout voir <ArrowRight size={12} /></button></Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Référence</th><th>Client</th><th>Ville</th><th>Total</th><th>Statut</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const bl = isBlacklisted(o.phone);
                  return (
                    <tr key={o.id} className={bl ? "row-blacklist" : ""}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.775rem" }}>
                        {bl && <span title="Numéro blacklisté">🚫 </span>}
                        {o.reference}
                      </td>
                      <td>{o.customerName}</td>
                      <td style={{ color: "var(--muted)" }}>{o.city}</td>
                      <td style={{ fontWeight: 600 }}>{formatPrice(o.total)}</td>
                      <td>
                        <span className={`badge badge-${o.status}`}>{o.status === "pending" ? "En attente" : o.status === "confirmed" ? "Confirmée" : o.status === "shipped" ? "Expédiée" : o.status === "delivered" ? "Livrée" : o.status === "cancelled" ? "Annulée" : "Refusée"}</span>
                      </td>
                      <td style={{ color: "var(--muted)" }}>{formatDate(o.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock alerts */}
        <div className="card">
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Alertes stock</h3>
            <Link href="/admin/inventory"><button className="btn btn-ghost btn-sm">Gérer <ArrowRight size={12} /></button></Link>
          </div>
          <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {outOfStock.length === 0 && lowStock.length === 0 && (
              <div style={{ color: "var(--muted)", fontSize: "0.8125rem", textAlign: "center", padding: "1rem" }}>✅ Tous les stocks sont OK</div>
            )}
            {outOfStock.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.625rem", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}>
                <Package size={13} color="var(--danger)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ color: "var(--danger)", fontSize: "0.7rem" }}>Épuisé</div>
                </div>
              </div>
            ))}
            {lowStock.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.625rem", background: "var(--warning-bg)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}>
                <AlertTriangle size={13} color="var(--warning)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ color: "var(--warning)", fontSize: "0.7rem" }}>Stock faible ({p.stock} restants)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
