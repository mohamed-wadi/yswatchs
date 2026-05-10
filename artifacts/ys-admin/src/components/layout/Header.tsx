import { Bell, Search, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, msg: "Nouvelle commande YS-2025-0090 reçue", time: "Il y a 5 min", dot: "gold" },
    { id: 2, msg: "Stock faible: Benyar Chronographe (5 restants)", time: "Il y a 22 min", dot: "warning" },
    { id: 3, msg: "Paiement confirmé — Isabelle Fontaine", time: "Il y a 1h", dot: "success" },
    { id: 4, msg: "Stock épuisé: Pagani Design Nacre", time: "Il y a 3h", dot: "danger" },
  ];

  return (
    <header
      style={{
        height: 60,
        borderBottom: "1px solid var(--ys-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        gap: "1rem",
        background: "var(--ys-surface)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.1rem",
            fontWeight: 500,
            color: "var(--ys-text)",
            lineHeight: 1,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "0.7rem", color: "var(--ys-text-dim)", marginTop: 2, letterSpacing: "0.08em" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--ys-bg-deep)",
          border: "1px solid var(--ys-border)",
          padding: "0.375rem 0.75rem",
          width: 200,
        }}
      >
        <Search size={13} style={{ color: "var(--ys-text-dim)" }} />
        <input
          placeholder="Rechercher..."
          style={{
            background: "transparent",
            border: "none",
            color: "var(--ys-text)",
            fontSize: "0.8rem",
            outline: "none",
            width: "100%",
            padding: 0,
          }}
        />
      </div>

      {/* 2FA badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.25rem 0.625rem",
          border: "1px solid rgba(76,175,124,0.3)",
          background: "rgba(76,175,124,0.07)",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ys-success)",
        }}
      >
        <Shield size={11} />
        2FA
      </div>

      {/* Notifications */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          style={{
            background: "transparent",
            border: "1px solid var(--ys-border)",
            padding: "0.375rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            color: "var(--ys-text-muted)",
            transition: "all 0.2s",
          }}
        >
          <Bell size={15} />
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--ys-gold)",
              color: "#0C0A08",
              fontSize: "0.6rem",
              fontWeight: 700,
              width: 14,
              height: 14,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            4
          </span>
        </button>

        {notifOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              width: 300,
              background: "var(--ys-surface-2)",
              border: "1px solid var(--ys-border)",
              zIndex: 200,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--ys-border)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ys-text-muted)",
              }}
            >
              Notifications
            </div>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid rgba(201,168,76,0.07)",
                  display: "flex",
                  gap: "0.625rem",
                  alignItems: "flex-start",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--ys-surface-3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    marginTop: 4,
                    flexShrink: 0,
                    background:
                      n.dot === "gold"
                        ? "var(--ys-gold)"
                        : n.dot === "success"
                        ? "var(--ys-success)"
                        : n.dot === "danger"
                        ? "var(--ys-danger)"
                        : "var(--ys-warning)",
                  }}
                />
                <div>
                  <div style={{ fontSize: "0.8rem", color: "var(--ys-text)", lineHeight: 1.4 }}>
                    {n.msg}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--ys-text-dim)", marginTop: 2 }}>
                    {n.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
