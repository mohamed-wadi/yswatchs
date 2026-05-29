import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Store, MapPin, Shield, Plus, Trash2, Save, AlertTriangle, CheckCircle2, Lock, Smartphone, Eye, EyeOff, X } from "lucide-react";
import { generateSecret, getOtpAuthUri, verifyTOTP } from "@/lib/totp";

const TABS = [
  { id: "store",    label: "Boutique",  icon: Store },
  { id: "shipping", label: "Livraison", icon: MapPin },
  { id: "security", label: "Sécurité",  icon: Shield },
];

type TwoFAStep = "idle" | "enable-password" | "enable-qr" | "disable-password";

export default function SettingsPage() {
  const { state, dispatch } = useStore();
  const { twoFAEnabled, beginEnable2FA, confirmEnable2FA, disable2FA } = useAuth();

  const [tab, setTab] = useState("store");
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ ...state.settings });
  const [newCity, setNewCity] = useState("");
  const [newFee, setNewFee] = useState("");

  // 2FA state
  const [tfaStep, setTfaStep] = useState<TwoFAStep>("idle");
  const [tfaPassword, setTfaPassword] = useState("");
  const [showTfaPassword, setShowTfaPassword] = useState(false);
  const [tfaSecret, setTfaSecret] = useState("");
  const [tfaUri, setTfaUri] = useState("");
  const [tfaCode, setTfaCode] = useState("");
  const [tfaLoading, setTfaLoading] = useState(false);
  const [tfaError, setTfaError] = useState("");
  const [tfaSuccess, setTfaSuccess] = useState("");

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
    setSettings((s) => ({ ...s, cities: s.cities.filter((_, idx) => idx !== i) }));
  };

  const updateCityFee = (i: number, fee: number) => {
    setSettings((s) => ({ ...s, cities: s.cities.map((c, idx) => idx === i ? { ...c, fee } : c) }));
  };

  // ─── 2FA handlers ───
  const resetTfa = () => {
    setTfaStep("idle"); setTfaPassword(""); setTfaSecret(""); setTfaUri("");
    setTfaCode(""); setTfaError(""); setShowTfaPassword(false);
  };

  const handleEnablePassword = async () => {
    if (!tfaPassword) return;
    setTfaLoading(true); setTfaError("");
    const res = await beginEnable2FA(tfaPassword);
    setTfaLoading(false);
    if (!res.success) { setTfaError(res.error ?? "Erreur"); return; }
    setTfaSecret(res.secret!);
    setTfaUri(res.uri!);
    setTfaStep("enable-qr");
  };

  const handleConfirmEnable = async () => {
    if (tfaCode.length !== 6) return;
    setTfaLoading(true); setTfaError("");
    const res = await confirmEnable2FA(tfaCode, tfaSecret);
    setTfaLoading(false);
    if (!res.success) { setTfaError(res.error ?? "Code invalide"); setTfaCode(""); return; }
    setTfaSuccess("Authentification à deux facteurs activée avec succès !");
    resetTfa();
    setTimeout(() => setTfaSuccess(""), 4000);
  };

  const handleDisablePassword = async () => {
    if (!tfaPassword) return;
    setTfaLoading(true); setTfaError("");
    const res = await disable2FA(tfaPassword);
    setTfaLoading(false);
    if (!res.success) { setTfaError(res.error ?? "Erreur"); return; }
    setTfaSuccess("Authentification à deux facteurs désactivée.");
    resetTfa();
    setTimeout(() => setTfaSuccess(""), 4000);
  };

  const qrUrl = tfaUri ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tfaUri)}&margin=10` : "";

  return (
    <AdminLayout title="Paramètres" subtitle="Configuration de la boutique">
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Onglets */}
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

        {/* Contenu */}
        <div className="card" style={{ padding: "1.5rem" }}>
          {saved && (
            <div className="alert alert-success" style={{ marginBottom: "1.25rem" }}>
              ✅ Paramètres enregistrés avec succès
            </div>
          )}

          {/* ─── Boutique ─── */}
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

          {/* ─── Livraison ─── */}
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
                          <input type="number" value={c.fee} onChange={(e) => updateCityFee(i, Number(e.target.value))} style={{ width: 100 }} />
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

          {/* ─── Sécurité ─── */}
          {tab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h3 style={{ marginBottom: "-0.25rem" }}>Sécurité du compte</h3>

              {/* Message de succès */}
              {tfaSuccess && (
                <div className="alert alert-success">
                  <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                  {tfaSuccess}
                </div>
              )}

              {/* ─── Bloc 2FA ─── */}
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                {/* En-tête statut */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", background: "var(--bg2)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: twoFAEnabled ? "var(--success-bg)" : "var(--bg)", border: `1px solid ${twoFAEnabled ? "rgba(16,185,129,0.3)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Smartphone size={16} color={twoFAEnabled ? "var(--success)" : "var(--muted)"} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                        Authentification à deux facteurs (2FA)
                      </div>
                      <div style={{ fontSize: "0.775rem", color: twoFAEnabled ? "var(--success)" : "var(--muted)", marginTop: "0.125rem" }}>
                        {twoFAEnabled
                          ? "✅ Activée — connexion protégée par Google Authenticator"
                          : "Désactivée — la 2FA renforce la sécurité de votre compte"}
                      </div>
                    </div>
                  </div>

                  {tfaStep === "idle" && (
                    <button
                      className={`btn ${twoFAEnabled ? "btn-danger" : "btn-primary"} btn-sm`}
                      onClick={() => { resetTfa(); setTfaStep(twoFAEnabled ? "disable-password" : "enable-password"); }}
                    >
                      {twoFAEnabled ? "Désactiver" : "Activer la 2FA"}
                    </button>
                  )}

                  {tfaStep !== "idle" && (
                    <button className="btn-icon" onClick={resetTfa} title="Annuler">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* ─── Étape 1 : Mot de passe (activation) ─── */}
                {tfaStep === "enable-password" && (
                  <div style={{ padding: "1.25rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                      <Lock size={12} style={{ display: "inline", marginRight: 4 }} />
                      Confirmez votre mot de passe pour continuer
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showTfaPassword ? "text" : "password"}
                            placeholder="Votre mot de passe"
                            value={tfaPassword}
                            onChange={(e) => setTfaPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleEnablePassword()}
                            style={{ paddingRight: "2.5rem" }}
                            autoFocus
                          />
                          <button type="button" onClick={() => setShowTfaPassword(!showTfaPassword)}
                            style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex" }}>
                            {showTfaPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <button className="btn btn-primary" onClick={handleEnablePassword} disabled={!tfaPassword || tfaLoading}>
                        {tfaLoading ? "Vérification…" : "Continuer →"}
                      </button>
                    </div>
                    {tfaError && <div className="alert alert-danger" style={{ padding: "0.5rem 0.75rem" }}>{tfaError}</div>}
                  </div>
                )}

                {/* ─── Étape 2 : QR code + code de confirmation ─── */}
                {tfaStep === "enable-qr" && (
                  <div style={{ padding: "1.25rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                      {/* QR */}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ background: "white", padding: "8px", borderRadius: 8, display: "inline-block", border: "1px solid var(--border)" }}>
                          <img src={qrUrl} alt="QR Code 2FA" width={180} height={180} style={{ display: "block" }} />
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                          Scannez avec Google Authenticator
                        </p>
                      </div>

                      {/* Instructions */}
                      <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "0.8125rem", marginBottom: "0.5rem" }}>Instructions :</p>
                          <ol style={{ paddingLeft: "1.25rem", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.75 }}>
                            <li>Ouvrez <strong>Google Authenticator</strong> sur votre téléphone</li>
                            <li>Appuyez sur <strong>+</strong> puis <em>Scanner un QR code</em></li>
                            <li>Scannez le code ci-contre</li>
                            <li>Entrez le code à 6 chiffres affiché</li>
                          </ol>
                        </div>

                        <div>
                          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                            Clé manuelle (si le scan ne fonctionne pas) :
                          </p>
                          <code style={{ fontSize: "0.7rem", background: "var(--bg2)", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--border)", wordBreak: "break-all", display: "block", letterSpacing: "0.1em" }}>
                            {tfaSecret}
                          </code>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Code de vérification (6 chiffres)</label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              placeholder="000000"
                              value={tfaCode}
                              onChange={(e) => setTfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              onKeyDown={(e) => e.key === "Enter" && handleConfirmEnable()}
                              style={{ width: 130, letterSpacing: "0.25em", textAlign: "center", fontSize: "1.1rem" }}
                              autoFocus
                            />
                            <button className="btn btn-primary" onClick={handleConfirmEnable} disabled={tfaCode.length !== 6 || tfaLoading}>
                              {tfaLoading ? "Vérification…" : <><CheckCircle2 size={14} /> Confirmer</>}
                            </button>
                          </div>
                        </div>

                        {tfaError && <div className="alert alert-danger" style={{ padding: "0.5rem 0.75rem" }}>{tfaError}</div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Désactivation : Mot de passe ─── */}
                {tfaStep === "disable-password" && (
                  <div style={{ padding: "1.25rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="alert alert-warning" style={{ padding: "0.625rem 0.875rem" }}>
                      <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                      <span>La désactivation de la 2FA réduit la sécurité de votre compte. Entrez votre mot de passe pour confirmer.</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showTfaPassword ? "text" : "password"}
                            placeholder="Votre mot de passe"
                            value={tfaPassword}
                            onChange={(e) => setTfaPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleDisablePassword()}
                            style={{ paddingRight: "2.5rem" }}
                            autoFocus
                          />
                          <button type="button" onClick={() => setShowTfaPassword(!showTfaPassword)}
                            style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex" }}>
                            {showTfaPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <button className="btn btn-danger" onClick={handleDisablePassword} disabled={!tfaPassword || tfaLoading}>
                        {tfaLoading ? "Vérification…" : "Désactiver la 2FA"}
                      </button>
                    </div>
                    {tfaError && <div className="alert alert-danger" style={{ padding: "0.5rem 0.75rem" }}>{tfaError}</div>}
                  </div>
                )}
              </div>

              {/* ─── Comptes admin ─── */}
              <div className="divider" />

              <h3>Comptes administrateurs</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { name: "Youssef Slimani", email: "admin@yswatchs.com", role: "Super Admin" },
                  { name: "Sophie Martin",   email: "editor@yswatchs.com", role: "Éditeur" },
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
                <Plus size={14} /> Ajouter un administrateur
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
