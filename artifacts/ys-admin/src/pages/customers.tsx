import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { customers, formatPrice, formatDate } from "@/lib/data";
import { Search, Crown, Mail, Phone, MapPin, X } from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "vip">("all");
  const [selected, setSelected] = useState<(typeof customers)[0] | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.vip;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Clients" subtitle={`${customers.length} clients enregistrés`}>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--ys-surface)",
            border: "1px solid var(--ys-border)",
            padding: "0.5rem 0.75rem",
            flex: 1,
            maxWidth: 300,
          }}
        >
          <Search size={14} style={{ color: "var(--ys-text-dim)" }} />
          <input
            placeholder="Nom, email, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: "var(--ys-text)", fontSize: "0.875rem", padding: 0 }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["all", "vip"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.375rem 0.75rem",
                fontSize: "0.7rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "1px solid",
                borderColor: filter === f ? "var(--ys-gold)" : "var(--ys-border)",
                background: filter === f ? "var(--ys-gold-dim)" : "transparent",
                color: filter === f ? "var(--ys-gold)" : "var(--ys-text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                transition: "all 0.15s",
              }}
            >
              {f === "vip" && <Crown size={11} />}
              {f === "all" ? "Tous" : "VIP uniquement"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 320px" : "1fr", gap: "1rem" }}>
        <div className="ys-card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Contact</th>
                <th>Localisation</th>
                <th>Commandes</th>
                <th>Total dépensé</th>
                <th>Dernière commande</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => setSelected(c)}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
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
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{c.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)" }}>Depuis {formatDate(c.joinDate)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)" }}>{c.email}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)" }}>{c.phone}</div>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)" }}>
                    {c.city}, {c.country}
                  </td>
                  <td style={{ fontSize: "0.875rem", textAlign: "center" }}>{c.orders}</td>
                  <td style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", color: "var(--ys-gold)" }}>
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--ys-text-muted)" }}>
                    {formatDate(c.lastOrder)}
                  </td>
                  <td>
                    {c.vip ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.2rem 0.6rem",
                          background: "rgba(201,168,76,0.12)",
                          border: "1px solid rgba(201,168,76,0.3)",
                          color: "var(--ys-gold)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        <Crown size={9} />
                        VIP
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--ys-text-dim)" }}>Standard</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="ys-card animate-in" style={{ alignSelf: "flex-start", position: "sticky", top: 76 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--ys-gold-dim)",
                    border: "1px solid var(--ys-gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    color: "var(--ys-gold)",
                    fontWeight: 600,
                  }}
                >
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>{selected.name}</div>
                  {selected.vip && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.65rem",
                        color: "var(--ys-gold)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      <Crown size={9} /> Client VIP
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: "transparent", border: "none", color: "var(--ys-text-muted)", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <InfoRow icon={Mail} value={selected.email} />
              <InfoRow icon={Phone} value={selected.phone} />
              <InfoRow icon={MapPin} value={`${selected.city}, ${selected.country}`} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                margin: "1.25rem 0",
              }}
            >
              <div style={{ background: "var(--ys-surface-2)", padding: "0.875rem", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--ys-text)" }}>
                  {selected.orders}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--ys-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
                  Commandes
                </div>
              </div>
              <div style={{ background: "var(--ys-surface-2)", padding: "0.875rem", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--ys-gold)" }}>
                  {formatPrice(selected.totalSpent)}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--ys-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
                  Total dépensé
                </div>
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--ys-text-muted)", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Client depuis</span><span style={{ color: "var(--ys-text)" }}>{formatDate(selected.joinDate)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Dernière commande</span><span style={{ color: "var(--ys-text)" }}>{formatDate(selected.lastOrder)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Panier moyen</span>
                <span style={{ color: "var(--ys-gold)", fontFamily: "var(--font-serif)" }}>
                  {formatPrice(Math.round(selected.totalSpent / selected.orders))}
                </span>
              </div>
            </div>

            <button
              className="ys-btn ys-btn-ghost"
              style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
              onClick={() => window.open(`mailto:${selected.email}`)}
            >
              <Mail size={13} /> Envoyer un email
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function InfoRow({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.8rem", color: "var(--ys-text-muted)" }}>
      <Icon size={13} style={{ color: "var(--ys-gold)", flexShrink: 0 }} />
      {value}
    </div>
  );
}
