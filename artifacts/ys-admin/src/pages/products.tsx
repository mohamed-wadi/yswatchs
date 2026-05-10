import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { products as initialProducts, formatPrice, Product } from "@/lib/data";
import { Plus, Pencil, Trash2, Search, X, Save } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ category: "Homme", movement: "Automatique", caseMaterial: "Acier", stockStatus: "instock", isNew: false, isBestSeller: false, sold: 0 });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setShowForm(true);
  };

  const save = () => {
    if (!form.name || !form.price || !form.reference) return;
    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } as Product : p)));
    } else {
      const newP: Product = {
        id: `p${Date.now()}`,
        name: form.name!,
        category: form.category || "Homme",
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : undefined,
        stock: Number(form.stock) || 0,
        stockStatus: form.stockStatus || "instock",
        sold: 0,
        isNew: form.isNew || false,
        isBestSeller: form.isBestSeller || false,
        movement: form.movement || "Automatique",
        caseMaterial: form.caseMaterial || "Acier",
        reference: form.reference!,
      };
      setProducts((prev) => [newP, ...prev]);
    }
    setShowForm(false);
    setForm({});
    setEditing(null);
  };

  const remove = (id: string) => {
    if (confirm("Supprimer ce produit ?")) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout title="Produits" subtitle={`${products.length} produits dans le catalogue`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--ys-surface)",
            border: "1px solid var(--ys-border)",
            padding: "0.5rem 0.75rem",
            width: 280,
          }}
        >
          <Search size={14} style={{ color: "var(--ys-text-dim)" }} />
          <input
            placeholder="Nom, référence, catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: "var(--ys-text)", fontSize: "0.875rem", padding: 0 }}
          />
        </div>
        <button className="ys-btn ys-btn-primary" onClick={openAdd}>
          <Plus size={14} />
          Ajouter un produit
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showForm ? "1fr 360px" : "1fr", gap: "1rem" }}>
        <div className="ys-card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Vendu</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "var(--ys-gold)", fontFamily: "var(--font-serif)", fontSize: "0.85rem" }}>
                    {p.reference}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{p.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--ys-text-muted)" }}>{p.movement} · {p.caseMaterial}</div>
                  </td>
                  <td style={{ color: "var(--ys-text-muted)", fontSize: "0.8rem" }}>{p.category}</td>
                  <td>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem" }}>
                      {p.discount
                        ? formatPrice(p.price * (1 - p.discount / 100))
                        : formatPrice(p.price)}
                    </div>
                    {p.discount && (
                      <div style={{ fontSize: "0.7rem", color: "var(--ys-text-dim)", textDecoration: "line-through" }}>
                        {formatPrice(p.price)}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: "0.875rem" }}>{p.stock}</td>
                  <td style={{ fontSize: "0.875rem", color: "var(--ys-text-muted)" }}>{p.sold}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span className={`status-badge status-${p.stockStatus}`}>
                        {p.stockStatus === "instock" ? "En stock" : p.stockStatus === "lowstock" ? "Stock faible" : "Épuisé"}
                      </span>
                      {p.isNew && <span className="status-badge status-confirmed" style={{ fontSize: "0.6rem" }}>Nouveau</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        onClick={() => openEdit(p)}
                        style={{ background: "transparent", border: "none", color: "var(--ys-gold)", cursor: "pointer", padding: 4 }}
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        style={{ background: "transparent", border: "none", color: "var(--ys-danger)", cursor: "pointer", padding: 4 }}
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="ys-card animate-in" style={{ alignSelf: "flex-start", position: "sticky", top: 76 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>
                {editing ? "Modifier le produit" : "Nouveau produit"}
              </span>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: "transparent", border: "none", color: "var(--ys-text-muted)", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <Field label="Référence *">
                <input style={{ width: "100%" }} value={form.reference || ""} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} placeholder="YS-M007" />
              </Field>
              <Field label="Nom *">
                <input style={{ width: "100%" }} value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nom du produit" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                <Field label="Prix (MAD) *">
                  <input type="number" style={{ width: "100%" }} value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
                </Field>
                <Field label="Remise (%)">
                  <input type="number" style={{ width: "100%" }} value={form.discount || ""} onChange={(e) => setForm((f) => ({ ...f, discount: Number(e.target.value) || undefined }))} placeholder="0" />
                </Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                <Field label="Stock">
                  <input type="number" style={{ width: "100%" }} value={form.stock ?? ""} onChange={(e) => {
                    const s = Number(e.target.value);
                    const ss = s === 0 ? "outofstock" : s <= 5 ? "lowstock" : "instock";
                    setForm((f) => ({ ...f, stock: s, stockStatus: ss }));
                  }} />
                </Field>
                <Field label="Catégorie">
                  <select style={{ width: "100%" }} value={form.category || "Homme"} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    <option>Homme</option><option>Femme</option><option>Collection</option>
                  </select>
                </Field>
              </div>
              <Field label="Mouvement">
                <select style={{ width: "100%" }} value={form.movement || "Automatique"} onChange={(e) => setForm((f) => ({ ...f, movement: e.target.value }))}>
                  <option>Automatique</option><option>Manuel</option><option>Quartz</option>
                </select>
              </Field>
              <Field label="Boîtier">
                <select style={{ width: "100%" }} value={form.caseMaterial || "Acier"} onChange={(e) => setForm((f) => ({ ...f, caseMaterial: e.target.value }))}>
                  <option>Acier</option><option>Or jaune</option><option>Or rose</option><option>Platine</option>
                </select>
              </Field>
              <div style={{ display: "flex", gap: "1.25rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--ys-text-muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.isNew || false} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />
                  Nouveau
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--ys-text-muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.isBestSeller || false} onChange={(e) => setForm((f) => ({ ...f, isBestSeller: e.target.checked }))} />
                  Best-seller
                </label>
              </div>
              <button className="ys-btn ys-btn-primary" onClick={save} style={{ justifyContent: "center", width: "100%", marginTop: "0.5rem" }}>
                <Save size={14} />
                {editing ? "Enregistrer" : "Créer le produit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ys-text-muted)", marginBottom: "0.3rem" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
