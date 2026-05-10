import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Watch, AlertCircle, ArrowRight, Shield } from "lucide-react";

export default function LoginPage() {
  const { step, login, verify2FA } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { if (step === "2fa") otpRefs.current[0]?.focus(); }, [step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await login(email, password);
    if (!res.success) setError(res.error ?? "Erreur");
    setLoading(false);
  };

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp]; next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every((d) => d)) submitOtp(next.join(""));
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const submitOtp = async (code: string) => {
    setLoading(true); setError("");
    const res = await verify2FA(code);
    if (!res.success) { setError(res.error ?? "Erreur"); setOtp(["","","","","",""]); otpRefs.current[0]?.focus(); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 52, height: 52, background: "var(--accent)", borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.875rem", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
            <Watch size={24} color="white" />
          </div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: "0.25rem" }}>YsWatchs Admin</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            {step === "2fa" ? "Vérification en deux étapes" : "Connectez-vous à votre espace admin"}
          </p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          {step === "login" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Adresse e-mail</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yswatchs.com" required autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••" required
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex" }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" style={{ padding: "0.625rem 0.75rem" }}>
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.625rem" }} disabled={loading}>
                {loading ? "Connexion…" : <><span>Se connecter</span><ArrowRight size={14} /></>}
              </button>
            </form>
          )}

          {step === "2fa" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 44, height: 44, background: "var(--accent-light)", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                  <Shield size={20} color="var(--accent)" />
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                  Entrez le code à 6 chiffres de votre application d'authentification
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    style={{
                      width: 46, height: 52, textAlign: "center",
                      fontSize: "1.375rem", fontWeight: 700,
                      borderRadius: 8, border: "1px solid var(--border)",
                      background: "var(--bg2)", color: "var(--text)",
                    }}
                  />
                ))}
              </div>

              {error && (
                <div className="alert alert-danger" style={{ padding: "0.625rem 0.75rem" }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              {loading && <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>Vérification…</p>}

              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--dim)" }}>
                Démo: code <strong>123456</strong>
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--dim)", marginTop: "1.25rem" }}>
          YsWatchs © {new Date().getFullYear()} — Panneau d'administration
        </p>
      </div>
    </div>
  );
}
