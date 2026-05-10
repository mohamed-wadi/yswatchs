import { useState, useRef, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShoppingCart, FiCheck, FiZoomIn, FiTag } from "react-icons/fi";
import { getProductById, products, formatPrice, getDiscountedPrice } from "@/lib/data";
import { useCart } from "@/hooks/use-cart";
import Navbar from "@/components/layout/navbar";

const matLabels: Record<string, string> = { acier: 'Acier 316L', 'or-jaune': 'Or jaune', 'or-rose': 'Or rose', platine: 'Platine' };

export default function ProductPage() {
  const [, params] = useRoute("/produit/:id");
  const product = getProductById(params?.id || "");
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const related = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
    setZoomPos({ x, y });
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ys-bg)', color: 'var(--ys-text)' }}>
        <Navbar />
        <div className="text-center">
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: 'var(--ys-text-dim)', marginBottom: '1.5rem' }}>
            Pièce introuvable
          </p>
          <Link href="/" className="btn-victorian">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount ? getDiscountedPrice(product.price, product.discount) : null;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div style={{ background: 'var(--ys-bg)', color: 'var(--ys-text)', minHeight: '100vh', transition: 'background 0.45s, color 0.45s' }}>
      <Navbar />

      <div className="pt-24 sm:pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Back */}
          <Link href="/montres/homme"
            className="inline-flex items-center gap-2 mb-10 sm:mb-12 hover:text-[var(--ys-gold)] transition-colors"
            style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif", color: 'var(--ys-text-muted)' }}>
            <FiArrowLeft /> Retour à la collection
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">

            {/* ─── Gallery ─── */}
            <div className="flex gap-3">
              {product.images.length > 1 && (
                <div className="flex flex-col gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => { setSelectedImage(i); setZoomed(false); }}
                      className="flex-shrink-0 flex items-center justify-center p-1.5 transition-all duration-300"
                      style={{
                        width: '58px', height: '58px',
                        background: 'var(--ys-input-bg)',
                        border: `1px solid ${selectedImage === i ? 'var(--ys-gold)' : 'var(--ys-border)'}`,
                        boxShadow: selectedImage === i ? '0 0 10px var(--ys-gold-dim)' : 'none',
                      }}>
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="flex-1">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  ref={imgContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setZoomed(true)}
                  onMouseLeave={() => setZoomed(false)}
                  className="aspect-square watch-display flex items-center justify-center p-10 sm:p-14 relative cursor-zoom-in"
                  style={{ userSelect: 'none', border: '1px solid var(--ys-border)' }}
                >
                  {[['top-3 left-3', '1px 0 0 1px'], ['top-3 right-3', '1px 1px 0 0'], ['bottom-3 left-3', '0 0 1px 1px'], ['bottom-3 right-3', '0 1px 1px 0']].map(([pos, bw], i) => (
                    <div key={i} className={`absolute ${pos}`} style={{ width: '14px', height: '14px', borderWidth: bw, borderStyle: 'solid', borderColor: 'var(--ys-border-hover)' }} />
                  ))}

                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-150 ease-out"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: zoomed ? 'scale(2.2)' : 'scale(1)',
                      maxHeight: '100%', maxWidth: '100%',
                      filter: 'var(--ys-img-filter)',
                    }}
                    draggable={false}
                  />

                  {!zoomed && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5"
                      style={{ background: 'var(--ys-surface)', border: '1px solid var(--ys-border)', padding: '6px 10px', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--ys-text-muted)', backdropFilter: 'blur(4px)' }}>
                      <FiZoomIn /> Zoom
                    </div>
                  )}
                  {product.discount && (
                    <div className="absolute top-4 left-4 promo-badge"
                      style={{ background: 'var(--ys-gold)', color: 'var(--ys-bg)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 500 }}>
                      -{product.discount}%
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* ─── Info ─── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <p className="label-victorian">
                  {product.category === 'homme' ? 'Collection Homme' : 'Collection Femme'}
                </p>
                {product.isNew && (
                  <span style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', background: 'var(--ys-surface-2)', color: 'var(--ys-gold)', border: '1px solid var(--ys-border)', padding: '3px 8px' }}>
                    Nouveau
                  </span>
                )}
                {product.isBestSeller && (
                  <span style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', background: 'var(--ys-gold-dim)', color: 'var(--ys-gold)', border: '1px solid var(--ys-border)', padding: '3px 8px' }}>
                    Best-seller
                  </span>
                )}
              </div>

              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 300, letterSpacing: '0.03em', marginBottom: '1.5rem', color: 'var(--ys-text)' }}>
                {product.name}
              </h1>

              {discountedPrice ? (
                <div className="mb-7">
                  <div className="flex items-end gap-4 mb-2.5">
                    <p className="gold-text" style={{ fontSize: '2rem', letterSpacing: '0.05em', fontWeight: 400 }}>
                      {formatPrice(discountedPrice)}
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--ys-text-dim)', textDecoration: 'line-through', marginBottom: '4px' }}>
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5"
                    style={{ background: 'var(--ys-gold-glow)', border: '1px solid var(--ys-border)' }}>
                    <FiTag style={{ color: 'var(--ys-gold)', fontSize: '0.75rem' }} />
                    <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ys-gold)', fontFamily: "'Jost', sans-serif" }}>
                      Remise -{product.discount}% · Économie {formatPrice(product.price - discountedPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="gold-text mb-7" style={{ fontSize: '1.8rem', letterSpacing: '0.06em' }}>
                  {formatPrice(product.price)}
                </p>
              )}

              <div className="vr-gold mb-7" />

              <p style={{ color: 'var(--ys-text-muted)', lineHeight: 1.85, fontSize: '0.85rem', letterSpacing: '0.04em', marginBottom: '2rem', fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic' }}>
                {product.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 p-5"
                style={{ background: 'var(--ys-surface)', border: '1px solid var(--ys-border)', transition: 'background 0.45s' }}>
                {[
                  { label: "Référence", value: `YS-${product.id.toUpperCase()}` },
                  { label: "Boîtier", value: product.caseMaterial ? matLabels[product.caseMaterial] : 'Acier 316L' },
                  { label: "Mouvement", value: product.movement === 'automatique' ? 'Automatique' : product.movement === 'quartz' ? 'Quartz' : 'Manuel' },
                  { label: "Étanchéité", value: "50 mètres" },
                ].map(spec => (
                  <div key={spec.label}>
                    <p style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--ys-gold)', opacity: 0.55, marginBottom: '4px', fontFamily: "'Jost', sans-serif" }}>
                      {spec.label}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ys-text)', letterSpacing: '0.06em' }}>
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="vr-gold mb-7" />

              {/* Qty + Cart */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center" style={{ border: '1px solid var(--ys-border)', background: 'var(--ys-input-bg)', transition: 'background 0.45s' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="hover:text-[var(--ys-gold)] transition-colors"
                    style={{ padding: '0.75rem 1rem', color: 'var(--ys-text-muted)', fontSize: '1.1rem', lineHeight: 1 }}>−</button>
                  <span style={{ padding: '0 1rem', fontSize: '0.85rem', minWidth: '2rem', textAlign: 'center', color: 'var(--ys-text)' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="hover:text-[var(--ys-gold)] transition-colors"
                    style={{ padding: '0.75rem 1rem', color: 'var(--ys-text-muted)', fontSize: '1.1rem', lineHeight: 1 }}>+</button>
                </div>

                <button
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 transition-all duration-400"
                  style={{
                    padding: '0.9rem 1.5rem',
                    fontSize: '0.6rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 500,
                    background: !product.inStock
                      ? 'var(--ys-gold-glow)'
                      : added
                      ? 'rgba(40,100,40,0.3)'
                      : 'linear-gradient(135deg, var(--ys-gold), #8A6018)',
                    color: !product.inStock
                      ? 'var(--ys-text-dim)'
                      : added
                      ? '#6FCF97'
                      : 'var(--ys-bg)',
                    border: !product.inStock
                      ? '1px solid var(--ys-border)'
                      : added
                      ? '1px solid rgba(111,207,151,0.4)'
                      : '1px solid var(--ys-gold)',
                    cursor: !product.inStock ? 'not-allowed' : 'pointer',
                  }}
                >
                  {added ? <><FiCheck /> Ajouté</> : <><FiShoppingCart /> {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}</>}
                </button>
              </div>

              {product.inStock && (
                <p style={{ fontSize: '0.55rem', color: 'var(--ys-text-dim)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '1rem', textAlign: 'center', fontFamily: "'Jost', sans-serif" }}>
                  Livraison offerte au Maroc · Retour sous 14 jours
                </p>
              )}
            </motion.div>
          </div>

          {/* ─── Related ─── */}
          {related.length > 0 && (
            <div className="mt-24 sm:mt-32">
              <div className="ornament-divider mb-12">
                <span className="label-victorian whitespace-nowrap">Vous aimerez aussi</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                {related.map(rel => (
                  <Link key={rel.id} href={`/produit/${rel.id}`}>
                    <div className="card-victorian cursor-pointer overflow-hidden group">
                      <div className="watch-display aspect-square flex items-center justify-center p-6 relative">
                        <img src={rel.images[0]} alt={rel.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                          style={{ maxHeight: '100%', maxWidth: '100%', filter: 'var(--ys-img-filter)' }} />
                        {rel.discount && (
                          <span className="absolute top-3 left-3 promo-badge text-[7px] tracking-[0.2em] uppercase px-2 py-0.5 font-medium"
                            style={{ background: 'var(--ys-gold)', color: 'var(--ys-bg)' }}>-{rel.discount}%</span>
                        )}
                      </div>
                      <div className="p-4 sm:p-5" style={{ borderTop: '1px solid var(--ys-border)' }}>
                        <h3 className="mb-2 group-hover:text-[var(--ys-gold)] transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', fontWeight: 400, color: 'var(--ys-text)' }}>
                          {rel.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="gold-text" style={{ fontSize: '0.9rem' }}>
                            {rel.discount ? formatPrice(getDiscountedPrice(rel.price, rel.discount)) : formatPrice(rel.price)}
                          </span>
                          {rel.discount && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--ys-text-dim)', textDecoration: 'line-through' }}>
                              {formatPrice(rel.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
