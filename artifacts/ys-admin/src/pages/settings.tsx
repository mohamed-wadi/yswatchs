import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/lib/store";
import { Store, MapPin, Shield, Plus, Trash2, Save, AlertTriangle } from "lucide-react";

const TABS = [
  { id: "store",    label: "Boutique",  icon: Store },
  { id: "shipping", label: "Livraison", icon: MapPin },
  { id: "security", label: "Sécurité",  icon: Shield },
];

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState("store");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ ...state.settings });
  const [newCity, setNewCity] = useState("");
  const [newFee, setNewFee] = useState("");

  const save = () => {
    dispatch({ type: "UPDATE_SETTINGS", settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addCity = () => {
    if (!newCity.trim() || !newFee) return;
    const cities = [...settings.cities, { city: newCity.trim(), fee: Number(newFee) }];
    setSettings((s) => ({ ...s, cities }));
    setNewCity(""); setNewFee("");
  };

  const removeCity = (i: number) => {
    const cities = settings.cities.filter((_, idx) => idx !== i);
    setSettings((s) => ({ ...s, cities }));
  };

  const updateCityFee = (i: number, fee: number) => {
    const cities = settings.cities.map((c, idx) => idx === i ? { ...c, fee } : c);
    setSettings((s) => ({ ...s, cities }));
  };

  return (
    <AdminLayout title="Paramètres" subtitle="Configuration de la boutique">
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Tabs */}
        <div className="card" style={{ padding: "0.5rem" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: "0.625rem",
              width: "100%", padding: "0.625rem 0.75rem",
              borderRadius: "var(--radius-sm)", border: "none",
              background: tab === t.id ? "var(--accent-light)" : "transparent",
              color: tab === t.id ? "var(--accent-text)" : "var(--muted)",
              fontWeight: tab === t.id ? 600 : 400,
              fontSize: "0.8125rem", cursor: "pointer",
              textAlign: "left", transition: "all 0.15s",
            }}>
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: "1.5rem" }}>
          {saved && (
            <div className="alert alert-success" style={{ marginBottom: "1.25rem" }}>
              ✅ Paramètres enregistrés avec succès
            </div>
          )}

          {tab === "store" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ marginBottom: "-0.25rem" }}>Informations boutique</h3>

              <div className="form-group">
                <label className="form-label">Nom de la boutique</label>
                <input value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))} placeholder="YsWatchs" />
              </div>

              <div className="form-group">
                <label className="form-label">Numéro WhatsApp</label>
                <input value={settings.whatsapp} onChange={(e) => setSettings((s) => ({ ...s, whatsapp: e.target.value }))} placeholder="+212600000000" />
                <span className="form-hint">Utilisé pour les notifications et le contact client</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "var(--bg2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Mode maintenance</div>
                  <div style={{ fontSize: "0.775rem", color: "var(--muted)", marginTop: "0.125rem" }}>Masque le site aux visiteurs pendant une mise à jour</div>
                </div>
                <button className={`toggle ${settings.maintenanceMode ? "on" : ""}`} onClick={() => setSettings((s) => ({ ...s, maintenanceMode: !s.maintenanceMode }))} />
              </div>

              {settings.maintenanceMode && (
                <div className="alert alert-warning">
                  <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                  <span>Le site est actuellement en mode maintenance — les visiteurs voient une page d'attente.</span>
                </div>
              )}

              <div>
                <label className="form-label" style={{ display: "block", marginBottom: "0.375rem" }}>Logo boutique</label>
                <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-sm)", padding: "1.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.8rem", cursor: "pointer" }}>
                  <Store size={20} style={{ marginBottom: "0.375rem", opacity: 0.4 }} />
                  <div>Cliquez pour uploader un logo</div>
                  <div style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}>PNG, SVG — max 2 Mo</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={save}><Save size={14} /> Enregistrer</button>
              </div>
            </div>
          )}

          {tab === "shipping" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ marginBottom: "-0.25rem" }}>Villes de livraison & frais</h3>

              <div className="card table-wrap" style={{ boxShadow: "none" }}>
                <table>
                  <thead><tr><th>Ville</th><th>Frais (MAD)</th><th>Action</th></tr></thead>
                  <tbody>
                    {settings.cities.map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{c.city}</td>
                        <td>
                          <input
                            type="number"
                            value={c.fee}
                            onChange={(e) => updateCityFee(i, Number(e.target.value))}
                            style={{ width: 100 }}
                          />
                        </td>
                        <td>
                          <button className="btn-icon" style={{ color: "var(--danger)" }} onClick={() => removeCity(i)}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add city */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Nouvelle ville</label>
                  <input value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Ex : Dakhla" onKeyDown={(e) => e.key === "Enter" && addCity()} />
                </div>
                <div className="form-group" style={{ width: 120 }}>
                  <label className="form-label">Frais (MAD)</label>
                  <input type="number" value={newFee} onChange={(e) => setNewFee(e.target.value)} placeholder="40" min={0} onKeyDown={(e) => e.key === "Enter" && addCity()} />
                </div>
                <button className="btn btn-secondary" onClick={addCity} disabled={!newCity.trim() || !newFee}>
                  <Plus size={14} /> Ajouter
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={save}><Save size={14} /> Enregistrer</button>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h3 style={{ marginBottom: "-0.25rem" }}>Sécurité & comptes admin</h3>

              <div style={{ padding: "1rem", background: "var(--success-bg)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", gap: "0.5rem" }}>
                <Shield size={14} color="var(--success)" style={{ marginTop: 1, flexShrink: 0 }} />
                <div style={{ fontSize: "0.8125rem", color: "var(--success-text)" }}>
                  <strong>2FA activée</strong> — Chaque connexion nécessite un code TOTP depuis votre application d'authentification.
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••••••" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••••••" />
                  <span className="form-hint">Minimum 12 caractères, majuscule, chiffre et symbole</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmer</label>
                  <input type="password" placeholder="••••••••••••" />
                </div>
              </div>

              <div className="divider" />

              <h3>Comptes admin</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { name: "Youssef Slimani", email: "admin@yswatchs.com", role: "Super Admin" },
                  { name: "Sophie Martin", email: "editor@yswatchs.com", role: "Éditeur" },
                ].map((a) => (
                  <div key={a.email} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "var(--bg2)", borderRadius: "var(--radius-sm)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", color: "var(--accent-text)" }}>
                        {a.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: "0.8rem" }}>{a.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{a.email}</div>
                      </div>
                    </div>
                    <span className="badge badge-accent">{a.role}</span>
                  </div>
                ))}
              </div>

              <button className="btn btn-secondary" style={{ alignSelf: "flex-start" }}>
                <Plus size={14} /> Ajouter un admin
              </button>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={save}><Save size={14} /> Enregistrer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
