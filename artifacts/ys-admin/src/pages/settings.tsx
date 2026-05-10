import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Shield, Store, Bell, Globe, Save, Eye, EyeOff, CheckCircle2 } from "lucide-react";

type Tab = "store" | "security" | "notifications" | "localization";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("store");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: "store", label: "Boutique", icon: Store },
    { id: "security", label: "Sécurité & 2FA", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "localization", label: "Localisation", icon: Globe },
  ];

  return (
    <AdminLayout title="Paramètres" subtitle="Configuration du panneau d'administration">
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.25rem" }}>
        {/* Sidebar tabs */}
        <div className="ys-card" style={{ padding: 0, alignSelf: "flex-start" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                width: "100%",
                padding: "0.75rem 1rem",
                background: tab === t.id ? "var(--ys-gold-glow)" : "transparent",
                border: "none",
                borderLeft: "2px solid",
                borderLeftColor: tab === t.id ? "var(--ys-gold)" : "transparent",
                borderBottom: "1px solid rgba(201,168,76,0.07)",
                color: tab === t.id ? "var(--ys-gold)" : "var(--ys-text-muted)",
                cursor: "pointer",
                fontSize: "0.8125rem",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="ys-card animate-in" key={tab}>
          {tab === "store" && <StoreSettings />}
          {tab === "security" && <SecuritySettings />}
          {tab === "notifications" && <NotificationSettings />}
          {tab === "localization" && <LocalizationSettings />}

          <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--ys-border)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button className="ys-btn ys-btn-primary" onClick={save}>
              <Save size={14} />
              Enregistrer les modifications
            </button>
            {saved && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--ys-success)", fontSize: "0.8rem", animation: "fadeSlideIn 0.3s ease" }}>
                <CheckCircle2 size={15} />
                Enregistré avec succès
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 500, marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--ys-border)" }}>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.125rem" }}>
      <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ys-text-muted)", marginBottom: "0.375rem" }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: "0.7rem", color: "var(--ys-text-dim)", marginTop: "0.25rem" }}>{hint}</div>}
    </div>
  );
}

function Toggle({ label, defaultChecked = true }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
      <span style={{ fontSize: "0.875rem", color: "var(--ys-text)" }}>{label}</span>
      <button
        onClick={() => setChecked((v) => !v)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: checked ? "var(--ys-gold)" : "var(--ys-surface-2)",
          border: "1px solid",
          borderColor: checked ? "var(--ys-gold)" : "var(--ys-border)",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: checked ? "#0C0A08" : "var(--ys-text-muted)",
            top: 2,
            left: checked ? 20 : 2,
            transition: "left 0.2s",
          }}
        />
      </button>
    </div>
  );
}

function StoreSettings() {
  return (
    <div>
      <SectionTitle>Informations boutique</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field label="Nom de la boutique">
          <input defaultValue="YsWatchs" style={{ width: "100%" }} />
        </Field>
        <Field label="Email de contact">
          <input defaultValue="contact@yswatchs.com" style={{ width: "100%" }} />
        </Field>
        <Field label="Téléphone">
          <input defaultValue="+212 6 XX XX XX XX" style={{ width: "100%" }} />
        </Field>
        <Field label="Devise">
          <select defaultValue="MAD" style={{ width: "100%" }}>
            <option value="MAD">MAD — Dirham marocain</option>
            <option value="EUR">EUR — Euro</option>
            <option value="USD">USD — Dollar américain</option>
          </select>
        </Field>
      </div>
      <Field label="Adresse">
        <input defaultValue="123 Rue Mohammed V, Casablanca" style={{ width: "100%" }} />
      </Field>
      <Field label="Description boutique">
        <textarea
          defaultValue="YsWatchs — Boutique d'horlogerie de luxe au Maroc. Montres authentiques, service premium."
          style={{ width: "100%", minHeight: 80, resize: "vertical" }}
        />
      </Field>
      <Field label="URL site vitrine">
        <input defaultValue="https://www.yswatchs.com" style={{ width: "100%" }} />
      </Field>
    </div>
  );
}

