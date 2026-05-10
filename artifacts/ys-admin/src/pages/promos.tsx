import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Plus, Trash2, Tag, Percent, X, Copy } from "lucide-react";

interface Promo {
  id: string; code: string; type: "percent" | "fixed";
  value: number; minOrder?: number; expiresAt?: string;
  active: boolean; used: number;
}

const INITIAL: Promo[] = [
  { id: "pr1", code: "BIENVENUE10", type: "percent", value: 10, minOrder: 10000, expiresAt: "2025-12-31", active: true, used: 34 },
  { id: "pr2", code: "VIP500",      type: "fixed",   value: 500, minOrder: 20000, active: true, used: 12 },
  { id: "pr3", code: "SOLDES15",    type: "percent", value: 15, expiresAt: "2025-06-30", active: false, used: 8 },
];

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Promo, "id" | "used">>({
    code: "", type: "percent", value: 0, active: true,
  });

  const toggle = (id: string) => setPromos((p) => p.map((pr) => pr.id === id ? { ...pr, active: !pr.active } : pr));
  const remove = (id: string) => setPromos((p) => p.filter((pr) => pr.id !== id));
  const copyCode = (code: string) => { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 1500); };

  const create = () => {
    if (!form.code.trim() || !form.value) return;
    setPromos((p) => [...p, { ...form, id: `pr${Date.now()}`, code: form.code.toUpperCase(), used: 0 }]);
    setShowForm(false);
    setForm({ code: "", type: "percent", value: 0, active: true });
  };

  return (
    <AdminLayout title="Promotions" subtitle={`${promos.filter((p) => p.active).length} codes actifs`}>
      <div className="page-header">
        <div />
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={14} /> Nouveau code promo
        </button>
      </div>

      <div className="grid-2">
        {promos.map((pr) => (
          <div key={pr.id} className="card" style={{ padding: "1.25rem", opacity: pr.active ? 1 : 0.6 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: pr.active ? "var(--accent-light)" : "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {pr.type === "percent" ? <Percent size={16} color={pr.active ? "var(--accent)" : "var(--muted)"} /> : <Tag size={16} color={pr.active ? "var(--accent)" : "var(--muted)"} />}
                </div>
                <div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.05em" }}>{pr.code}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    {pr.type === "percent" ? `−${pr.value}%` : `−${pr.value} MAD`}
                    {pr.minOrder && ` · min ${pr.minOrder.toLocaleString("fr-MA")} MAD`}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button className="btn-icon" title="Copier" onClick={() => copyCode(pr.code)}>
                  {copied === pr.code ? <span style={{ fontSize: "0.7rem", color: "var(--success)" }}>✓</span> : <Copy size={13} />}
                </button>
                <button className="btn-icon" style={{ color: "var(--danger)" }} onClick={() => remove(pr.id)}><Trash2 size={13} /></button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                <span>{pr.used} utilisations</span>
                {pr.expiresAt && <span>Expire {new Date(pr.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>}
              </div>
              <button className={`toggle ${pr.active ? "on" : ""}`} onClick={() => toggle(pr.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h3>Nouveau code promo</h3>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16} /></button>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Code *</label>
                <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="PROMO20" style={{ fontFamily: "monospace", letterSpacing: "0.05em" }} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percent" | "fixed" }))}>
                    <option value="percent">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (MAD)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Valeur *</label>
                  <input type="number" value={form.value || ""} min={1} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} placeholder={form.type === "percent" ? "10" : "500"} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Commande minimum (MAD)</label>
                  <input type="number" value={form.minOrder || ""} min={0} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value ? Number(e.target.value) : undefined }))} placeholder="Optionnel" />
                </div>
                <div className="form-group">
                  <label className="form-label">Date d'expiration</label>
                  <input type="date" value={form.expiresAt || ""} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value || undefined }))} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                <button className="btn btn-primary" disabled={!form.code.trim() || !form.value} onClick={create}>
                  <Plus size={14} /> Créer le code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
