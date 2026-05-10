import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore, Customer } from "@/lib/store";
import { Search, Ban, Eye, FileText, X, Phone, MapPin, ShoppingBag, Crown, CheckCircle2 } from "lucide-react";

function CustomerDetail({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const { state, dispatch, isBlacklisted, formatPrice, formatDate } = useStore();
  const [note, setNote] = useState(customer.note);
  const [showBl, setShowBl] = useState(false);
  const [blReason, setBlReason] = useState("");
  const bl = isBlacklisted(customer.phone);
  const orders = state.orders.filter((o) => o.phone === customer.phone);

  const saveNote = () => dispatch({ type: "UPDATE_CUSTOMER_NOTE", id: customer.id, note });
  const handleBlacklist = () => {
    if (!blReason.trim()) return;
    dispatch({ type: "ADD_TO_BLACKLIST", phone: customer.phone, name: customer.name, reason: blReason });
    setShowBl(false);
  };
  const handleRemoveBl = () => { if (bl) dispatch({ type: "REMOVE_FROM_BLACKLIST", id: bl.id }); };

  return (
    <div className="side-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: bl ? "var(--danger-bg)" : "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", color: bl ? "var(--danger)" : "var(--accent-text)" }}>
            {customer.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{customer.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Client depuis {formatDate(customer.joinDate)}</div>
          </div>
        </div>
        <button className="btn-icon" onClick={onClose}><X size={16} /></button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {bl && (
          <div className="alert alert-danger">
            <Ban size={14} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong>Numéro blacklisté</strong>
              <div style={{ fontSize: "0.75rem", marginTop: "0.125rem" }}>{bl.reason}</div>
            </div>
            <button className="btn btn-sm" style={{ background: "var(--success-bg)", color: "var(--success-text)", border: "1px solid rgba(16,185,129,0.2)" }} onClick={handleRemoveBl}>
              Retirer
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {!bl ? (
            <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => setShowBl(!showBl)}>
              <Ban size={12} /> Blacklister
            </button>
          ) : (
            <span className="badge badge-blacklisted" style={{ flex: 1, justifyContent: "center", padding: "0.4rem" }}>
              <Ban size={11} /> Blacklisté
            </span>
          )}
        </div>

        {showBl && !bl && (
          <div className="card" style={{ padding: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Motif de blacklist *</label>
              <textarea value={blReason} onChange={(e) => setBlReason(e.target.value)} rows={2} placeholder="Ex: Livreur déplacé, client absent…" />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button className="btn btn-danger btn-sm" disabled={!blReason.trim()} onClick={handleBlacklist}>Confirmer</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowBl(false)}>Annuler</button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="card" style={{ padding: "1rem" }}>
          <div className="section-title">Informations</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8125rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Phone size={13} color="var(--muted)" style={{ flexShrink: 0 }} />
              <span>{customer.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MapPin size={13} color="var(--muted)" style={{ flexShrink: 0 }} />
              <span>{customer.city}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShoppingBag size={13} color="var(--muted)" style={{ flexShrink: 0 }} />
              <span>{customer.totalOrders} commandes — {formatPrice(customer.totalSpent)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Eye size={13} color="var(--muted)" style={{ flexShrink: 0 }} />
              <span>Dernière commande : {formatDate(customer.lastOrder)}</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="card" style={{ padding: "1rem" }}>
          <div className="section-title">Commandes ({orders.length})</div>
          {orders.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Aucune commande enregistrée.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {orders.map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.625rem", background: "var(--bg2)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.775rem" }}>{o.reference}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.7rem" }}>{formatDate(o.date)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 700 }}>{formatPrice(o.total)}</span>
                    <span className={`badge badge-${o.status}`}>{o.status === "delivered" ? "Livrée" : o.status === "pending" ? "En attente" : o.status === "cancelled" ? "Annulée" : o.status === "refused" ? "Refusée" : o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note */}
        <div className="card" style={{ padding: "1rem" }}>
          <div className="section-title">Note admin</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Remarques sur ce client…" style={{ marginBottom: "0.5rem" }} />
          <button className="btn btn-secondary btn-sm" onClick={saveNote}><FileText size={12} /> Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { state, isBlacklisted, formatPrice, formatDate } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "blacklisted" | "vip">("all");
  const [selected, setSelected] = useState<Customer | null>(null);

  const customers = state.customers;

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const bl = isBlacklisted(c.phone);
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "blacklisted" && bl) || (filter === "vip" && c.totalSpent >= 50000);
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Clients" subtitle={`${customers.length} clients enregistrés`}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} color="var(--muted)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, téléphone, ville…" />
        </div>
        <button className={`filter-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Tous ({customers.length})</button>
        <button className={`filter-tab ${filter === "vip" ? "active" : ""}`} onClick={() => setFilter("vip")}>
          <Crown size={11} style={{ marginRight: 4 }} />VIP
        </button>
        <button className={`filter-tab ${filter === "blacklisted" ? "active" : ""}`} onClick={() => setFilter("blacklisted")}>
          <Ban size={11} style={{ marginRight: 4, color: filter === "blacklisted" ? undefined : "var(--danger)" }} />
          Blacklistés ({state.blacklist.length})
        </button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client</th><th>Téléphone</th><th>Ville</th>
              <th>Commandes</th><th>Total dépensé</th><th>Statut</th>
              <th>Dernière cmd</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>Aucun client trouvé</td></tr>
            )}
            {filtered.map((c) => {
              const bl = isBlacklisted(c.phone);
              const isVip = c.totalSpent >= 50000;
              return (
                <tr key={c.id} className={`row-clickable ${bl ? "row-blacklist" : ""}`} onClick={() => setSelected(c)}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: bl ? "var(--danger-bg)" : isVip ? "#EDE9FE" : "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: bl ? "var(--danger)" : isVip ? "#5B21B6" : "var(--accent-text)", flexShrink: 0 }}>
                        {c.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", color: "var(--muted)", fontSize: "0.8rem" }}>{c.phone}</td>
                  <td style={{ color: "var(--muted)" }}>{c.city}</td>
                  <td style={{ textAlign: "center" }}>{c.totalOrders}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(c.totalSpent)}</td>
                  <td>
                    {bl ? (
                      <span className="badge badge-blacklisted"><Ban size={10} /> Blacklisté</span>
                    ) : isVip ? (
                      <span className="badge badge-vip"><Crown size={10} /> VIP</span>
                    ) : (
                      <span className="badge badge-normal"><CheckCircle2 size={10} /> Normal</span>
                    )}
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: "0.775rem" }}>{formatDate(c.lastOrder)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn-icon" onClick={() => setSelected(c)}><Eye size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && <CustomerDetail customer={selected} onClose={() => setSelected(null)} />}
    </AdminLayout>
  );
}
