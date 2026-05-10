import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { orders as initialOrders, formatPrice, formatDate, Order, OrderStatus } from "@/lib/data";
import { Search, Filter, Eye, Truck, CheckCircle2, X } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.reference.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
  };

  return (
    <AdminLayout title="Commandes" subtitle={`${orders.length} commandes au total`}>
      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--ys-surface)",
            border: "1px solid var(--ys-border)",
            padding: "0.5rem 0.75rem",
            flex: 1,
            maxWidth: 320,
          }}
        >
          <Search size={14} style={{ color: "var(--ys-text-dim)" }} />
          <input
            placeholder="Référence, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: "var(--ys-text)", fontSize: "0.875rem", padding: 0 }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "1px solid",
                borderColor: statusFilter === s ? "var(--ys-gold)" : "var(--ys-border)",
                background: statusFilter === s ? "var(--ys-gold-dim)" : "transparent",
                color: statusFilter === s ? "var(--ys-gold)" : "var(--ys-text-muted)",
                transition: "all 0.15s",
              }}
            >
              {s === "all" ? "Toutes" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: "1rem" }}>
        {/* Table */}
        <div className="ys-card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paiement</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setSelected(o)}>
                  <td>
                    <span style={{ fontFamily: "var(--font-serif)", color: "var(--ys-gold)", fontSize: "0.875rem" }}>
                      {o.reference}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.875rem" }}>{o.customerName}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)" }}>{o.city}, {o.country}</div>
                  </td>
                  <td style={{ color: "var(--ys-text-muted)", fontSize: "0.8rem" }}>{formatDate(o.date)}</td>
                  <td>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}>{formatPrice(o.total)}</span>
                  </td>
                  <td style={{ color: "var(--ys-text-muted)", fontSize: "0.8rem" }}>{o.paymentMethod}</td>
                  <td>
                    <span className={`status-badge status-${o.status}`}>{STATUS_LABELS[o.status]}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.375rem" }} onClick={(e) => e.stopPropagation()}>
                      {o.status === "pending" && (
                        <button
                          title="Confirmer"
                          onClick={() => updateStatus(o.id, "confirmed")}
                          style={{ background: "transparent", border: "none", color: "var(--ys-info)", cursor: "pointer", padding: 4 }}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                      {o.status === "confirmed" && (
                        <button
                          title="Expédier"
                          onClick={() => updateStatus(o.id, "shipped")}
                          style={{ background: "transparent", border: "none", color: "var(--ys-success)", cursor: "pointer", padding: 4 }}
                        >
                          <Truck size={15} />
                        </button>
                      )}
                      {o.status === "shipped" && (
                        <button
                          title="Marquer livrée"
                          onClick={() => updateStatus(o.id, "delivered")}
                          style={{ background: "transparent", border: "none", color: "var(--ys-success)", cursor: "pointer", padding: 4 }}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                      )}
                      <button
                        title="Voir détails"
                        onClick={() => setSelected(o)}
                        style={{ background: "transparent", border: "none", color: "var(--ys-text-muted)", cursor: "pointer", padding: 4 }}
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--ys-text-muted)", padding: "2rem" }}>
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="ys-card animate-in" style={{ alignSelf: "flex-start", position: "sticky", top: 76 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "var(--ys-gold)" }}>
                {selected.reference}
              </span>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "transparent", border: "none", color: "var(--ys-text-muted)", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <Section title="Client">
                <Row label="Nom" value={selected.customerName} />
                <Row label="Email" value={selected.customerEmail} />
                <Row label="Ville" value={`${selected.city}, ${selected.country}`} />
              </Section>

              <Section title="Commande">
                <Row label="Date" value={formatDate(selected.date)} />
                <Row label="Paiement" value={selected.paymentMethod} />
                <Row
                  label="Statut"
                  value={
                    <span className={`status-badge status-${selected.status}`}>
                      {STATUS_LABELS[selected.status]}
                    </span>
                  }
                />
              </Section>

              <Section title="Produits">
                {selected.products.map((p) => (
                  <div
                    key={p.productId}
                    style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.375rem 0", borderBottom: "1px solid var(--ys-border)" }}
                  >
                    <span style={{ color: "var(--ys-text-muted)", flex: 1, paddingRight: "0.5rem" }}>
                      {p.name} × {p.qty}
                    </span>
                    <span style={{ color: "var(--ys-gold)", fontFamily: "var(--font-serif)", flexShrink: 0 }}>
                      {formatPrice(p.price * p.qty)}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ys-text-muted)" }}>
                    Total
                  </span>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--ys-gold)" }}>
                    {formatPrice(selected.total)}
                  </span>
                </div>
              </Section>

              {selected.notes && (
                <Section title="Notes">
                  <p style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)", fontStyle: "italic" }}>
                    {selected.notes}
                  </p>
                </Section>
              )}

              {/* Actions */}
              {selected.status !== "delivered" && selected.status !== "cancelled" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {selected.status === "pending" && (
                    <button className="ys-btn ys-btn-primary" style={{ justifyContent: "center", width: "100%" }} onClick={() => updateStatus(selected.id, "confirmed")}>
                      Confirmer la commande
                    </button>
                  )}
                  {selected.status === "confirmed" && (
                    <button className="ys-btn ys-btn-primary" style={{ justifyContent: "center", width: "100%" }} onClick={() => updateStatus(selected.id, "shipped")}>
                      Marquer expédiée
                    </button>
                  )}
                  {selected.status === "shipped" && (
                    <button className="ys-btn ys-btn-primary" style={{ justifyContent: "center", width: "100%" }} onClick={() => updateStatus(selected.id, "delivered")}>
                      Marquer livrée
                    </button>
                  )}
                  <button className="ys-btn ys-btn-danger" style={{ justifyContent: "center", width: "100%" }} onClick={() => updateStatus(selected.id, "cancelled")}>
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ys-text-dim)", marginBottom: "0.5rem" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
      <span style={{ color: "var(--ys-text-muted)" }}>{label}</span>
      <span style={{ color: "var(--ys-text)" }}>{value}</span>
    </div>
  );
}
