import { useState, useRef, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShoppingCart, FiCheck, FiZoomIn } from "react-icons/fi";
import { getProductById, products, formatPrice } from "@/lib/data";
import { useCart } from "@/hooks/use-cart";
import Navbar from "@/components/layout/navbar";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="font-serif text-4xl text-foreground/30 mb-6">Produit introuvable</p>
          <Link href="/" className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase border-b border-[#c9a84c]/40 pb-1">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-24 sm:pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back */}
          <Link
            href={product.category === 'homme' ? "/montres/homme" : product.category === 'femme' ? "/montres/femme" : "/collections"}
            data-testid="link-back"
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-[#c9a84c] transition-colors text-[10px] tracking-[0.3em] uppercase mb-10 sm:mb-12"
          >
            <FiArrowLeft />
            Retour
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            {/* ─── Gallery ─── */}
            <div className="flex flex-row gap-3">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2 sm:gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    data-testid={`thumb-image-${i}`}
                    onClick={() => { setSelectedImage(i); setZoomed(false); }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 border overflow-hidden flex-shrink-0 transition-all duration-300 bg-[#F5F2EC] flex items-center justify-center p-1 ${
                      selectedImage === i
                        ? 'border-[#c9a84c]/60 shadow-[0_0_0_1px_rgba(201,168,76,0.3)]'
                        : 'border-border opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Main image with zoom */}
              <div className="flex-1 relative">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  ref={imgContainerRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setZoomed(true)}
                  onMouseLeave={() => setZoomed(false)}
                  className="aspect-square bg-[#F5F2EC] overflow-hidden cursor-zoom-in relative flex items-center justify-center p-6 sm:p-10 border border-border"
                  style={{ userSelect: 'none' }}
                >
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    data-testid="img-product-main"
                    className="w-full h-full object-contain transition-transform duration-150 ease-out drop-shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: zoomed ? 'scale(2.1)' : 'scale(1)',
                    }}
                    draggable={false}
                  />
                  {!zoomed && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/80 border border-border px-2.5 py-1.5 text-[8px] tracking-[0.3em] uppercase text-foreground/40 backdrop-blur-sm">
                      <FiZoomIn className="text-sm" />
                      Zoom
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* ─── Info ─── */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Badges */}
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                  <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70">
                    {product.category === 'homme' ? 'Collection Homme' : product.category === 'femme' ? 'Collection Femme' : product.category}
                  </p>
                  {product.isNew && (
                    <span className="text-[7px] tracking-[0.3em] uppercase bg-[#c9a84c] text-white px-2 py-1">
                      Nouveau
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="text-[7px] tracking-[0.3em] uppercase bg-red-500 text-white px-2 py-1">
                      Rupture de stock
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl mb-5">{product.name}</h1>

                <p data-testid="text-product-price" className="text-[#c9a84c] text-2xl sm:text-3xl tracking-wider mb-7">
                  {formatPrice(product.price)}
                </p>

                <div className="w-full h-[1px] bg-border mb-7" />

                <p className="text-foreground/55 leading-relaxed text-sm mb-8">
                  {product.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 p-5 bg-[#F5F2EC] border border-border">
                  {[
                    { label: "Référence", value: `YS-${product.id.toUpperCase()}` },
                    { label: "Boîtier", value: "Acier inoxydable 316L" },
                    { label: "Mouvement", value: "Automatique Swiss Made" },
                    { label: "Étanchéité", value: "50 mètres" },
                  ].map(spec => (
                    <div key={spec.label}>
                      <p className="text-[8px] tracking-[0.35em] uppercase text-foreground/30 mb-1">{spec.label}</p>
                      <p className="text-xs text-foreground/65">{spec.value}</p>
                    </div>
                  ))}
                </div>

                <div className="w-full h-[1px] bg-border mb-7" />

                {/* Qty + Add to cart */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center border border-border bg-white">
                    <button
                      data-testid="button-qty-minus"
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3 sm:px-4 py-3 text-foreground/40 hover:text-foreground transition-colors text-lg leading-none"
                    >
                      −
                    </button>
                    <span data-testid="text-qty" className="px-3 sm:px-4 text-sm min-w-[2rem] text-center">{qty}</span>
                    <button
                      data-testid="button-qty-plus"
                      onClick={() => setQty(q => q + 1)}
                      className="px-3 sm:px-4 py-3 text-foreground/40 hover:text-foreground transition-colors text-lg leading-none"
                    >
                      +
                    </button>
                  </div>

                  <button
                    data-testid="button-add-to-cart"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-400 ${
                      product.inStock
                        ? added
                          ? 'bg-green-100 border border-green-400 text-green-700'
                          : 'bg-foreground text-background hover:bg-[#c9a84c] hover:text-white'
                        : 'bg-muted border border-border text-foreground/30 cursor-not-allowed'
                    }`}
                  >
                    {added ? (
                      <><FiCheck /> Ajouté au panier</>
                    ) : (
                      <><FiShoppingCart /> {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}</>
                    )}
                  </button>
                </div>

                {product.inStock && (
                  <p className="text-[9px] text-foreground/30 tracking-widest mt-4 text-center">
                    Livraison offerte · Retour sous 14 jours
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* ─── Related ─── */}
          {related.length > 0 && (
            <div className="mt-24 sm:mt-32">
              <div className="flex items-center gap-6 mb-12">
                <div className="h-[1px] flex-1 bg-border" />
                <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/60 whitespace-nowrap">Vous aimerez aussi</p>
                <div className="h-[1px] flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                {related.map(rel => (
                  <Link key={rel.id} href={`/produit/${rel.id}`} data-testid={`card-related-${rel.id}`}>
                    <div className="group border border-border bg-white product-card-hover cursor-pointer overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                      <div className="aspect-square bg-[#F5F2EC] overflow-hidden flex items-center justify-center p-6">
                        <img
                          src={rel.images[0]}
                          alt={rel.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-xl mb-1 group-hover:text-[#c9a84c] transition-colors">{rel.name}</h3>
                        <p className="text-[#c9a84c] text-sm">{formatPrice(rel.price)}</p>
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
