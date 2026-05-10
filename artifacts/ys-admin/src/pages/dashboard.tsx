import AdminLayout from "@/components/layout/AdminLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  revenueData, categoryData, orders, products, customers, formatPrice, formatDate,
} from "@/lib/data";
import {
  TrendingUp, ShoppingBag, Package, Users, AlertTriangle, ArrowUpRight,
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function Dashboard() {
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => p.stockStatus !== "instock").length;

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(totalRevenue),
      sub: "+18% vs mois dernier",
      icon: TrendingUp,
      color: "var(--ys-gold)",
      bg: "rgba(201,168,76,0.08)",
    },
    {
      label: "Commandes",
      value: totalOrders,
      sub: `${pendingCount} en attente`,
      icon: ShoppingBag,
      color: "var(--ys-info)",
      bg: "rgba(76,140,201,0.08)",
    },
    {
      label: "Produits",
      value: products.length,
      sub: `${lowStock} alertes stock`,
      icon: Package,
      color: "var(--ys-success)",
      bg: "rgba(76,175,124,0.08)",
    },
    {
      label: "Clients",
      value: customers.length,
      sub: `${customers.filter((c) => c.vip).length} VIP`,
      icon: Users,
      color: "#C97DC9",
      bg: "rgba(201,125,201,0.08)",
    },
  ];

  return (
    <AdminLayout title="Tableau de bord" subtitle="Vue d'ensemble de la boutique">
      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {kpis.map((k) => (
          <div
            key={k.label}
            className="ys-card animate-in"
            style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: k.bg,
                border: `1px solid ${k.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <k.icon size={18} style={{ color: k.color }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--ys-text-muted)",
                  marginBottom: "0.25rem",
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "var(--ys-text)",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}
              >
                {k.value}
              </div>
              <div style={{ fontSize: "0.7rem", color: k.color }}>
                {k.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem", marginBottom: "1.5rem" }}>
        {/* Revenue chart */}
        <div className="ys-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 500, marginBottom: 2 }}>
                Évolution des revenus
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)", letterSpacing: "0.05em" }}>
                6 derniers mois
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--ys-success)", fontSize: "0.8rem" }}>
              <ArrowUpRight size={14} />
              +18%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(201,168,76,0.07)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--ys-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--ys-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--ys-surface-2)",
                  border: "1px solid var(--ys-border)",
                  borderRadius: 0,
                  fontSize: "0.8rem",
                  color: "var(--ys-text)",
                }}
                formatter={(val: number) => [formatPrice(val), "Revenus"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C9A84C"
                strokeWidth={2}
                fill="url(#goldGrad)"
                dot={{ fill: "#C9A84C", r: 3, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="ys-card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 500, marginBottom: "0.25rem" }}>
            Ventes par catégorie
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)", marginBottom: "1rem", letterSpacing: "0.05em" }}>
            Ce mois
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--ys-surface-2)",
                  border: "1px solid var(--ys-border)",
                  borderRadius: 0,
                  fontSize: "0.8rem",
                  color: "var(--ys-text)",
                }}
                formatter={(val) => [`${val}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
            {categoryData.map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.8rem" }}>
                <div style={{ width: 8, height: 8, background: c.color, flexShrink: 0 }} />
                <span style={{ color: "var(--ys-text-muted)", flex: 1 }}>{c.name}</span>
                <span style={{ color: "var(--ys-text)", fontWeight: 500 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Recent orders */}
        <div className="ys-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 500 }}>
              Commandes récentes
            </div>
            <a href="/admin/orders" style={{ fontSize: "0.7rem", color: "var(--ys-gold)", letterSpacing: "0.08em", textDecoration: "none", textTransform: "uppercase" }}>
              Voir tout →
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem",
                  background: "var(--ys-surface-2)",
                  border: "1px solid rgba(201,168,76,0.07)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--ys-text)" }}>
                    {o.reference}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {o.customerName}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--ys-gold)", fontFamily: "var(--font-serif)" }}>
                    {formatPrice(o.total)}
                  </div>
                  <span className={`status-badge status-${o.status}`} style={{ marginTop: 2 }}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="ys-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 500 }}>
              Alertes inventaire
            </div>
            <AlertTriangle size={16} style={{ color: "var(--ys-warning)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {products
              .filter((p) => p.stockStatus !== "instock")
              .map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem",
                    background: "var(--ys-surface-2)",
                    border: "1px solid rgba(201,168,76,0.07)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--ys-text)" }}>{p.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)" }}>{p.reference}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--ys-text)" }}>{p.stock} restants</div>
                    <span className={`status-badge status-${p.stockStatus}`} style={{ marginTop: 2 }}>
                      {p.stockStatus === "outofstock" ? "Épuisé" : "Stock faible"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
