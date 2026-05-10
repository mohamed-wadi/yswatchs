import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { FiSearch, FiX } from "react-icons/fi";
import { products, formatPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

const suggestions = ["Benyar", "Pagani", "Quartz", "Acier", "Or rose", "Automatique", "Chronographe"];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = query.trim().length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ys-bg)', color: 'var(--ys-text)', transition: 'background 0.45s, color 0.45s' }}>
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 sm:mb-16">
            <p className="label-victorian mb-5" style={{ display: 'block' }}>✦ &nbsp; Recherche &nbsp; ✦</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '0.04em', marginBottom: '2rem', color: 'var(--ys-text)' }}>
              Trouver une pièce
            </h1>

            <div className="relative" style={{ borderBottom: '2px solid var(--ys-border)' }}>
              <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-xl" style={{ color: 'var(--ys-text-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Nom, collection, mouvement..."
                className="w-full bg-transparent pl-8 pr-10 py-4 sm:py-5 text-lg sm:text-xl focus:outline-none"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: 'var(--ys-text)',
                  background: 'transparent',
                  letterSpacing: '0.02em',
                }}
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-0 top-1/2 -translate-y-1/2 hover:text-[var(--ys-gold)] transition-colors"
                  style={{ color: 'var(--ys-text-dim)' }}>
                  <FiX />
                </button>
              )}
            </div>
          </motion.div>

          {query.trim().length > 0 && query.trim().length < 2 && (
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: 'var(--ys-text-muted)', fontFamily: "'Jost', sans-serif" }}>
              Continuez à taper...
            </p>
          )}

          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div key={query} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <p className="label-victorian mb-7" style={{ fontSize: '0.58rem', display: 'block' }}>
                  {results.length} résultat{results.length > 1 ? 's' : ''} pour "{query}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {results.map(product => (
                    <Link key={product.id} href={`/produit/${product.id}`}>
                      <div className="card-victorian group flex gap-4 sm:gap-5 p-4 cursor-pointer overflow-hidden">
                        <div className="watch-display flex-shrink-0 flex items-center justify-center p-2"
                          style={{ width: '76px', height: '76px', border: '1px solid var(--ys-border)' }}>
                          <img src={product.images[0]} alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            style={{ filter: 'var(--ys-img-filter)' }} />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <p className="label-victorian mb-1" style={{ fontSize: '0.5rem' }}>
                            {product.category === 'homme' ? 'Collection Homme' : 'Collection Femme'}
                          </p>
                          <h3 className="group-hover:text-[var(--ys-gold)] transition-colors truncate mb-1"
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400, color: 'var(--ys-text)' }}>
                            {product.name}
                          </h3>
                          <p className="gold-text" style={{ fontSize: '0.9rem' }}>{formatPrice(product.price)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {query.trim().length >= 2 && results.length === 0 && (
              <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: 'var(--ys-text-dim)', marginBottom: '1rem' }}>
                  Aucun résultat
                </p>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--ys-text-muted)', fontFamily: "'Jost', sans-serif", marginBottom: '2.5rem' }}>
                  Essayez "Benyar", "Pagani", "Chronographe"...
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/montres/homme">
                    <button className="btn-victorian">Collection Homme</button>
                  </Link>
                  <Link href="/collections">
                    <button className="btn-victorian">Toutes les collections</button>
                  </Link>
                </div>
              </motion.div>
            )}

            {!query && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                <p className="label-victorian mb-5" style={{ fontSize: '0.58rem', display: 'block' }}>Suggestions</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => setQuery(s)}
                      className="hover:text-[var(--ys-gold)] hover:border-[var(--ys-gold)] transition-colors"
                      style={{
                        border: '1px solid var(--ys-border)',
                        color: 'var(--ys-text-muted)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '0.6rem 1.2rem',
                        background: 'var(--ys-surface)',
                        fontFamily: "'Jost', sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
