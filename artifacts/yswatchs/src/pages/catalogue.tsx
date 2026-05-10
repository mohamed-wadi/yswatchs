import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { products, formatPrice, getDiscountedPrice, type Category, type Movement, type CaseMaterial, type StrapType, type CaseSize } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

type Filters = {
  movement: Movement[];
  caseMaterial: CaseMaterial[];
  strapType: StrapType[];
  caseSize: CaseSize[];
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

function FilterSection({ title, options, selected, onChange }: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(true);
  if (options.length === 0) return null;
  return (
    <div style={{ borderBottom: '1px solid rgba(201,168,76,0.12)', paddingBottom: '1rem', marginBottom: '1rem' }}>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-3"
        style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)' }}>
        {title}
        {open ? <FiChevronUp style={{ fontSize: '0.75rem' }} /> : <FiChevronDown style={{ fontSize: '0.75rem' }} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div className="flex flex-col gap-2">
              {options.map(opt => (
                <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={selected.includes(opt.value)}
                    onChange={() => onChange(opt.value)} className="filter-checkbox" />
                  <span style={{ fontSize: '0.75rem', color: selected.includes(opt.value) ? '#C9A84C' : 'rgba(245,240,232,0.5)', transition: 'color 0.2s', letterSpacing: '0.08em' }}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CataloguePage() {
  const [, params] = useRoute("/montres/:genre");
  const genre = params?.genre as Category | undefined;
  const [filters, setFilters] = useState<Filters>({ movement: [], caseMaterial: [], strapType: [], caseSize: [] });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const catProducts = genre ? products.filter(p => p.category === genre) : products.filter(p => p.category === 'homme' || p.category === 'femme');

  const unique = <T extends string>(arr: (T | undefined)[]) => [...new Set(arr.filter(Boolean))] as T[];
  const movementOptions = unique(catProducts.map(p => p.movement));
  const caseMaterialOptions = unique(catProducts.map(p => p.caseMaterial));
  const strapOptions = unique(catProducts.map(p => p.strapType));
  const caseSizeOptions = unique(catProducts.map(p => p.caseSize));

  const toggleFilter = <K extends keyof Filters>(key: K, value: Filters[K][number]) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(value as never)
        ? (f[key] as string[]).filter(v => v !== value)
        : [...f[key], value as never],
    }));
  };

  const activeCount = Object.values(filters).reduce((s, a) => s + a.length, 0);

  const filtered = catProducts.filter(p => {
    if (filters.movement.length && p.movement && !filters.movement.includes(p.movement)) return false;
    if (filters.caseMaterial.length && p.caseMaterial && !filters.caseMaterial.includes(p.caseMaterial)) return false;
    if (filters.strapType.length && p.strapType && !filters.strapType.includes(p.strapType)) return false;
    if (filters.caseSize.length && p.caseSize && !filters.caseSize.includes(p.caseSize)) return false;
    return true;
  });

  const movLabels: Record<string, string> = { automatique: 'Automatique', manuel: 'Manuel', quartz: 'Quartz' };
  const matLabels: Record<string, string> = { acier: 'Acier 316L', 'or-jaune': 'Or jaune', 'or-rose': 'Or rose', platine: 'Platine' };
  const strapLabels: Record<string, string> = { cuir: 'Cuir', acier: 'Acier', caoutchouc: 'Caoutchouc' };
  const sizeLabels: Record<string, string> = { grand: 'Grand (42mm+)', moyen: 'Moyen (38–41mm)', compact: 'Compact (≤37mm)' };

  const label = genre === 'homme' ? 'Collection Homme' : genre === 'femme' ? 'Collection Femme' : 'Toutes les Montres';

  const SidebarContent = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '0.6rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)' }}>
          Filtres {activeCount > 0 && `(${activeCount})`}
        </p>
        {activeCount > 0 && (
          <button onClick={() => setFilters({ movement: [], caseMaterial: [], strapType: [], caseSize: [] })}
            style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)' }}
            className="hover:text-[#C9A84C] transition-colors">
            Effacer
          </button>
        )}
      </div>
      <FilterSection title="Mouvement" options={movementOptions.map(v => ({ value: v, label: movLabels[v] || v }))}
        selected={filters.movement} onChange={v => toggleFilter('movement', v as Movement)} />
      <FilterSection title="Boîtier" options={caseMaterialOptions.map(v => ({ value: v, label: matLabels[v] || v }))}
        selected={filters.caseMaterial} onChange={v => toggleFilter('caseMaterial', v as CaseMaterial)} />
      <FilterSection title="Bracelet" options={strapOptions.map(v => ({ value: v, label: strapLabels[v] || v }))}
        selected={filters.strapType} onChange={v => toggleFilter('strapType', v as StrapType)} />
      <FilterSection title="Taille" options={caseSizeOptions.map(v => ({ value: v, label: sizeLabels[v] || v }))}
        selected={filters.caseSize} onChange={v => toggleFilter('caseSize', v as CaseSize)} />
    </div>
  );

  return (
    <div style={{ background: '#0C0A08', color: '#F5F0E8', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div className="relative pt-28 sm:pt-32 pb-10 px-6 overflow-hidden" style={{ background: '#09070A' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.07) 0%, transparent 55%)',
        }} />
        <div className="h-[2px] absolute top-0 left-0 right-0"
          style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }} />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="label-victorian mb-4">✦ &nbsp; {genre === 'homme' ? 'Horlogerie Masculine' : genre === 'femme' ? 'Horlogerie Féminine' : 'Toutes Catégories'} &nbsp; ✦</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
            {label}
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.3)', letterSpacing: '0.25em' }}>
            {filtered.length} pièce{filtered.length !== 1 ? 's' : ''} {activeCount > 0 ? 'filtrées' : 'disponibles'}
          </p>
        </div>
      </div>

      <div className="vr-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Mobile filter button */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.4)', letterSpacing: '0.2em' }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </p>
          <button onClick={() => setMobileFilterOpen(true)} className="btn-victorian flex items-center gap-2"
            style={{ padding: '0.6rem 1.2rem' }}>
            <FiFilter style={{ fontSize: '0.75rem' }} />
            Filtres {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>

        <div className="flex gap-10">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24 self-start">
            <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '1.5rem' }}>
              <SidebarContent />
            </div>
          </aside>

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="flex-1 text-center py-24">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: 'rgba(245,240,232,0.2)', marginBottom: '1.5rem' }}>
                Aucune pièce trouvée
              </p>
              <button onClick={() => setFilters({ movement: [], caseMaterial: [], strapType: [], caseSize: [] })}
                className="btn-victorian">Effacer les filtres</button>
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="visible"
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map(product => {
                const disc = product.discount ? getDiscountedPrice(product.price, product.discount) : null;
                return (
                  <motion.div key={product.id} variants={fadeUp}>
                    <Link href={`/produit/${product.id}`}>
                      <div className="card-victorian cursor-pointer overflow-hidden group h-full flex flex-col">
                        <div className="watch-display aspect-square flex items-center justify-center p-7 sm:p-9 relative">
                          <img src={product.images[0]} alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                            style={{ maxHeight: '100%', maxWidth: '100%', filter: 'drop-shadow(0 10px 35px rgba(0,0,0,0.7))' }} />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.discount && (
                              <span className="promo-badge text-[7px] tracking-[0.2em] uppercase px-2 py-0.5 font-medium"
                                style={{ background: '#C9A84C', color: '#0C0A08' }}>-{product.discount}%</span>
                            )}
                            {product.isNew && (
                              <span className="text-[7px] tracking-[0.2em] uppercase px-2 py-0.5"
                                style={{ background: '#1C1408', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>Nouveau</span>
                            )}
                            {!product.inStock && (
                              <span className="text-[7px] tracking-[0.2em] uppercase px-2 py-0.5"
                                style={{ background: 'rgba(100,20,20,0.8)', color: '#F5A0A0' }}>Rupture</span>
                            )}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 flex-1 flex flex-col" style={{ borderTop: '1px solid rgba(201,168,76,0.13)' }}>
                          <p className="label-victorian mb-2" style={{ fontSize: '0.53rem' }}>
                            {product.movement === 'automatique' ? 'Mécanique Auto.' : 'Quartz'}
                            {product.caseMaterial && ` · ${matLabels[product.caseMaterial]}`}
                          </p>
                          <h3 className="flex-1 mb-3 group-hover:text-[#C9A84C] transition-colors"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400, letterSpacing: '0.02em' }}>
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="gold-text" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                              {disc ? formatPrice(disc) : formatPrice(product.price)}
                            </span>
                            {disc && (
                              <span style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.22)', textDecoration: 'line-through' }}>
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div className="fixed inset-0 z-50 flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setMobileFilterOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-72 h-full overflow-y-auto p-7" style={{ background: '#0E0C08', borderRight: '1px solid rgba(201,168,76,0.18)' }}>
              <div className="h-[2px] absolute top-0 left-0 right-0"
                style={{ background: 'linear-gradient(to right, #C9A84C, #E2C87A, #C9A84C)' }} />
              <div className="flex items-center justify-between mb-8">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.05em' }}>Filtres</p>
                <button onClick={() => setMobileFilterOpen(false)} style={{ color: 'rgba(245,240,232,0.4)' }}
                  className="hover:text-[#C9A84C] transition-colors"><FiX /></button>
              </div>
              <SidebarContent />
              <button onClick={() => setMobileFilterOpen(false)} className="btn-victorian-filled w-full mt-4">
                Appliquer ({filtered.length})
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
