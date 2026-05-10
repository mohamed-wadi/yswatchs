import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/lib/store";
import { Package, AlertTriangle, Plus, Minus, CheckCircle2 } from "lucide-react";

export default function InventoryPage() {
  const { state, dispatch, formatPrice } = useStore();
  const [adjustId, setAdjustId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState("");

  const products = state.products;
  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const good = products.filter((p) => p.stock > 5);

  const applyAdjust = (id: string, delta: number) => {
    dispatch({ type: "ADJUST_STOCK", id, delta });
    setAdjustId(null);
    setAdjustQty("");
  };

  const stockBg = (stock: number) => {
    if (stock === 0) return "var(--danger-bg)";
    if (stock <= 5) return "var(--warning-bg)";
    return "var(--success-bg)";
  };

  const stockColor = (stock: number) => {
    if (stock === 0) return "var(--danger-text)";
    if (stock <= 5) return "var(--warning-text)";
    return "var(--success-text)";
  };

  return (
    <AdminLayout title="Inventaire" subtitle={`${products.length} produits — ${outOfStock.length} épuisés, ${lowStock.length} en stock faible`}>
      {/* Summary cards */}
      <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
        <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="stat-icon" style={{ background: "var(--danger-bg)" }}><Package size={18} color="var(--danger)" /></div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{outOfStock.length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>Épuisés</div>
          </div>
        </div>
        <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="stat-icon" style={{ background: "var(--warning-bg)" }}><AlertTriangle size={18} color="var(--warning)" /></div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{lowStock.length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>Stock faible (≤ 5)</div>
          </div>
        </div>
        <div className="card" style={{ padding: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="stat-icon" style={{ background: "var(--success-bg)" }}><CheckCircle2 size={18} color="var(--success)" /></div>
          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{good.length}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>En stock OK</div>
          </div>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produit</th><th>Référence</th><th>Catégorie</th><th>Prix</th>
              <th>Vendu</th><th>Stock actuel</th><th>Niveau</th><th>Ajuster</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 32, height: 32, background: stockBg(p.stock), borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={14} color={stockColor(p.stock)} />
                    </div>
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "0.775rem", color: "var(--muted)" }}>{p.reference}</td>
                <td style={{ color: "var(--muted)" }}>{p.category}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(p.price)}</td>
                <td style={{ textAlign: "center" }}>{p.sold}</td>
                <td>
                  <span style={{ fontWeight: 800, fontSize: "1.125rem", color: p.stock === 0 ? "var(--danger)" : p.stock <= 5 ? "var(--warning)" : "var(--success)" }}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <div style={{ background: "var(--bg2)", borderRadius: 99, height: 6, width: 100, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99, transition: "width 0.3s",
                      width: `${Math.min(100, (p.stock / 20) * 100)}%`,
                      background: p.stock === 0 ? "var(--danger)" : p.stock <= 5 ? "var(--warning)" : "var(--success)",
                    }} />
                  </div>
                </td>
                <td>
                  {adjustId === p.id ? (
                    <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                      <input
                        type="number" value={adjustQty}
                        onChange={(e) => setAdjustQty(e.target.value)}
                        style={{ width: 60, textAlign: "center" }}
                        placeholder="0"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") applyAdjust(p.id, parseInt(adjustQty) || 0); if (e.key === "Escape") setAdjustId(null); }}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => applyAdjust(p.id, parseInt(adjustQty) || 0)}>OK</button>
                      <button className="btn-icon" onClick={() => setAdjustId(null)} style={{ fontSize: "0.7rem" }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setAdjustId(p.id); setAdjustQty(""); }}>
                        Modifier
                      </button>
                      <button className="btn-icon" style={{ color: "var(--success)" }} onClick={() => dispatch({ type: "ADJUST_STOCK", id: p.id, delta: 1 })}><Plus size={12} /></button>
                      <button className="btn-icon" style={{ color: "var(--danger)" }} onClick={() => dispatch({ type: "ADJUST_STOCK", id: p.id, delta: -1 })} disabled={p.stock === 0}><Minus size={12} /></button>
                    </div>
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
