import { Bell, Sun, Moon, ExternalLink } from "lucide-react";
import { useStore } from "@/lib/store";

interface HeaderProps { title: string; subtitle?: string; }

export default function Header({ title, subtitle }: HeaderProps) {
  const { state, dispatch } = useStore();
  const pendingOrders = state.orders.filter((o) => o.status === "pending");
  const blacklistAlerts = state.orders.filter((o) => {
    const bl = state.blacklist.find((b) => b.phone === o.phone);
    return bl && o.status === "pending";
  });

  const toggleTheme = () => dispatch({ type: "SET_THEME", theme: state.theme === "light" ? "dark" : "light" });

  return (
    <header style={{
      height: 56, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 1.5rem",
      background: "var(--sidebar)", borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 20, gap: "1rem",
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{subtitle}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
        {/* Blacklist alert */}
        {blacklistAlerts.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
            background: "var(--danger-bg)", color: "var(--danger-text)",
            padding: "0.3rem 0.625rem", borderRadius: "99px",
            fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(239,68,68,0.2)",
          }}>
            ⚠️ {blacklistAlerts.length} commande{blacklistAlerts.length > 1 ? "s" : ""} blacklist
          </div>
        )}

        {/* Pending bell */}
        {pendingOrders.length > 0 && (
          <div style={{ position: "relative" }}>
            <button className="btn-icon"><Bell size={16} /></button>
            <span style={{ position: "absolute", top: -2, right: -2, width: 16, height: 16, background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "white" }}>
              {pendingOrders.length}
            </span>
          </div>
        )}

        {/* Visit site */}
        <a href="https://4d7840d1-bb48-4550-a115-728463a16c7d-00-1zkzq8j0k9fcd.picard.replit.dev/" target="_blank" rel="noopener noreferrer">
          <button className="btn btn-secondary btn-sm" style={{ gap: "0.3rem" }}>
            <ExternalLink size={12} />
            Voir le site
          </button>
        </a>

        {/* Theme toggle */}
        <button className="btn-icon" onClick={toggleTheme} title="Changer le thème">
          {state.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
