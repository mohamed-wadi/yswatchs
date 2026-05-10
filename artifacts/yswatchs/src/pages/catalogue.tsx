import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { products, formatPrice, getDiscountedPrice, type Category, type Movement, type CaseMaterial, type StrapType, type DialColor, type CaseSize } from "@/lib/data";
import { montre1, montre2 } from "@/lib/watch-images";
import Navbar from "@/components/layout/navbar";
import MarqueeStrip from "@/components/MarqueeStrip";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

interface Filters {
  quick: 'all' | 'new' | 'bestseller' | 'instock' | 'promo';
  movement: Movement | 'all';
  caseMaterial: CaseMaterial | 'all';
  strapType: StrapType | 'all';
  dialColor: DialColor | 'all';
  caseSize: CaseSize | 'all';
}

const defaultFilters: Filters = {
  quick: 'all',
  movement: 'all',
  caseMaterial: 'all',
  strapType: 'all',
  dialColor: 'all',
  caseSize: 'all',
};

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-foreground/60 font-medium">{title}</span>
        {open ? <FiChevronUp className="text-foreground/40 text-sm" /> : <FiChevronDown className="text-foreground/40 text-sm" />}
      </button>
      {open && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left text-xs py-1.5 px-2 transition-all duration-200 ${
        active
          ? 'text-[#c9a84c] bg-[#c9a84c]/8 border-l-2 border-[#c9a84c] pl-3'
          : 'text-foreground/55 hover:text-foreground/80 hover:bg-foreground/4'
      }`}
    >
      {label}
    </button>
  );
}

const movementLabels: Record<Movement, string> = {
  automatique: 'Automatique',
  manuel: 'Manuel',
  quartz: 'Quartz',
};
const caseMaterialLabels: Record<CaseMaterial, string> = {
  'acier': 'Acier inoxydable',
  'or-jaune': 'Or jaune',
  'or-rose': 'Or rose',
  'platine': 'Platine',
};
const strapTypeLabels: Record<StrapType, string> = {
  cuir: 'Cuir',
  acier: 'Bracelet acier',
  caoutchouc: 'Caoutchouc',
};
const dialColorLabels: Record<DialColor, string> = {
  blanc: 'Blanc',
  bleu: 'Bleu',
  noir: 'Noir',
  nacre: 'Nacre',
  brun: 'Brun',
};
const caseSizeLabels: Record<CaseSize, string> = {
  grand: 'Grand modèle',
  moyen: 'Taille moyenne',
  compact: 'Compact',
};

export default function CataloguePage() {
  const [matchHomme] = useRoute("/montres/homme");
  const category: Category = matchHomme ? "homme" : "femme";
  const [sort, setSort] = useState<SortOption>('default');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const baseProducts = products.filter(p => p.category === category);

  let filtered = baseProducts;
  if (filters.quick === 'new') filtered = filtered.filter(p => p.isNew);
  if (filters.quick === 'bestseller') filtered = filtered.filter(p => p.isBestSeller);
  if (filters.quick === 'instock') filtered = filtered.filter(p => p.inStock);
  if (filters.quick === 'promo') filtered = filtered.filter(p => !!p.discount);
  if (filters.movement !== 'all') filtered = filtered.filter(p => p.movement === filters.movement);
  if (filters.caseMaterial !== 'all') filtered = filtered.filter(p => p.caseMaterial === filters.caseMaterial);
  if (filters.strapType !== 'all') filtered = filtered.filter(p => p.strapType === filters.strapType);
  if (filters.dialColor !== 'all') filtered = filtered.filter(p => p.dialColor === filters.dialColor);
  if (filters.caseSize !== 'all') filtered = filtered.filter(p => p.caseSize === filters.caseSize);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const heroWatch = category === 'homme' ? montre1 : montre2;

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

  const resetFilters = () => setFilters(defaultFilters);

  const availableMovements = [...new Set(baseProducts.map(p => p.movement).filter(Boolean))] as Movement[];
  const availableMaterials = [...new Set(baseProducts.map(p => p.caseMaterial).filter(Boolean))] as CaseMaterial[];
  const availableStraps = [...new Set(baseProducts.map(p => p.strapType).filter(Boolean))] as StrapType[];
  const availableDialColors = [...new Set(baseProducts.map(p => p.dialColor).filter(Boolean))] as DialColor[];
  const availableSizes = [...new Set(baseProducts.map(p => p.caseSize).filter(Boolean))] as CaseSize[];

  const filterPanel = (
    <div className="w-full">
      {/* Quick filters */}
      <FilterSection title="Sélection rapide">
        {[
          { key: 'all', label: 'Toutes les pièces' },
          { key: 'new', label: 'Nouveautés' },
          { key: 'bestseller', label: 'Best-sellers' },
          { key: 'instock', label: 'En stock' },
          { key: 'promo', label: '⬥ Promotions' },
        ].map(f => (
          <FilterChip
            key={f.key}
            label={f.label}
            active={filters.quick === f.key}
            onClick={() => setFilters(prev => ({ ...prev, quick: f.key as Filters['quick'] }))}
          />
        ))}
      </FilterSection>

      {/* Mouvement */}
      {availableMovements.length > 0 && (
        <FilterSection title="Mouvement">
          <FilterChip label="Tous" active={filters.movement === 'all'} onClick={() => setFilters(p => ({ ...p, movement: 'all' }))} />
          {availableMovements.map(m => (
            <FilterChip key={m} label={movementLabels[m]} active={filters.movement === m} onClick={() => setFilters(p => ({ ...p, movement: m }))} />
          ))}
        </FilterSection>
      )}

      {/* Matière boîtier */}
      {availableMaterials.length > 0 && (
        <FilterSection title="Matière du boîtier">
          <FilterChip label="Toutes" active={filters.caseMaterial === 'all'} onClick={() => setFilters(p => ({ ...p, caseMaterial: 'all' }))} />
          {availableMaterials.map(m => (
            <FilterChip key={m} label={caseMaterialLabels[m]} active={filters.caseMaterial === m} onClick={() => setFilters(p => ({ ...p, caseMaterial: m }))} />
          ))}
        </FilterSection>
      )}

      {/* Bracelet */}
      {availableStraps.length > 0 && (
        <FilterSection title="Bracelet / Bracelet">
          <FilterChip label="Tous" active={filters.strapType === 'all'} onClick={() => setFilters(p => ({ ...p, strapType: 'all' }))} />
          {availableStraps.map(s => (
            <FilterChip key={s} label={strapTypeLabels[s]} active={filters.strapType === s} onClick={() => setFilters(p => ({ ...p, strapType: s }))} />
          ))}
        </FilterSection>
      )}

      {/* Couleur du cadran — femme only */}
      {category === 'femme' && availableDialColors.length > 0 && (
        <FilterSection title="Couleur du cadran">
          <FilterChip label="Toutes" active={filters.dialColor === 'all'} onClick={() => setFilters(p => ({ ...p, dialColor: 'all' }))} />
          {availableDialColors.map(c => (
            <FilterChip key={c} label={dialColorLabels[c]} active={filters.dialColor === c} onClick={() => setFilters(p => ({ ...p, dialColor: c }))} />
          ))}
        </FilterSection>
      )}

      {/* Taille du boîtier */}
      {availableSizes.length > 0 && (
        <FilterSection title="Taille du boîtier" defaultOpen={false}>
          <FilterChip label="Toutes" active={filters.caseSize === 'all'} onClick={() => setFilters(p => ({ ...p, caseSize: 'all' }))} />
          {availableSizes.map(s => (
            <FilterChip key={s} label={caseSizeLabels[s]} active={filters.caseSize === s} onClick={() => setFilters(p => ({ ...p, caseSize: s }))} />
          ))}
        </FilterSection>
      )}

      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="mt-4 w-full text-[9px] tracking-[0.3em] uppercase text-foreground/45 hover:text-[#c9a84c] transition-colors py-2 border border-border hover:border-[#c9a84c]/40"
        >
          Effacer les filtres ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero banner */}
      <div className="relative pt-24 pb-14 sm:pt-32 sm:pb-18 overflow-hidden bg-[#F0E8DC]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EDE4D6] to-[#F5EFE6]" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 text-center sm:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[9px] tracking-[0.55em] uppercase text-[#c9a84c] mb-4 font-medium"
            >
              Collection
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-light text-5xl sm:text-6xl md:text-7xl text-foreground"
            >
              {category === 'homme' ? (
                <>Pour <span className="italic gold-gradient-text">Lui</span></>
              ) : (
                <>Pour <span className="italic gold-gradient-text">Elle</span></>
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-foreground/55 text-xs tracking-[0.2em] mt-4"
            >
              {sorted.length} pièce{sorted.length !== 1 ? 's' : ''} sélectionnée{sorted.length !== 1 ? 's' : ''}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-36 sm:w-44 md:w-52 flex-shrink-0"
          >
            <img
              src={heroWatch}
              alt=""
              className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            />
          </motion.div>
        </div>
      </div>

      <MarqueeStrip />

      {/* Mobile filter button */}
      <div className="lg:hidden flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-background">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-foreground/60 hover:text-[#c9a84c] transition-colors"
        >
          <FiFilter />
          Filtrer
          {activeFilterCount > 0 && (
            <span className="bg-[#c9a84c] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="bg-white border border-border text-foreground/60 text-[9px] tracking-[0.15em] uppercase px-3 py-2 focus:outline-none focus:border-[#c9a84c]/40"
        >
          <option value="default">Par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom</option>
        </select>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 z-40 lg:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 w-72 bg-background z-50 lg:hidden overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c] font-medium">Filtres</p>
                <button onClick={() => setMobileFilterOpen(false)} className="text-foreground/50 hover:text-foreground">
                  <FiX className="text-xl" />
                </button>
              </div>
              {filterPanel}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main layout: sidebar + grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex gap-10">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#c9a84c] font-medium">Filtres</p>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="text-[8px] tracking-[0.2em] uppercase text-foreground/40 hover:text-[#c9a84c] transition-colors">
                    Effacer ({activeFilterCount})
                  </button>
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Desktop sort bar */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <p className="text-xs text-foreground/50 tracking-wider">
                <span className="text-foreground/80 font-medium">{sorted.length}</span> résultat{sorted.length !== 1 ? 's' : ''}
              </p>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="bg-white border border-border text-foreground/60 text-[9px] tracking-[0.2em] uppercase px-4 py-2 focus:outline-none focus:border-[#c9a84c]/40"
              >
                <option value="default">Par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom</option>
              </select>
            </div>

            {/* Grid */}
            {sorted.length === 0 ? (
              <div className="text-center py-28 text-foreground/35 font-serif text-2xl">Aucun résultat</div>
            ) : (
              <motion.div
                key={`${category}-${JSON.stringify(filters)}-${sort}`}
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {sorted.map(product => (
                  <motion.div key={product.id} variants={fadeUp}>
                    <Link href={`/produit/${product.id}`}>
                      <div className="group border border-border bg-white product-card-hover cursor-pointer overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                        <div className="aspect-square bg-[#F8F5EF] overflow-hidden relative flex items-center justify-center p-5 sm:p-6">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                          />
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.discount && (
                              <span className="text-[7px] tracking-[0.2em] uppercase bg-[#c9a84c] text-white px-2 py-1 font-medium promo-badge">
                                -{product.discount}%
                              </span>
                            )}
                            {product.isNew && !product.discount && (
                              <span className="text-[7px] tracking-[0.25em] uppercase bg-[#1C1812] text-white px-2 py-1">
                                Nouveau
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="text-[7px] tracking-[0.25em] uppercase bg-red-500 text-white px-2 py-1">
                                Rupture
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className="font-serif text-base sm:text-lg md:text-xl mb-1.5 group-hover:text-[#c9a84c] transition-colors duration-300 line-clamp-1 text-foreground">
                            {product.name}
                          </h3>
                          <p className="text-foreground/50 text-xs leading-relaxed mb-3 line-clamp-2 hidden sm:block">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[#c9a84c] text-sm tracking-wider font-medium">
                                {product.discount
                                  ? formatPrice(getDiscountedPrice(product.price, product.discount))
                                  : formatPrice(product.price)}
                              </p>
                              {product.discount && (
                                <p className="text-foreground/35 text-xs line-through">{formatPrice(product.price)}</p>
                              )}
                            </div>
                            <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/30 group-hover:text-[#c9a84c]/60 transition-colors hidden sm:block">
                              Voir →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
