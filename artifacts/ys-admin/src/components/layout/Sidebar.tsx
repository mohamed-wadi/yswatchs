import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Ban,
  BarChart2, Settings, LogOut, Warehouse, Tag, Watch
} from "lucide-react";

const nav = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "/admin" },
  { label: "Commandes",        icon: ShoppingBag,     href: "/admin/orders" },
  { label: "Produits",         icon: Package,         href: "/admin/products" },
  { label: "Inventaire",       icon: Warehouse,       href: "/admin/inventory" },
  { label: "Clients",          icon: Users,           href: "/admin/customers" },
  { label: "Blacklist",        icon: Ban,             href: "/admin/blacklist" },
  { label: "Promotions",       icon: Tag,             href: "/admin/promos" },
  { label: "Analytiques",      icon: BarChart2,       href: "/admin/analytics" },
  { label: "Paramètres",       icon: Settings,        href: "/admin/settings" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const { state } = useStore();
  const pendingCount = state.orders.filter((o) => o.status === "pending").length;
  const blacklistCount = state.blacklist.length;

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" || location === "/admin/" : location.startsWith(href);

  return (
    <aside style={{
      width: "var(--sidebar-w)", flexShrink: 0, height: "100vh",
      background: "var(--sidebar)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", position: "sticky", top: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.625rem" }}>
        <div style={{ width: 32, height: 32, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Watch size={16} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.875rem", letterSpacing: "-0.01em" }}>YsWatchs</div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.625rem", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
        {nav.map((item) => {
          const active = isActive(item.href);
          const badge = item.href === "/admin/orders" ? pendingCount : item.href === "/admin/blacklist" ? blacklistCount : 0;
          return (
            <Link key={item.href} href={item.href}>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)",
                background: active ? "var(--accent-light)" : "transparent",
                color: active ? "var(--accent-text)" : "var(--muted)",
                fontWeight: active ? 600 : 400,
                fontSize: "0.8125rem", cursor: "pointer",
                transition: "all 0.15s",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg2)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <item.icon size={15} />
                  {item.label}
                </span>
                {badge > 0 && (
                  <span style={{ background: item.href === "/admin/blacklist" ? "var(--danger)" : "var(--accent)", color: "white", borderRadius: "99px", fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.45rem", minWidth: 18, textAlign: "center" }}>
                    {badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "0.875rem 0.625rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.75rem" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-text)", flexShrink: 0 }}>
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name ?? "Admin"}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{user?.role === "super_admin" ? "Super Admin" : user?.role}</div>
          </div>
          <button className="btn-icon" onClick={logout} title="Se déconnecter"><LogOut size={14} /></button>
        </div>
      </div>
    </aside>
  );
}
