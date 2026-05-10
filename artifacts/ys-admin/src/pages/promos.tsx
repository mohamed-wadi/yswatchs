import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Plus, Trash2, Tag, Calendar, Percent } from "lucide-react";
import { formatDate } from "@/lib/data";

interface Promo {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder?: number;
  uses: number;
  maxUses: number;
  active: boolean;
  startDate: string;
  endDate: string;
  description: string;
}

const initialPromos: Promo[] = [
  { id: "p1", code: "YSVIP20", type: "percent", value: 20, minOrder: 15000, uses: 14, maxUses: 50, active: true, startDate: "2025-04-01", endDate: "2025-06-30", description: "Remise VIP 20%" },
  { id: "p2", code: "BIENVENUE", type: "percent", value: 10, uses: 31, maxUses: 100, active: true, startDate: "2025-01-01", endDate: "2025-12-31", description: "Code de bienvenue" },
  { id: "p3", code: "ETE2025", type: "fixed", value: 2000, minOrder: 20000, uses: 5, maxUses: 30, active: false, startDate: "2025-06-01", endDate: "2025-08-31", description: "Promo estivale" },
  { id: "p4", code: "RAMADAN", type: "percent", value: 15, uses: 28, maxUses: 28, active: false, startDate: "2025-02-28", endDate: "2025-03-30", description: "Offre Ramadan (expirée)" },
];

export default function PromosPage() {
  const [promos, setPromos] = useState(initialPromos);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Promo>>({ type: "percent", active: true, maxUses: 50, uses: 0 });

  const toggle = (id: string) => {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const remove = (id: string) => {
    if (confirm("Supprimer ce code promo ?")) setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  const save = () => {
    if (!form.code || !form.value || !form.startDate || !form.endDate) return;
    const newPromo: Promo = {
      id: `p${Date.now()}`,
      code: form.code!.toUpperCase(),
      type: form.type || "percent",
      value: Number(form.value),
      minOrder: form.minOrder ? Number(form.minOrder) : undefined,
      uses: 0,
      maxUses: Number(form.maxUses) || 50,
      active: true,
      startDate: form.startDate!,
      endDate: form.endDate!,
      description: form.description || "",
    };
    setPromos((prev) => [newPromo, ...prev]);
    setShowForm(false);
    setForm({ type: "percent", active: true, maxUses: 50, uses: 0 });
  };

  return (
    <AdminLayout title="Promotions" subtitle="Codes promo et remises">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
        <button className="ys-btn ys-btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={14} /> Créer un code promo
        </button>
      </div>

      {showForm && (
        <div className="ys-card animate-in" style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", marginBottom: "1.25rem" }}>
            Nouveau code promotionnel
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem", marginBottom: "0.875rem" }}>
            <Field label="Code *">
              <input
                style={{ width: "100%", textTransform: "uppercase" }}
                value={form.code || ""}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="EXAMPLE20"
              />
            </Field>
            <Field label="Type de remise">
              <select style={{ width: "100%" }} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percent" | "fixed" }))}>
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (MAD)</option>
              </select>
            </Field>
            <Field label={form.type === "percent" ? "Valeur (%) *" : "Valeur (MAD) *"}>
              <input type="number" style={{ width: "100%" }} value={form.value || ""} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} />
            </Field>
            <Field label="Commande min. (MAD)">
              <input type="number" style={{ width: "100%" }} value={form.minOrder || ""} onChange={(e) => setForm((f) => ({ ...f, minOrder: Number(e.target.value) || undefined }))} placeholder="Aucun minimum" />
            </Field>
            <Field label="Utilisations max.">
              <input type="number" style={{ width: "100%" }} value={form.maxUses || ""} onChange={(e) => setForm((f) => ({ ...f, maxUses: Number(e.target.value) }))} />
            </Field>
            <Field label="Description">
              <input style={{ width: "100%" }} value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description courte" />
            </Field>
            <Field label="Date de début *">
              <input type="date" style={{ width: "100%" }} value={form.startDate || ""} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
            </Field>
            <Field label="Date de fin *">
              <input type="date" style={{ width: "100%" }} value={form.endDate || ""} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
            </Field>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="ys-btn ys-btn-primary" onClick={save}>Créer le code</button>
            <button className="ys-btn ys-btn-ghost" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        {promos.map((p) => (
          <div
            key={p.id}
            className="ys-card"
            style={{
              borderColor: p.active ? "var(--ys-border)" : "rgba(201,168,76,0.07)",
              opacity: p.active ? 1 : 0.6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <Tag size={14} style={{ color: "var(--ys-gold)" }} />
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--ys-gold)", letterSpacing: "0.08em" }}>
                    {p.code}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--ys-text-muted)" }}>{p.description}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <button
                  onClick={() => toggle(p.id)}
                  style={{
                    padding: "0.25rem 0.625rem",
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: p.active ? "rgba(76,175,124,0.4)" : "var(--ys-border)",
                    background: p.active ? "rgba(76,175,124,0.1)" : "transparent",
                    color: p.active ? "var(--ys-success)" : "var(--ys-text-muted)",
                    transition: "all 0.15s",
                  }}
                >
                  {p.active ? "Actif" : "Inactif"}
                </button>
                <button
                  onClick={() => remove(p.id)}
                  style={{ background: "transparent", border: "none", color: "var(--ys-danger)", cursor: "pointer", padding: 4 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <div style={{ background: "var(--ys-surface-2)", padding: "0.5rem 0.625rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.65rem", color: "var(--ys-text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                  <Percent size={9} /> Remise
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--ys-gold)" }}>
                  {p.type === "percent" ? `${p.value}%` : `${p.value} MAD`}
                </div>
              </div>
              <div style={{ background: "var(--ys-surface-2)", padding: "0.5rem 0.625rem" }}>
                <div style={{ fontSize: "0.65rem", color: "var(--ys-text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                  Utilisations
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>
                  {p.uses}<span style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)" }}>/{p.maxUses}</span>
                </div>
              </div>
              <div style={{ background: "var(--ys-surface-2)", padding: "0.5rem 0.625rem" }}>
                <div style={{ fontSize: "0.65rem", color: "var(--ys-text-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                  Remplissage
                </div>
                <div style={{ height: 6, background: "var(--ys-bg)", marginTop: 8, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(p.uses / p.maxUses) * 100}%`, background: p.uses >= p.maxUses ? "var(--ys-danger)" : "var(--ys-gold)", borderRadius: 3 }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.7rem", color: "var(--ys-text-dim)" }}>
              <Calendar size={11} />
              {formatDate(p.startDate)} → {formatDate(p.endDate)}
              {p.minOrder && <span style={{ marginLeft: "0.5rem" }}>· Min. {p.minOrder.toLocaleString()} MAD</span>}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ys-text-muted)", marginBottom: "0.3rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
