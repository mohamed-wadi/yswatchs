import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ys-bg)", flexDirection: "column", gap: "1.5rem", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "6rem", color: "var(--ys-gold)", lineHeight: 1, opacity: 0.3 }}>404</div>
      <div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Page introuvable</h1>
        <p style={{ color: "var(--ys-text-muted)", fontSize: "0.875rem" }}>Cette page n'existe pas dans le panneau d'administration.</p>
      </div>
      <Link href="/admin">
        <button className="ys-btn ys-btn-primary">Retour au tableau de bord</button>
      </Link>
    </div>
  );
}
