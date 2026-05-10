import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore, Product } from "@/lib/store";
import { Plus, Pencil, Trash2, Search, X, ExternalLink, Save, Eye, EyeOff, Package } from "lucide-react";

const MOVEMENTS = ["Automatique", "Quartz", "Mécanique", "Manuel", "Solaire"];
const MATERIALS = ["Acier", "Or jaune", "Or rose", "Platine", "Argent", "Titane", "Céramique"];
const ALL_TAGS = ["Nouveauté", "Bestseller", "Promo", "Édition limitée"];

const EMPTY_PRODUCT: Omit<Product, "id" | "reference" | "sold"> = {
  name: "", shortDesc: "", longDesc: "",
  price: 0, oldPrice: undefined,
  category: "Homme", movement: "Automatique", caseMaterial: "Acier",
  stock: 0, images: [], tags: [], visible: true,
};

function ProductForm({ product, onSave, onClose }: {
  product?: Product; onSave: (p: Omit<Product, "id" | "reference" | "sold">) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Product, "id" | "reference" | "sold">>(
    product ? { name: product.name, shortDesc: product.shortDesc, longDesc: product.longDesc, price: product.price, oldPrice: product.oldPrice, category: product.category, movement: product.movement, caseMaterial: product.caseMaterial, stock: product.stock, images: product.images, tags: product.tags, visible: product.visible }
    : { ...EMPTY_PRODUCT }
  );

  const set = (key: keyof typeof form, val: unknown) => setForm((f) => ({ ...f, [key]: val }));
  const toggleTag = (t: string) => set("tags", form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h3>{product ? "Modifier le produit" : "Nouveau produit"}</h3>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nom du produit *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Pagani Classic Cuir" />
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Collection">Collection</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description courte</label>
            <input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} placeholder="Affiché dans le catalogue" />
          </div>

          <div className="form-group">
            <label className="form-label">Description longue / storytelling</label>
            <textarea value={form.longDesc} onChange={(e) => set("longDesc", e.target.value)} rows={4} placeholder="Affiché sur la page produit…" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Prix (MAD) *</label>
              <input type="number" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} placeholder="15000" min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Prix barré (MAD)</label>
              <input type="number" value={form.oldPrice || ""} onChange={(e) => set("oldPrice", e.target.value ? Number(e.target.value) : undefined)} placeholder="Optionnel" min={0} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mouvement</label>
              <select value={form.movement} onChange={(e) => set("movement", e.target.value)}>
                {MOVEMENTS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Matériau boîtier</label>
              <select value={form.caseMaterial} onChange={(e) => set("caseMaterial", e.target.value)}>
                {MATERIALS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stock (quantité)</label>
              <input type="number" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} min={0} />
            </div>
            <div className="form-group">
              <label className="form-label">Visible sur le site</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginTop: "0.25rem" }}>
                <button className={`toggle ${form.visible ? "on" : ""}`} onClick={() => set("visible", !form.visible)} type="button" />
                <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{form.visible ? "Visible" : "Masqué"}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
              {ALL_TAGS.map((t) => (
                <button key={t} type="button" className={`tag ${form.tags.includes(t) ? "selected" : ""}`} onClick={() => toggleTag(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Images produit</label>
            <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-sm)", padding: "1.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.8rem" }}>
              <Package size={20} style={{ marginBottom: "0.375rem", opacity: 0.4 }} />
              <div>Glissez vos images ici ou cliquez pour sélectionner</div>
              <div style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}>PNG, JPG, WebP — max 5 Mo chacune</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
            <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary" disabled={!form.name || !form.price} onClick={() => onSave(form)}>
              <Save size={14} /> {product ? "Enregistrer" : "Créer le produit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { state, dispatch, formatPrice } = useStore();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const products = state.products;

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q);
    const matchCat = catFilter === "all" || p.category === catFilter;
    const matchStock = stockFilter === "all" || (stockFilter === "instock" && p.stock > 0) || (stockFilter === "outofstock" && p.stock === 0);
    return matchQ && matchCat && matchStock;
  });

  const handleCreate = (form: Omit<Product, "id" | "reference" | "sold">) => {
    const newProduct: Product = {
      ...form,
      id: `p${Date.now()}`,
      reference: `YS-${form.category === "Homme" ? "M" : form.category === "Femme" ? "F" : "C"}${Date.now().toString().slice(-4)}`,
      sold: 0,
    };
    dispatch({ type: "ADD_PRODUCT", product: newProduct });
    setCreating(false);
  };

  const handleEdit = (form: Omit<Product, "id" | "reference" | "sold">) => {
    if (!editing) return;
    dispatch({ type: "UPDATE_PRODUCT", product: { ...editing, ...form } });
    setEditing(null);
  };

  const stockBadge = (p: Product) => {
    if (p.stock === 0) return <span className="badge badge-outofstock">Épuisé</span>;
    if (p.stock <= 5) return <span className="badge badge-lowstock">Faible ({p.stock})</span>;
    return <span className="badge badge-instock">En stock ({p.stock})</span>;
  };

  return (
    <AdminLayout title="Produits" subtitle={`${products.length} produits`}>
      <div className="page-header">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-bar" style={{ minWidth: 200 }}>
            <Search size={14} color="var(--muted)" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, référence…" />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ width: "auto" }}>
            <option value="all">Toutes catégories</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Collection">Collection</option>
          </select>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} style={{ width: "auto" }}>
            <option value="all">Tout le stock</option>
            <option value="instock">Disponible</option>
            <option value="outofstock">Épuisé</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus size={14} /> Nouveau produit
        </button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produit</th><th>Référence</th><th>Catégorie</th><th>Prix</th>
              <th>Stock</th><th>Tags</th><th>Vendu</th><th>Visible</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted)" }}>Aucun produit trouvé</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: 36, height: 36, background: "var(--bg2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={15} color="var(--muted)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.8125rem" }}>{p.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{p.shortDesc.slice(0, 40)}{p.shortDesc.length > 40 ? "…" : ""}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "0.775rem", color: "var(--muted)" }}>{p.reference}</td>
                <td><span className="badge badge-accent">{p.category}</span></td>
                <td>
                  <div style={{ fontWeight: 700 }}>{formatPrice(p.price)}</div>
                  {p.oldPrice && <div style={{ fontSize: "0.7rem", color: "var(--muted)", textDecoration: "line-through" }}>{formatPrice(p.oldPrice)}</div>}
                </td>
                <td>{stockBadge(p)}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                    {p.tags.map((t) => <span key={t} className={`badge badge-${t === "Bestseller" ? "bestseller" : t === "Nouveauté" ? "new" : t === "Promo" ? "promo" : "accent"}`}>{t}</span>)}
                  </div>
                </td>
                <td style={{ textAlign: "center", color: "var(--muted)" }}>{p.sold}</td>
                <td>
                  {p.visible
                    ? <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--success)", fontSize: "0.75rem" }}><Eye size={12} /> Oui</span>
                    : <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--muted)", fontSize: "0.75rem" }}><EyeOff size={12} /> Non</span>}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button className="btn-icon" title="Modifier" onClick={() => setEditing(p)}><Pencil size={14} /></button>
                    <a href="https://4d7840d1-bb48-4550-a115-728463a16c7d-00-1zkzq8j0k9fcd.picard.replit.dev/" target="_blank" rel="noopener noreferrer">
                      <button className="btn-icon" title="Voir sur le site"><ExternalLink size={14} /></button>
                    </a>
                    {deleting === p.id ? (
                      <button className="btn btn-danger btn-sm" onClick={() => { dispatch({ type: "DELETE_PRODUCT", id: p.id }); setDeleting(null); }}>✓</button>
                    ) : (
                      <button className="btn-icon" style={{ color: "var(--danger)" }} onClick={() => setDeleting(p.id)}><Trash2 size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && <ProductForm onSave={handleCreate} onClose={() => setCreating(false)} />}
      {editing && <ProductForm product={editing} onSave={handleEdit} onClose={() => setEditing(null)} />}
    </AdminLayout>
  );
}
