import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { products as initialProducts, formatPrice, Product } from "@/lib/data";
import { AlertTriangle, TrendingDown, Package, RefreshCw } from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState("");

  const applyAdjust = (id: string) => {
    const delta = parseInt(adjustQty, 10);
    if (isNaN(delta)) return;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStock = Math.max(0, p.stock + delta);
        const stockStatus: Product["stockStatus"] =
          newStock === 0 ? "outofstock" : newStock <= 5 ? "lowstock" : "instock";
        return { ...p, stock: newStock, stockStatus };
      })
    );
    setAdjustId(null);
    setAdjustQty("");
  };

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const outOfStock = products.filter((p) => p.stockStatus === "outofstock").length;
  const lowStock = products.filter((p) => p.stockStatus === "lowstock").length;
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);

  return (
    <AdminLayout title="Inventaire" subtitle="Gestion des stocks en temps réel">
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Valeur totale stock", value: formatPrice(totalValue), icon: Package, color: "var(--ys-gold)" },
          { label: "Unités en stock", value: totalUnits, icon: Package, color: "var(--ys-info)" },
          { label: "Stock faible", value: lowStock, icon: TrendingDown, color: "var(--ys-warning)" },
          { label: "Épuisés", value: outOfStock, icon: AlertTriangle, color: "var(--ys-danger)" },
        ].map((k) => (
          <div key={k.label} className="ys-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <k.icon size={20} style={{ color: k.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ys-text-muted)", marginBottom: 4 }}>
                {k.label}
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 400, color: "var(--ys-text)" }}>
                {k.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="ys-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--ys-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>Stock par produit</span>
          <span style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)", letterSpacing: "0.08em" }}>{products.length} produits</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Prix unitaire</th>
              <th>Stock actuel</th>
              <th>Valeur stock</th>
              <th>Statut</th>
              <th>Ajustement</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ color: "var(--ys-gold)", fontFamily: "var(--font-serif)", fontSize: "0.85rem" }}>
                  {p.reference}
                </td>
                <td>
                  <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{p.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)" }}>{p.movement}</div>
                </td>
                <td style={{ color: "var(--ys-text-muted)", fontSize: "0.8rem" }}>{p.category}</td>
                <td style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem" }}>{formatPrice(p.price)}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: 80,
                        height: 6,
                        background: "var(--ys-surface-2)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, (p.stock / 20) * 100)}%`,
                          background:
                            p.stockStatus === "outofstock"
                              ? "var(--ys-danger)"
                              : p.stockStatus === "lowstock"
                              ? "var(--ys-warning)"
                              : "var(--ys-success)",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.875rem", minWidth: 20 }}>{p.stock}</span>
                  </div>
                </td>
                <td style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", color: "var(--ys-text-muted)" }}>
                  {formatPrice(p.price * p.stock)}
                </td>
                <td>
                  <span className={`status-badge status-${p.stockStatus}`}>
                    {p.stockStatus === "instock" ? "En stock" : p.stockStatus === "lowstock" ? "Faible" : "Épuisé"}
                  </span>
                </td>
                <td>
                  {adjustId === p.id ? (
                    <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                      <input
                        type="number"
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(e.target.value)}
                        placeholder="+/-"
                        style={{ width: 56, padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && applyAdjust(p.id)}
                      />
                      <button className="ys-btn ys-btn-primary" onClick={() => applyAdjust(p.id)} style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}>
                        OK
                      </button>
                      <button className="ys-btn ys-btn-ghost" onClick={() => { setAdjustId(null); setAdjustQty(""); }} style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAdjustId(p.id)}
                      style={{ background: "transparent", border: "1px solid var(--ys-border)", color: "var(--ys-text-muted)", cursor: "pointer", padding: "0.25rem 0.625rem", fontSize: "0.7rem", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.375rem", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ys-gold)"; (e.currentTarget as HTMLElement).style.color = "var(--ys-gold)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ys-border)"; (e.currentTarget as HTMLElement).style.color = "var(--ys-text-muted)"; }}
                    >
                      <RefreshCw size={11} /> Ajuster
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
