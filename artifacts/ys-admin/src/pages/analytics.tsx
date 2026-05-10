import AdminLayout from "@/components/layout/AdminLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from "recharts";
import { revenueData, categoryData, orders, products, customers, formatPrice } from "@/lib/data";

const monthlyOrders = revenueData.map((d) => ({ ...d, avg: Math.round(d.revenue / d.orders) }));
const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

const countryData = [
  { country: "Maroc", orders: 18, revenue: 310000 },
  { country: "France", orders: 12, revenue: 258000 },
  { country: "Algérie", orders: 7, revenue: 124000 },
  { country: "Tunisie", orders: 5, revenue: 89500 },
  { country: "Autres", orders: 3, revenue: 48000 },
];

export default function AnalyticsPage() {
  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const avgOrder = Math.round(totalRevenue / orders.filter((o) => o.status !== "cancelled").length);

  return (
    <AdminLayout title="Analytiques" subtitle="Performance globale de la boutique">
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Chiffre d'affaires total", value: formatPrice(totalRevenue), sub: "Hors annulations" },
          { label: "Panier moyen", value: formatPrice(avgOrder), sub: "Par commande" },
          { label: "Taux de conversion", value: "3.8%", sub: "+0.4% vs mois dernier" },
        ].map((k) => (
          <div key={k.label} className="ys-card">
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ys-text-muted)", marginBottom: "0.375rem" }}>
              {k.label}
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 400, color: "var(--ys-gold)", marginBottom: "0.25rem" }}>
              {k.value}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--ys-text-dim)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        {/* Revenue bar */}
        <div className="ys-card">
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Revenus mensuels</div>
          <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)", marginBottom: "1.25rem" }}>MAD — 7 derniers mois</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="rgba(201,168,76,0.07)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--ys-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--ys-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "var(--ys-surface-2)", border: "1px solid var(--ys-border)", borderRadius: 0, fontSize: "0.8rem", color: "var(--ys-text)" }}
                formatter={(val: number) => [formatPrice(val), "Revenus"]}
              />
              <Bar dataKey="revenue" fill="#C9A84C" radius={0} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders line */}
        <div className="ys-card">
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Volume & panier moyen</div>
          <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)", marginBottom: "1.25rem" }}>Commandes et panier moyen</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyOrders} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="rgba(201,168,76,0.07)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--ys-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "var(--ys-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--ys-text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "var(--ys-surface-2)", border: "1px solid var(--ys-border)", borderRadius: 0, fontSize: "0.8rem", color: "var(--ys-text)" }}
              />
              <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#4C8CC9" strokeWidth={2} dot={{ fill: "#4C8CC9", r: 3, strokeWidth: 0 }} name="Commandes" />
              <Line yAxisId="right" type="monotone" dataKey="avg" stroke="#C9A84C" strokeWidth={2} dot={{ fill: "#C9A84C", r: 3, strokeWidth: 0 }} name="Panier moyen" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Top products */}
        <div className="ys-card">
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "1rem" }}>
            Top 5 produits vendus
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    background: i === 0 ? "var(--ys-gold)" : "var(--ys-surface-2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: i === 0 ? "#0C0A08" : "var(--ys-text-muted)",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.name}
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "var(--ys-surface-2)",
                      marginTop: 4,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(p.sold / topProducts[0].sold) * 100}%`,
                        background: i === 0 ? "var(--ys-gold)" : "rgba(201,168,76,0.4)",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)", flexShrink: 0 }}>
                  {p.sold} vendus
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country breakdown */}
        <div className="ys-card">
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "1rem" }}>
            Ventes par pays
          </div>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0 0 0.5rem", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--ys-text-dim)", textTransform: "uppercase", borderBottom: "1px solid var(--ys-border)" }}>
                  Pays
                </th>
                <th style={{ textAlign: "center", padding: "0 0 0.5rem", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--ys-text-dim)", textTransform: "uppercase", borderBottom: "1px solid var(--ys-border)" }}>
                  Cmd
                </th>
                <th style={{ textAlign: "right", padding: "0 0 0.5rem", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--ys-text-dim)", textTransform: "uppercase", borderBottom: "1px solid var(--ys-border)" }}>
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody>
              {countryData.map((c) => (
                <tr key={c.country}>
                  <td style={{ padding: "0.625rem 0", fontSize: "0.875rem", borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
                    {c.country}
                  </td>
                  <td style={{ padding: "0.625rem 0", fontSize: "0.875rem", textAlign: "center", color: "var(--ys-text-muted)", borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
                    {c.orders}
                  </td>
                  <td style={{ padding: "0.625rem 0", fontFamily: "var(--font-serif)", fontSize: "0.9rem", color: "var(--ys-gold)", textAlign: "right", borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
                    {formatPrice(c.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
