import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Shield, AlertCircle, Clock } from "lucide-react";

export default function LoginPage() {
  const { step, login, verify2FA } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "2fa") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error || "Erreur inconnue");
  };

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otpDigits];
    next[i] = digit;
    setOtpDigits(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every((d) => d)) handleVerify(next.join(""));
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setError("");
    setLoading(true);
    const result = await verify2FA(code);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Code invalide");
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--ys-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left — decorative */}
      <div
        style={{
          width: "42%",
          background: "var(--ys-surface)",
          borderRight: "1px solid var(--ys-border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--ys-border) 1px, transparent 1px), linear-gradient(90deg, var(--ys-border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "var(--ys-gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <span
              style={{
                color: "#0C0A08",
                fontSize: "1.5rem",
                fontWeight: 700,
                fontFamily: "var(--font-serif)",
              }}
            >
              YS
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--ys-gold)",
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
            }}
          >
            YsWatchs
          </h2>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--ys-text-dim)",
              marginBottom: "2.5rem",
            }}
          >
            Horlogerie de Luxe
          </p>
          <span
            style={{
              display: "block",
              width: 48,
              height: 1,
              background: "var(--ys-border)",
              margin: "0 auto 2rem",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              textAlign: "left",
            }}
          >
            {[
              { icon: Shield, text: "Authentification 2FA sécurisée" },
              { icon: Clock, text: "Sessions expirantes automatiquement" },
              { icon: AlertCircle, text: "Accès réservé aux administrateurs" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "var(--ys-text-muted)",
                  fontSize: "0.8rem",
                }}
              >
                <Icon size={14} style={{ color: "var(--ys-gold)", flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }} className="animate-in">
          {step === "login" ? (
            <>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 400,
                  color: "var(--ys-text)",
                  marginBottom: "0.25rem",
                }}
              >
                Connexion Admin
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)", marginBottom: "2rem" }}>
                Accès sécurisé au panneau d'administration
              </p>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--ys-text-muted)",
                      marginBottom: "0.375rem",
                    }}
                  >
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yswatchs.com"
                    required
                    style={{ width: "100%" }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--ys-text-muted)",
                      marginBottom: "0.375rem",
                    }}
                  >
                    Mot de passe
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{ width: "100%", paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "var(--ys-text-dim)",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                      }}
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.625rem 0.75rem",
                      background: "rgba(201,76,76,0.08)",
                      border: "1px solid rgba(201,76,76,0.25)",
                      color: "var(--ys-danger)",
                      fontSize: "0.8rem",
                    }}
                  >
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="ys-btn ys-btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--ys-text-dim)", textAlign: "center" }}>
                Démo: admin@yswatchs.com / Admin@2025
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 48,
                  height: 48,
                  border: "1px solid var(--ys-gold)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  color: "var(--ys-gold)",
                }}
              >
                <Shield size={22} />
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 400,
                  color: "var(--ys-text)",
                  marginBottom: "0.25rem",
                }}
              >
                Vérification 2FA
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)", marginBottom: "2rem", lineHeight: 1.6 }}>
                Saisissez le code à 6 chiffres de votre application d'authentification (Google Authenticator, Authy…)
              </p>

              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", justifyContent: "center" }}>
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="otp-input"
                  />
                ))}
              </div>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.625rem 0.75rem",
                    background: "rgba(201,76,76,0.08)",
                    border: "1px solid rgba(201,76,76,0.25)",
                    color: "var(--ys-danger)",
                    fontSize: "0.8rem",
                    marginBottom: "1rem",
                  }}
                >
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <button
                onClick={() => handleVerify(otpDigits.join(""))}
                disabled={loading || otpDigits.some((d) => !d)}
                className="ys-btn ys-btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: loading || otpDigits.some((d) => !d) ? 0.5 : 1,
                }}
              >
                {loading ? "Vérification..." : "Vérifier le code"}
              </button>

              <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--ys-text-dim)", textAlign: "center" }}>
                Code démo: <span style={{ color: "var(--ys-gold)", fontFamily: "var(--font-serif)", fontSize: "1rem" }}>123456</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
