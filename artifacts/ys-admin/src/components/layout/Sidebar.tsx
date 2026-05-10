import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  BarChart2, Settings, LogOut, Warehouse, Tag, ChevronRight
} from "lucide-react";

const nav = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "/admin" },
  { label: "Commandes", icon: ShoppingBag, href: "/admin/orders" },
  { label: "Produits", icon: Package, href: "/admin/products" },
  { label: "Inventaire", icon: Warehouse, href: "/admin/inventory" },
  { label: "Clients", icon: Users, href: "/admin/customers" },
  { label: "Promotions", icon: Tag, href: "/admin/promos" },
  { label: "Analytiques", icon: BarChart2, href: "/admin/analytics" },
  { label: "Paramètres", icon: Settings, href: "/admin/settings" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside
      style={{
        width: "var(--ys-sidebar-w)",
        minHeight: "100vh",
        background: "var(--ys-surface)",
        borderRight: "1px solid var(--ys-border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.25rem",
          borderBottom: "1px solid var(--ys-border)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--ys-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#0C0A08", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
            YS
          </span>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 500, letterSpacing: "0.04em", color: "var(--ys-gold)" }}>
            YsWatchs
          </div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ys-text-dim)" }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0", overflowY: "auto" }}>
        {nav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? location === "/admin" || location === "/admin/"
              : location.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 1.25rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  borderLeft: isActive
                    ? "2px solid var(--ys-gold)"
                    : "2px solid transparent",
                  background: isActive ? "var(--ys-gold-glow)" : "transparent",
                  color: isActive ? "var(--ys-gold)" : "var(--ys-text-muted)",
                  fontSize: "0.8125rem",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "var(--ys-text)";
                    (e.currentTarget as HTMLElement).style.background = "var(--ys-surface-2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "var(--ys-text-muted)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }
                }}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight
                    size={12}
                    style={{ marginLeft: "auto", opacity: 0.5 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div style={{ borderTop: "1px solid var(--ys-border)", padding: "1rem 1.25rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--ys-gold-dim)",
              border: "1px solid var(--ys-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              color: "var(--ys-gold)",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {user?.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--ys-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--ys-gold)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {user?.role === "super_admin" ? "Super Admin" : user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.5rem 0.75rem",
            background: "transparent",
            border: "1px solid var(--ys-border)",
            color: "var(--ys-text-muted)",
            cursor: "pointer",
            fontSize: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--ys-danger)";
            (e.currentTarget as HTMLElement).style.color = "var(--ys-danger)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--ys-border)";
            (e.currentTarget as HTMLElement).style.color = "var(--ys-text-muted)";
          }}
        >
          <LogOut size={13} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
