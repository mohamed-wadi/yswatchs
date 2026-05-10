import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShoppingCart, FiCheck } from "react-icons/fi";
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

  const related = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 3);

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
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-24 pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back */}
          <Link
            href={product.category === 'homme' ? "/montres/homme" : product.category === 'femme' ? "/montres/femme" : "/collections"}
            data-testid="link-back"
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-[#c9a84c] transition-colors text-xs tracking-[0.25em] uppercase mb-12"
          >
            <FiArrowLeft />
            Retour
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Gallery */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    data-testid={`thumb-image-${i}`}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 border overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      selectedImage === i
                        ? 'border-[#c9a84c]/60'
                        : 'border-[rgba(255,255,255,0.06)] opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-1 aspect-square bg-[#0f0f0f] overflow-hidden"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  data-testid="img-product-main"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/70">
                    {product.category === 'homme' ? 'Collection Homme' : product.category === 'femme' ? 'Collection Femme' : product.category}
                  </p>
                  {product.isNew && (
                    <span className="text-[8px] tracking-[0.3em] uppercase bg-[#c9a84c] text-black px-2 py-1">
                      Nouveau
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="text-[8px] tracking-[0.3em] uppercase bg-red-700 text-white px-2 py-1">
                      Rupture de stock
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-light text-5xl md:text-6xl mb-6">{product.name}</h1>

                <p data-testid="text-product-price" className="text-[#c9a84c] text-2xl tracking-wider mb-8">
                  {formatPrice(product.price)}
                </p>

                <div className="w-full h-[1px] bg-[rgba(255,255,255,0.06)] mb-8" />

                <p className="text-foreground/60 leading-relaxed text-sm mb-10">
                  {product.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10">
                  {[
                    { label: "Référence", value: `YS-${product.id.toUpperCase()}` },
                    { label: "Boîtier", value: "Acier inoxydable 316L" },
                    { label: "Mouvement", value: "Automatique Swiss Made" },
                    { label: "Étanchéité", value: "50 mètres" },
                  ].map(spec => (
                    <div key={spec.label}>
                      <p className="text-[8px] tracking-[0.35em] uppercase text-foreground/30 mb-1">{spec.label}</p>
                      <p className="text-xs text-foreground/70">{spec.value}</p>
                    </div>
                  ))}
                </div>

                <div className="w-full h-[1px] bg-[rgba(255,255,255,0.06)] mb-8" />

                {/* Qty + Add to cart */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[rgba(255,255,255,0.1)]">
                    <button
                      data-testid="button-qty-minus"
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-4 py-3 text-foreground/50 hover:text-foreground transition-colors"
                    >
                      −
                    </button>
                    <span data-testid="text-qty" className="px-4 text-sm min-w-[2rem] text-center">{qty}</span>
                    <button
                      data-testid="button-qty-plus"
                      onClick={() => setQty(q => q + 1)}
                      className="px-4 py-3 text-foreground/50 hover:text-foreground transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    data-testid="button-add-to-cart"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 text-xs tracking-[0.3em] uppercase font-medium transition-all duration-400 ${
                      product.inStock
                        ? added
                          ? 'bg-green-800/30 border border-green-600/40 text-green-400'
                          : 'bg-[#c9a84c] text-black hover:bg-[#e6c875]'
                        : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-foreground/30 cursor-not-allowed'
                    }`}
                  >
                    {added ? (
                      <><FiCheck /> Ajouté au panier</>
                    ) : (
                      <><FiShoppingCart /> {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}</>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-28">
              <div className="flex items-center gap-6 mb-12">
                <div className="h-[1px] flex-1 bg-[rgba(255,255,255,0.06)]" />
                <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a84c]/60">Vous aimerez aussi</p>
                <div className="h-[1px] flex-1 bg-[rgba(255,255,255,0.06)]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(rel => (
                  <Link key={rel.id} href={`/produit/${rel.id}`} data-testid={`card-related-${rel.id}`}>
                    <div className="group border border-[rgba(255,255,255,0.06)] bg-card product-card-hover cursor-pointer overflow-hidden">
                      <div className="aspect-square bg-[#0f0f0f] overflow-hidden">
                        <img
                          src={rel.images[0]}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
