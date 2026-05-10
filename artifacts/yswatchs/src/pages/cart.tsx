import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { FiTrash2, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/data";
import Navbar from "@/components/layout/navbar";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ys-bg)', color: 'var(--ys-text)', transition: 'background 0.45s, color 0.45s' }}>
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-14 gap-4">
            <div>
              <p className="label-victorian mb-3" style={{ fontSize: '0.58rem' }}>Votre sélection</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '0.03em', color: 'var(--ys-text)' }}>
                Panier{" "}
                {totalItems > 0 && (
                  <span style={{ color: 'var(--ys-text-dim)', fontSize: '0.55em' }}>({totalItems})</span>
                )}
              </h1>
            </div>
            <Link href="/"
              className="inline-flex items-center gap-2 hover:text-[var(--ys-gold)] transition-colors"
              style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif", color: 'var(--ys-text-muted)' }}
            >
              <FiArrowLeft />
              Continuer les achats
            </Link>
          </div>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 sm:py-32">
              <div className="w-16 h-[1px] mx-auto mb-10" style={{ background: 'var(--ys-border)' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: 'var(--ys-text-dim)', marginBottom: '1rem' }}>
                Votre panier est vide
              </p>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--ys-text-muted)', fontFamily: "'Jost', sans-serif", marginBottom: '3rem' }}>
                Découvrez nos collections exceptionnelles
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/montres/homme">
                  <button className="btn-victorian-filled">Collection Homme</button>
                </Link>
                <Link href="/collections">
                  <button className="btn-victorian">Toutes les collections</button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
              {/* Items */}
              <div className="lg:col-span-2">
                <div style={{ borderTop: '1px solid var(--ys-border)' }}>
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, overflow: 'hidden' }}
                        className="flex gap-4 sm:gap-6 py-6 sm:py-8"
                        style={{ borderBottom: '1px solid var(--ys-border)' }}
                      >
                        <Link href={`/produit/${item.product.id}`} className="flex-shrink-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-2 watch-display"
                            style={{ border: '1px solid var(--ys-border)', width: '88px', height: '88px' }}>
                            <img src={item.product.images[0]} alt={item.product.name}
                              className="w-full h-full object-contain" style={{ filter: 'var(--ys-img-filter)' }} />
                          </div>
                        </Link>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="label-victorian mb-1" style={{ fontSize: '0.52rem' }}>
                                {item.product.category === 'homme' ? 'Collection Homme' : 'Collection Femme'}
                              </p>
                              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 400, letterSpacing: '0.02em', color: 'var(--ys-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.product.name}
                              </h3>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="hover:text-red-500 transition-colors flex-shrink-0 mt-1"
                              style={{ color: 'var(--ys-text-dim)' }}
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                            <div className="flex items-center" style={{ border: '1px solid var(--ys-border)', background: 'var(--ys-input-bg)', transition: 'background 0.45s' }}>
                              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-3 py-2 hover:text-[var(--ys-gold)] transition-colors text-sm"
                                style={{ color: 'var(--ys-text-muted)' }}>−</button>
                              <span className="px-3 text-sm min-w-[1.5rem] text-center" style={{ color: 'var(--ys-text)' }}>
                                {item.quantity}
                              </span>
                              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-3 py-2 hover:text-[var(--ys-gold)] transition-colors text-sm"
                                style={{ color: 'var(--ys-text-muted)' }}>+</button>
                            </div>
                            <p className="gold-text text-sm tracking-wider font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="pt-5">
                  <button onClick={clearCart}
                    className="hover:text-[var(--ys-gold)] transition-colors"
                    style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ys-text-dim)', fontFamily: "'Jost', sans-serif", background: 'none', border: 'none', cursor: 'pointer' }}>
                    Vider le panier
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div>
                <div className="sticky top-28 p-6 sm:p-8 relative" style={{ background: 'var(--ys-surface)', border: '1px solid var(--ys-border)', transition: 'background 0.45s' }}>
                  {/* corner ornaments */}
                  {[['top-2 left-2', '1px 0 0 1px'], ['top-2 right-2', '1px 1px 0 0'], ['bottom-2 left-2', '0 0 1px 1px'], ['bottom-2 right-2', '0 1px 1px 0']].map(([pos, bw], i) => (
                    <div key={i} className={`absolute ${pos}`} style={{ width: '10px', height: '10px', borderWidth: bw, borderStyle: 'solid', borderColor: 'var(--ys-border-hover)' }} />
                  ))}
                  <p className="label-victorian mb-7" style={{ fontSize: '0.58rem' }}>Récapitulatif</p>

                  <div className="space-y-4 mb-7">
                    <div className="flex justify-between" style={{ fontSize: '0.8rem', color: 'var(--ys-text-muted)' }}>
                      <span>Sous-total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: '0.8rem', color: 'var(--ys-text-muted)' }}>
                      <span>Livraison</span>
                      <span style={{ color: '#5DBE80' }}>Offerte</span>
                    </div>
                    <div className="vr-gold" />
                    <div className="flex justify-between items-center">
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 300, color: 'var(--ys-text)' }}>Total</span>
                      <span className="gold-text" style={{ fontSize: '1.1rem', letterSpacing: '0.05em', fontWeight: 500 }}>
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => navigate('/commande')} className="btn-victorian-filled w-full"
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Passer la commande <FiArrowRight />
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.55rem', color: 'var(--ys-text-dim)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '1rem', fontFamily: "'Jost', sans-serif" }}>
                    Livraison offerte · Retour 14 jours
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
