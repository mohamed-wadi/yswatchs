import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiTag, FiHeart } from "react-icons/fi";
import { products, formatPrice, getDiscountedPrice, type Category, type Movement, type CaseMaterial, type StrapType, type CaseSize } from "@/lib/data";
import { useWishlist } from "@/hooks/use-wishlist";
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

/* ── Icons for filter groups ────────────────────────── */
const groupIcons: Record<string, string> = {
  Mouvement: '⚙',
  Boîtier: '⬡',
  Bracelet: '⌒',
  Taille: '◎',
};

function FilterSection({ title, options, selected, onChange }: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(true);
  if (options.length === 0) return null;
  const hasActive = selected.length > 0;

  return (
    <div style={{
      marginBottom: '0.25rem',
      borderRadius: 0,
      overflow: 'hidden',
      border: '1px solid var(--ys-border)',
      background: hasActive ? 'var(--ys-gold-glow)' : 'transparent',
      transition: 'background 0.3s',
    }}>
      {/* Group header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full"
        style={{
          padding: '0.75rem 0.9rem',
          background: 'transparent',
          cursor: 'pointer',
          gap: '0.5rem',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: '0.9rem', color: 'var(--ys-gold)', opacity: 0.7, lineHeight: 1 }}>
            {groupIcons[title] ?? '·'}
          </span>
          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            fontWeight: hasActive ? 500 : 400,
            color: hasActive ? 'var(--ys-gold)' : 'var(--ys-text)',
            transition: 'color 0.25s, font-weight 0.25s',
          }}>
            {title}
          </span>
          {hasActive && (
            <span style={{
              fontSize: '0.52rem',
              fontFamily: "'Jost', sans-serif",
              background: 'var(--ys-gold)',
              color: 'var(--ys-bg)',
              borderRadius: '999px',
              padding: '0.1em 0.5em',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}>
              {selected.length}
            </span>
          )}
        </div>
        {open
          ? <FiChevronUp style={{ fontSize: '0.8rem', color: 'var(--ys-gold)', opacity: 0.6, flexShrink: 0 }} />
          : <FiChevronDown style={{ fontSize: '0.8rem', color: 'var(--ys-text-muted)', flexShrink: 0 }} />
        }
      </button>

      {/* Options */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0.25rem 0.9rem 0.85rem',
              borderTop: '1px solid var(--ys-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}>
              {options.map(opt => {
                const active = selected.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--ys-border)',
                      transition: 'background 0.2s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => onChange(opt.value)}
                      className="filter-checkbox"
                    />
                    <span style={{
                      fontSize: '0.8rem',
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: active ? 500 : 300,
                      letterSpacing: '0.07em',
                      color: active ? 'var(--ys-gold)' : 'var(--ys-text)',
                      transition: 'color 0.2s, font-weight 0.2s',
                      flex: 1,
                    }}>
                      {opt.label}
                    </span>
                    {active && (
                      <span style={{ fontSize: '0.6rem', color: 'var(--ys-gold)', flexShrink: 0 }}>✓</span>
                    )}
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Active filter pills ────────────────────────────── */
function ActivePills({ filters, toggleFilter, clearAll }: {
  filters: Filters;
  toggleFilter: <K extends keyof Filters>(key: K, v: Filters[K][number]) => void;
  clearAll: () => void;
}) {
  const allActive = [
    ...filters.movement.map(v => ({ key: 'movement' as const, v, label: movLabels[v] || v })),
    ...filters.caseMaterial.map(v => ({ key: 'caseMaterial' as const, v, label: matLabels[v] || v })),
    ...filters.strapType.map(v => ({ key: 'strapType' as const, v, label: strapLabels[v] || v })),
    ...filters.caseSize.map(v => ({ key: 'caseSize' as const, v, label: sizeLabels[v] || v })),
  ];
  if (allActive.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ys-text-muted)', fontFamily: "'Jost', sans-serif", marginRight: '0.25rem' }}>
        Actifs:
      </span>
      {allActive.map(({ key, v, label }) => (
        <button key={`${key}-${v}`}
          onClick={() => toggleFilter(key, v as never)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.62rem', fontFamily: "'Jost', sans-serif",
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.3em 0.65em',
            background: 'var(--ys-gold-dim)',
            border: '1px solid var(--ys-gold)',
            color: 'var(--ys-gold)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="hover:opacity-70"
        >
          {label} <FiX style={{ fontSize: '0.6rem' }} />
        </button>
      ))}
      <button onClick={clearAll}
        style={{
          fontSize: '0.58rem', fontFamily: "'Jost', sans-serif",
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--ys-text-muted)', cursor: 'pointer',
          background: 'none', border: 'none', padding: '0.3em 0.4em',
          transition: 'color 0.2s',
        }}
        className="hover:text-[var(--ys-gold)]"
      >
        Tout effacer
      </button>
    </div>
  );
}

const movLabels: Record<string, string> = { automatique: 'Automatique', manuel: 'Manuel', quartz: 'Quartz' };
const matLabels: Record<string, string> = { acier: 'Acier 316L', 'or-jaune': 'Or jaune', 'or-rose': 'Or rose', platine: 'Platine' };
const strapLabels: Record<string, string> = { cuir: 'Cuir', acier: 'Acier', caoutchouc: 'Caoutchouc' };
const sizeLabels: Record<string, string> = { grand: 'Grand (42mm+)', moyen: 'Moyen (38–41mm)', compact: 'Compact (≤37mm)' };

export default function CataloguePage() {
  const [, params] = useRoute("/montres/:genre");
  const genre = params?.genre as Category | undefined;
  const [filters, setFilters] = useState<Filters>({ movement: [], caseMaterial: [], strapType: [], caseSize: [] });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

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

  const clearAll = () => setFilters({ movement: [], caseMaterial: [], strapType: [], caseSize: [] });
  const activeCount = Object.values(filters).reduce((s, a) => s + a.length, 0);

  const filtered = catProducts.filter(p => {
    if (filters.movement.length && p.movement && !filters.movement.includes(p.movement)) return false;
    if (filters.caseMaterial.length && p.caseMaterial && !filters.caseMaterial.includes(p.caseMaterial)) return false;
    if (filters.strapType.length && p.strapType && !filters.strapType.includes(p.strapType)) return false;
    if (filters.caseSize.length && p.caseSize && !filters.caseSize.includes(p.caseSize)) return false;
    return true;
  });

  const label = genre === 'homme' ? 'Collection Homme' : genre === 'femme' ? 'Collection Femme' : 'Toutes les Montres';

  const SidebarContent = () => (
    <div>
      {/* Sidebar header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '2px solid var(--ys-gold)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiFilter style={{ color: 'var(--ys-gold)', fontSize: '0.75rem' }} />
          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.62rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'var(--ys-text)',
            fontWeight: 500,
          }}>
            Filtrer
          </span>
          {activeCount > 0 && (
            <span style={{
              fontSize: '0.52rem',
              fontFamily: "'Jost', sans-serif",
              background: 'var(--ys-gold)',
              color: 'var(--ys-bg)',
              borderRadius: '999px',
              padding: '0.1em 0.55em',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll}
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--ys-gold)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Jost', sans-serif",
              opacity: 0.7,
            }}
            className="hover:opacity-100 transition-opacity">
            Effacer tout
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <FilterSection title="Mouvement"
          options={movementOptions.map(v => ({ value: v, label: movLabels[v] || v }))}
          selected={filters.movement} onChange={v => toggleFilter('movement', v as Movement)} />
        <FilterSection title="Boîtier"
          options={caseMaterialOptions.map(v => ({ value: v, label: matLabels[v] || v }))}
          selected={filters.caseMaterial} onChange={v => toggleFilter('caseMaterial', v as CaseMaterial)} />
        <FilterSection title="Bracelet"
          options={strapOptions.map(v => ({ value: v, label: strapLabels[v] || v }))}
          selected={filters.strapType} onChange={v => toggleFilter('strapType', v as StrapType)} />
        <FilterSection title="Taille"
          options={caseSizeOptions.map(v => ({ value: v, label: sizeLabels[v] || v }))}
          selected={filters.caseSize} onChange={v => toggleFilter('caseSize', v as CaseSize)} />
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--ys-bg)', color: 'var(--ys-text)', minHeight: '100vh', transition: 'background 0.45s, color 0.45s' }}>
      <Navbar />

      {/* Header */}
      <div className="relative pt-28 sm:pt-32 pb-10 px-6 overflow-hidden"
        style={{ background: 'var(--ys-surface)', transition: 'background 0.45s' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, var(--ys-gold-glow) 0%, transparent 55%)',
        }} />
        <div className="h-[2px] absolute top-0 left-0 right-0"
          style={{ background: 'linear-gradient(to right, transparent, var(--ys-gold), transparent)', opacity: 0.4 }} />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="label-victorian mb-4">✦ &nbsp; {genre === 'homme' ? 'Horlogerie Masculine' : genre === 'femme' ? 'Horlogerie Féminine' : 'Toutes Catégories'} &nbsp; ✦</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 300, letterSpacing: '0.04em', marginBottom: '0.5rem', color: 'var(--ys-text)' }}>
            {label}
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--ys-text-muted)', letterSpacing: '0.25em' }}>
            {filtered.length} pièce{filtered.length !== 1 ? 's' : ''} {activeCount > 0 ? 'filtrées' : 'disponibles'}
          </p>
        </div>
      </div>

      <div className="vr-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Mobile filter button */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <p style={{ fontSize: '0.7rem', color: 'var(--ys-text-muted)', letterSpacing: '0.2em' }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </p>
          <button onClick={() => setMobileFilterOpen(true)} className="btn-victorian flex items-center gap-2"
            style={{ padding: '0.6rem 1.2rem' }}>
            <FiFilter style={{ fontSize: '0.75rem' }} />
            Filtres {activeCount > 0 && (
              <span style={{
                background: 'var(--ys-gold)', color: 'var(--ys-bg)',
                fontSize: '0.52rem', fontWeight: 700,
                borderRadius: '999px', padding: '0.1em 0.5em',
              }}>{activeCount}</span>
            )}
          </button>
        </div>

        {/* Active filter pills (above grid on mobile) */}
        <div className="lg:hidden mb-2">
          <ActivePills filters={filters} toggleFilter={toggleFilter} clearAll={clearAll} />
        </div>

        <div className="flex gap-8 xl:gap-12">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
            <SidebarContent />
            <div style={{ marginTop: '1rem' }}>
              <ActivePills filters={filters} toggleFilter={toggleFilter} clearAll={clearAll} />
            </div>
          </aside>

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="flex-1 text-center py-24">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: 'var(--ys-text-dim)', marginBottom: '1.5rem' }}>
                Aucune pièce trouvée
              </p>
              <button onClick={clearAll} className="btn-victorian">Effacer les filtres</button>
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="visible"
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map(product => {
                const disc = product.discount ? getDiscountedPrice(product.price, product.discount) : null;
                return (
                  <motion.div key={product.id} variants={fadeUp}>
                    <div className="card-victorian overflow-hidden group h-full flex flex-col relative">
                      {/* Wishlist heart */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
                        className="absolute top-3 right-3 z-10 flex items-center justify-center transition-all duration-250"
                        style={{
                          width: '30px', height: '30px',
                          background: isWishlisted(product.id) ? 'var(--ys-gold-dim)' : 'var(--ys-surface)',
                          border: `1px solid ${isWishlisted(product.id) ? 'var(--ys-gold)' : 'var(--ys-border)'}`,
                          color: isWishlisted(product.id) ? 'var(--ys-gold)' : 'var(--ys-text-dim)',
                        }}
                        title={isWishlisted(product.id) ? 'Retirer de la liste' : 'Ajouter à la liste de souhaits'}
                      >
                        <FiHeart style={{ fontSize: '0.75rem', fill: isWishlisted(product.id) ? 'var(--ys-gold)' : 'none' }} />
                      </button>
                      <Link href={`/produit/${product.id}`} className="flex flex-col h-full">
                        <div className="watch-display aspect-square flex items-center justify-center p-7 sm:p-9 relative cursor-pointer">
                          <img src={product.images[0]} alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                            style={{ maxHeight: '100%', maxWidth: '100%', filter: 'var(--ys-img-filter)' }} />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.discount && (
                              <span className="promo-badge text-[7px] tracking-[0.2em] uppercase px-2 py-0.5 font-medium"
                                style={{ background: 'var(--ys-gold)', color: 'var(--ys-bg)' }}>-{product.discount}%</span>
                            )}
                            {product.isNew && (
                              <span className="text-[7px] tracking-[0.2em] uppercase px-2 py-0.5"
                                style={{ background: 'var(--ys-surface-2)', color: 'var(--ys-gold)', border: '1px solid var(--ys-border)' }}>
                                Nouveau
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="text-[7px] tracking-[0.2em] uppercase px-2 py-0.5"
                                style={{ background: 'rgba(100,20,20,0.8)', color: '#F5A0A0' }}>Rupture</span>
                            )}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 flex-1 flex flex-col" style={{ borderTop: '1px solid var(--ys-border)' }}>
                          <p className="label-victorian mb-2" style={{ fontSize: '0.53rem' }}>
                            {product.movement === 'automatique' ? 'Mécanique Auto.' : 'Quartz'}
                            {product.caseMaterial && ` · ${matLabels[product.caseMaterial]}`}
                          </p>
                          <h3 className="flex-1 mb-3 group-hover:text-[var(--ys-gold)] transition-colors"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400, letterSpacing: '0.02em', color: 'var(--ys-text)' }}>
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="gold-text" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                              {disc ? formatPrice(disc) : formatPrice(product.price)}
                            </span>
                            {disc && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--ys-text-dim)', textDecoration: 'line-through' }}>
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
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
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={() => setMobileFilterOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-80 h-full overflow-y-auto p-6"
              style={{ background: 'var(--ys-surface)', borderRight: '1px solid var(--ys-border)' }}>
              <div className="h-[2px] absolute top-0 left-0 right-0"
                style={{ background: 'linear-gradient(to right, var(--ys-gold), var(--ys-gold-light), var(--ys-gold))' }} />
              <div className="flex items-center justify-between mb-6">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.05em', color: 'var(--ys-text)' }}>
                  Affiner la sélection
                </p>
                <button onClick={() => setMobileFilterOpen(false)} style={{ color: 'var(--ys-text-muted)' }}
                  className="hover:text-[var(--ys-gold)] transition-colors"><FiX /></button>
              </div>
              <SidebarContent />
              <button onClick={() => setMobileFilterOpen(false)} className="btn-victorian-filled w-full mt-6"
                style={{ width: '100%', justifyContent: 'center' }}>
                <FiTag style={{ fontSize: '0.7rem' }} />
                Voir {filtered.length} pièce{filtered.length !== 1 ? 's' : ''}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
