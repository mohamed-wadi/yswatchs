import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore, Order, OrderStatus, STATUS_LABELS, STATUS_NEXT } from "@/lib/store";
import {
  Search, Eye, Ban, Trash2, X, ChevronDown, Phone, MapPin, FileText,
  CheckCircle2, Truck, Package, Clock, XCircle, AlertTriangle,
} from "lucide-react";

const ALL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled", "refused"];

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending:   <Clock size={11} />,
  confirmed: <CheckCircle2 size={11} />,
  shipped:   <Truck size={11} />,
  delivered: <Package size={11} />,
  cancelled: <XCircle size={11} />,
  refused:   <Ban size={11} />,
};

function BlacklistModal({ order, onConfirm, onClose }: { order: Order; onConfirm: (reason: string) => void; onClose: () => void }) {
  const [reason, setReason] = useState("");
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--danger-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ban size={16} color="var(--danger)" />
            </div>
            <div>
              <h3>Ajouter à la blacklist</h3>
              <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{order.phone} — {order.customerName}</div>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Motif *</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
              placeholder="Ex: Livreur déplacé, client absent et injoignable" />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn btn-danger" disabled={!reason.trim()} onClick={() => onConfirm(reason)}>Blacklister</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  const { state, dispatch, isBlacklisted, formatPrice, formatDate } = useStore();
  const [note, setNote] = useState(order.adminNote);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const bl = isBlacklisted(order.phone);
  const current = state.orders.find((o) => o.id === order.id) ?? order;
  const nextStatus = STATUS_NEXT[current.status];

  const advance = () => { if (nextStatus) dispatch({ type: "UPDATE_ORDER_STATUS", id: order.id, status: nextStatus }); };
  const saveNote = () => dispatch({ type: "UPDATE_ORDER_NOTE", id: order.id, note });
  const handleBlacklist = (reason: string) => {
    dispatch({ type: "ADD_TO_BLACKLIST", phone: order.phone, name: order.customerName, reason });
    setShowBlacklist(false);
  };

  return (
    <>
      <div className="side-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{current.reference}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{formatDate(current.date)}</div>
          </div>
          <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
            <span className={`badge badge-${current.status}`}>{STATUS_ICONS[current.status]} {STATUS_LABELS[current.status]}</span>
            <button className="btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Blacklist alert */}
          {bl && (
            <div className="alert alert-danger">
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <div>
                <strong>Numéro blacklisté</strong>
                <div style={{ fontSize: "0.75rem", marginTop: "0.125rem" }}>Motif : {bl.reason}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          {(nextStatus || !bl) && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {nextStatus && (
                <button className="btn btn-primary btn-sm" onClick={advance} style={{ flex: 1 }}>
                  Passer en : {STATUS_LABELS[nextStatus]}
                </button>
              )}
              {!bl && (
                <button className="btn btn-danger btn-sm" onClick={() => setShowBlacklist(true)} style={{ flex: 1 }}>
                  <Ban size={12} /> Blacklister
                </button>
              )}
              {bl && (
                <button className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: "UPDATE_ORDER_STATUS", id: order.id, status: "confirmed" })}>
                  ✅ Accepter quand même
                </button>
              )}
            </div>
          )}

          {/* Client info */}
          <div className="card" style={{ padding: "1rem" }}>
            <div className="section-title">Informations client</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ fontWeight: 600 }}>{current.customerName}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted)", fontSize: "0.8rem" }}>
                <Phone size={12} /> {current.phone}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted)", fontSize: "0.8rem" }}>
                <MapPin size={12} /> {current.address}, {current.city}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="card" style={{ padding: "1rem" }}>
            <div className="section-title">Produits commandés</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {current.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 32, height: 32, background: "var(--bg2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={14} color="var(--muted)" />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Qté : {item.qty}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap" }}>{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
              <div className="divider" style={{ margin: "0.375rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Total</span>
                <span>{formatPrice(current.total)}</span>
              </div>
            </div>
          </div>

          {/* Status history */}
          <div className="card" style={{ padding: "1rem" }}>
            <div className="section-title">Historique des statuts</div>
            <div className="timeline">
              {current.statusHistory.map((ev, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" style={{ background: ev.status === "delivered" ? "var(--success)" : ev.status === "cancelled" || ev.status === "refused" ? "var(--danger)" : "var(--accent)" }} />
                  {i < current.statusHistory.length - 1 && <div className="timeline-line" />}
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.8rem" }}>{STATUS_LABELS[ev.status]}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                      {new Date(ev.at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {ev.note && <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.125rem", fontStyle: "italic" }}>{ev.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin note */}
          <div className="card" style={{ padding: "1rem" }}>
            <div className="section-title">Note admin</div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Remarques internes…" style={{ marginBottom: "0.5rem" }} />
            <button className="btn btn-secondary btn-sm" onClick={saveNote}><FileText size={12} /> Enregistrer</button>
          </div>
        </div>
      </div>
      {showBlacklist && <BlacklistModal order={order} onConfirm={handleBlacklist} onClose={() => setShowBlacklist(false)} />}
    </>
  );
}

export default function OrdersPage() {
  const { state, dispatch, isBlacklisted, formatPrice, formatDate } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [blacklistTarget, setBlacklistTarget] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const orders = state.orders;
  const cities = Array.from(new Set(orders.map((o) => o.city))).sort();

  const filtered = orders
    .filter((o) => {
      const q = search.toLowerCase();
      return (
        (!q || o.reference.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.phone.includes(q)) &&
        (statusFilter === "all" || o.status === statusFilter) &&
        (cityFilter === "all" || o.city === cityFilter)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const statusCounts = ALL_STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {} as Record<string, number>);

  const handleBlacklist = (order: Order, reason: string) => {
    dispatch({ type: "ADD_TO_BLACKLIST", phone: order.phone, name: order.customerName, reason });
    setBlacklistTarget(null);
  };

  const handleDelete = (id: string) => { dispatch({ type: "DELETE_ORDER", id }); setDeleting(null); if (selected?.id === id) setSelected(null); };

  const changeStatus = (order: Order, status: OrderStatus) => {
    dispatch({ type: "UPDATE_ORDER_STATUS", id: order.id, status });
    if (selected?.id === order.id) setSelected({ ...order, status });
  };

  return (
    <AdminLayout title="Commandes" subtitle={`${orders.length} commandes au total`}>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <button className={`filter-tab ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>
          Toutes ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button key={s} className={`filter-tab ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
            <span className={`dot dot-${s}`} style={{ marginRight: 4 }} />
            {STATUS_LABELS[s]} ({statusCounts[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Search + city filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} color="var(--muted)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Référence, client, téléphone…" />
        </div>
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} style={{ width: "auto", minWidth: 140 }}>
          <option value="all">Toutes les villes</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Référence</th><th>Client</th><th>Téléphone</th><th>Ville</th>
              <th>Produits</th><th>Total</th><th>Date</th><th>Statut</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>Aucune commande trouvée</td></tr>
            )}
            {filtered.map((order) => {
              const bl = isBlacklisted(order.phone);
              return (
                <tr key={order.id} className={`row-clickable ${bl ? "row-blacklist" : ""}`} onClick={() => setSelected(order)}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.775rem", whiteSpace: "nowrap" }}>
                    {bl && <span title={`Blacklisté: ${bl.reason}`} style={{ marginRight: 4 }}>🚫</span>}
                    {order.reference}
                  </td>
                  <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{order.customerName}</td>
                  <td style={{ color: "var(--muted)", whiteSpace: "nowrap", fontSize: "0.8rem" }}>{order.phone}</td>
                  <td style={{ color: "var(--muted)" }}>{order.city}</td>
                  <td style={{ color: "var(--muted)", fontSize: "0.775rem" }}>
                    {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ").slice(0, 40)}
                    {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ").length > 40 && "…"}
                  </td>
                  <td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{formatPrice(order.total)}</td>
                  <td style={{ color: "var(--muted)", fontSize: "0.775rem", whiteSpace: "nowrap" }}>{formatDate(order.date)}</td>
                  <td>
                    <span className={`badge badge-${order.status}`}>{STATUS_LABELS[order.status]}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button className="btn-icon" title="Voir" onClick={() => setSelected(order)}><Eye size={14} /></button>
                      {!bl && (
                        <button className="btn-icon" title="Blacklister" onClick={() => setBlacklistTarget(order)} style={{ color: "var(--danger)" }}><Ban size={14} /></button>
                      )}
                      {deleting === order.id ? (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order.id)}>Confirmer</button>
                      ) : (
                        <button className="btn-icon" title="Supprimer" onClick={() => setDeleting(order.id)} style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} />}
      {blacklistTarget && <BlacklistModal order={blacklistTarget} onConfirm={(r) => handleBlacklist(blacklistTarget, r)} onClose={() => setBlacklistTarget(null)} />}
    </AdminLayout>
  );
}
