import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/lib/store";
import { Search, Ban, Eye, Pencil, CheckCircle2, Phone, Trash2, X, AlertTriangle } from "lucide-react";

export default function BlacklistPage() {
  const { state, dispatch, formatDate } = useStore();
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editReason, setEditReason] = useState("");
  const [viewPhone, setViewPhone] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const list = state.blacklist.filter((b) => {
    const q = search.toLowerCase();
    return !q || b.phone.includes(q) || b.name.toLowerCase().includes(q) || b.reason.toLowerCase().includes(q);
  });

  const phoneOrders = viewPhone ? state.orders.filter((o) => o.phone === viewPhone) : [];
  const viewEntry = viewPhone ? state.blacklist.find((b) => b.phone === viewPhone) : null;

  return (
    <AdminLayout title="Blacklist" subtitle={`${state.blacklist.length} numéro${state.blacklist.length !== 1 ? "s" : ""} blacklisté${state.blacklist.length !== 1 ? "s" : ""}`}>
      {/* Header */}
      <div className="page-header">
        <div />
        {state.blacklist.length === 0 && (
          <div className="alert alert-success" style={{ display: "inline-flex" }}>
            <CheckCircle2 size={14} /> Aucun numéro blacklisté pour l'instant
          </div>
        )}
      </div>

      {/* Info banner */}
      {state.blacklist.length > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: "1rem" }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Les commandes provenant de ces numéros seront signalées automatiquement dans la liste des commandes.</span>
        </div>
      )}

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: "1rem", maxWidth: 400 }}>
        <Search size={14} color="var(--muted)" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par numéro, nom ou motif…" />
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Numéro</th><th>Nom</th><th>Nb commandes</th><th>Motif</th><th>Ajouté le</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>
                {search ? "Aucun résultat pour cette recherche" : "La blacklist est vide"}
              </td></tr>
            )}
            {list.map((entry) => (
              <tr key={entry.id} className="row-blacklist">
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <Ban size={13} color="var(--danger)" />
                    <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{entry.phone}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{entry.name}</td>
                <td>
                  <span className="badge badge-accent">{entry.ordersCount} commande{entry.ordersCount !== 1 ? "s" : ""}</span>
                </td>
                <td style={{ maxWidth: 280 }}>
                  {editId === entry.id ? (
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <input value={editReason} onChange={(e) => setEditReason(e.target.value)} style={{ flex: 1 }} />
                      <button className="btn btn-primary btn-sm" onClick={() => {
                        dispatch({ type: "UPDATE_BLACKLIST_REASON", id: entry.id, reason: editReason });
                        setEditId(null);
                      }}>OK</button>
                      <button className="btn-icon" onClick={() => setEditId(null)}><X size={13} /></button>
                    </div>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{entry.reason}</span>
                  )}
                </td>
                <td style={{ color: "var(--muted)", fontSize: "0.775rem", whiteSpace: "nowrap" }}>{formatDate(entry.addedAt)}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button className="btn-icon" title="Voir commandes" onClick={() => setViewPhone(entry.phone)}><Eye size={14} /></button>
                    <button className="btn-icon" title="Modifier motif" onClick={() => { setEditId(entry.id); setEditReason(entry.reason); }}><Pencil size={14} /></button>
                    {confirmRemove === entry.id ? (
                      <button className="btn btn-primary btn-sm" onClick={() => { dispatch({ type: "REMOVE_FROM_BLACKLIST", id: entry.id }); setConfirmRemove(null); }}>
                        ✅ Retirer
                      </button>
                    ) : (
                      <button className="btn-icon" title="Retirer de la blacklist" style={{ color: "var(--success)" }} onClick={() => setConfirmRemove(entry.id)}>
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order history modal */}
      {viewPhone && viewEntry && (
        <div className="overlay" onClick={() => setViewPhone(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>{viewEntry.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted)", fontSize: "0.8rem", marginTop: "0.125rem" }}>
                  <Phone size={12} /> {viewPhone}
                </div>
              </div>
              <button className="btn-icon" onClick={() => setViewPhone(null)}><X size={16} /></button>
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <div className="section-title">Motif</div>
              <div className="alert alert-danger" style={{ marginBottom: "1rem" }}>
                <Ban size={14} style={{ flexShrink: 0 }} /> {viewEntry.reason}
              </div>
              <div className="section-title">Historique des commandes ({phoneOrders.length})</div>
              {phoneOrders.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Aucune commande enregistrée.</p>
              ) : (
                <div className="table-wrap" style={{ borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                  <table>
                    <thead><tr><th>Référence</th><th>Produits</th><th>Total</th><th>Statut</th></tr></thead>
                    <tbody>
                      {phoneOrders.map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontFamily: "monospace", fontSize: "0.775rem" }}>{o.reference}</td>
                          <td style={{ fontSize: "0.775rem", color: "var(--muted)" }}>{o.items.map((i) => i.name).join(", ")}</td>
                          <td style={{ fontWeight: 600 }}>{o.total.toLocaleString("fr-MA")} MAD</td>
                          <td><span className={`badge badge-${o.status}`}>{o.status === "pending" ? "En attente" : o.status === "delivered" ? "Livrée" : o.status === "cancelled" ? "Annulée" : o.status === "refused" ? "Refusée" : o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