function SecuritySettings() {
  const [showPw, setShowPw] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  return (
    <div>
      <SectionTitle>Sécurité & Authentification 2FA</SectionTitle>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          padding: "1rem",
          background: "rgba(76,175,124,0.07)",
          border: "1px solid rgba(76,175,124,0.25)",
          marginBottom: "1.5rem",
        }}
      >
        <Shield size={18} style={{ color: "var(--ys-success)", flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: "0.875rem", color: "var(--ys-success)", fontWeight: 500, marginBottom: "0.25rem" }}>
            2FA activée sur ce compte
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--ys-text-muted)", lineHeight: 1.5 }}>
            L'authentification à deux facteurs est activée. Chaque connexion nécessite un code TOTP depuis votre application d'authentification.
          </div>
        </div>
      </div>

      <Field label="Changer le mot de passe" hint="Minimum 12 caractères, majuscule, chiffre et symbole requis">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} placeholder="Mot de passe actuel" style={{ width: "100%", paddingRight: "2.5rem" }} />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "var(--ys-text-dim)", cursor: "pointer", display: "flex" }}
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <input type="password" placeholder="Nouveau mot de passe" style={{ width: "100%" }} />
          <input type="password" placeholder="Confirmer le nouveau mot de passe" style={{ width: "100%" }} />
        </div>
      </Field>

      <div style={{ borderTop: "1px solid var(--ys-border)", paddingTop: "1.25rem", marginTop: "1.25rem" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", marginBottom: "0.75rem" }}>
          Reconfigurer la 2FA
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
          Pour reconfigurer votre application d'authentification (Google Authenticator, Authy, etc.), scannez le QR code ci-dessous. Conservez votre code de secours en lieu sûr.
        </p>

        <button
          className="ys-btn ys-btn-ghost"
          onClick={() => setQrVisible((v) => !v)}
          style={{ marginBottom: "1rem" }}
        >
          <Shield size={13} />
          {qrVisible ? "Masquer le QR code" : "Afficher le QR code 2FA"}
        </button>

        {qrVisible && (
          <div
            className="animate-in"
            style={{
              padding: "1.25rem",
              background: "var(--ys-surface-2)",
              border: "1px solid var(--ys-border)",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.875rem",
            }}
          >
            {/* Simulated QR code */}
            <div
              style={{
                width: 120,
                height: 120,
                background: "#fff",
                display: "grid",
                gridTemplateColumns: "repeat(10, 1fr)",
                padding: 8,
                gap: 1,
              }}
            >
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: [0,1,2,3,10,11,12,20,21,22,7,8,9,17,18,19,70,71,72,80,81,82,90,91,92,77,78,79,87,88,89,97,98,99,35,36,45,46,55,56,64,65,73,74,83,84,25,34,44,54,66,76,86,96,27,37,47,57,30,40,50,60].includes(i)
                      ? "#000"
                      : "transparent",
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)", textAlign: "center", lineHeight: 1.5 }}>
              Clé secrète TOTP:<br />
              <span style={{ fontFamily: "var(--font-serif)", color: "var(--ys-gold)", letterSpacing: "0.15em" }}>
                JBSWY3DP EHPK3PXP
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--ys-border)", paddingTop: "1.25rem", marginTop: "1.25rem" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", marginBottom: "0.75rem" }}>Sécurité de session</div>
        <Toggle label="Déconnexion automatique après 30 min d'inactivité" defaultChecked={true} />
        <Toggle label="Alertes de connexion par email" defaultChecked={true} />
        <Toggle label="Bloquer les connexions depuis des pays inconnus" defaultChecked={false} />
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <SectionTitle>Préférences de notification</SectionTitle>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--ys-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
          Commandes
        </div>
        <Toggle label="Nouvelle commande reçue" defaultChecked={true} />
        <Toggle label="Commande annulée" defaultChecked={true} />
        <Toggle label="Paiement confirmé" defaultChecked={true} />
        <Toggle label="Demande de remboursement" defaultChecked={true} />
      </div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--ys-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
          Inventaire
        </div>
        <Toggle label="Stock faible (≤ 5 unités)" defaultChecked={true} />
        <Toggle label="Produit épuisé" defaultChecked={true} />
        <Toggle label="Alerte stock quotidienne" defaultChecked={false} />
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "var(--ys-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
          Rapports
        </div>
        <Toggle label="Rapport hebdomadaire des ventes" defaultChecked={true} />
        <Toggle label="Rapport mensuel complet" defaultChecked={true} />
        <Toggle label="Objectifs de ventes atteints" defaultChecked={false} />
      </div>
    </div>
  );
}

function LocalizationSettings() {
  return (
    <div>
      <SectionTitle>Localisation & Région</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Field label="Langue de l'interface">
          <select defaultValue="fr" style={{ width: "100%" }}>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </Field>
        <Field label="Fuseau horaire">
          <select defaultValue="africa_casablanca" style={{ width: "100%" }}>
            <option value="africa_casablanca">Africa/Casablanca (GMT+1)</option>
            <option value="europe_paris">Europe/Paris (GMT+2)</option>
            <option value="utc">UTC</option>
          </select>
        </Field>
        <Field label="Format de date">
          <select defaultValue="dd/mm/yyyy" style={{ width: "100%" }}>
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
        <Field label="Devise principale">
          <select defaultValue="MAD" style={{ width: "100%" }}>
            <option value="MAD">MAD — Dirham marocain</option>
            <option value="EUR">EUR — Euro</option>
            <option value="USD">USD — Dollar US</option>
          </select>
        </Field>
        <Field label="Format des prix">
          <select style={{ width: "100%" }}>
            <option>14 500 MAD</option>
            <option>14,500 MAD</option>
            <option>MAD 14.500</option>
          </select>
        </Field>
        <Field label="Pays par défaut (livraisons)">
          <select style={{ width: "100%" }}>
            <option>Maroc</option>
            <option>France</option>
            <option>Algérie</option>
            <option>Tunisie</option>
          </select>
        </Field>
      </div>
    </div>
  );
}
