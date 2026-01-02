import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import {
  ShoppingCart,
  ArrowLeft,
  Star,
  Shield,
  Leaf,
  Heart,
  Package,
  ChevronLeft,
  Check,
  ChevronRight,
  Trash2,
} from "lucide-react";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore((state) => state.addItem);

  // ---------------- all hooks / state (top — stable order) ----------------
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // visibility of thumbnails based on window size
  const [visibleThumbsCount, setVisibleThumbsCount] = useState(4);
  const [thumbStart, setThumbStart] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setVisibleThumbsCount(window.innerWidth < 380 ? 3 : 4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shipping config state (must be at top level)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);

  useEffect(() => {
    fetch("/api/shipping/config")
      .then(res => res.json())
      .then(data => {
        if (data.freeShippingThreshold) setFreeShippingThreshold(data.freeShippingThreshold);
      })
      .catch(console.error);
  }, []);

  // lightbox state (must be declared unconditionally with other hooks)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // query — also a hook and must stay in stable order
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => getProductByHandle(handle!),
    enabled: !!handle,
  });

  // ---------------- derived values (safe, not hooks) ----------------
  // compute images and featureImages from product (may be empty arrays)
  const images = product?.images?.edges?.map((edge: any) => edge.node) ?? [];
  const featureImages =
    product?.featureImages?.references?.edges?.map((edge: any) => edge.node.image) ?? [];

  /* ---------- DESCRIPTION FORMATTER ---------- */
  const formatDescription = (description?: string) => {
    if (!description) {
      return { paragraph: "", bullets: [] as string[] };
    }

    let parts: string[] = [];

    if (description.includes("•")) {
      parts = description.split("•");
    } else {
      parts = description.split(/\r?\n/);
    }

    const cleaned = parts.map((p) => p.trim()).filter(Boolean);

    return {
      paragraph: cleaned[0] || "",
      bullets: cleaned.slice(1),
    };
  };

  const { paragraph, bullets } = formatDescription(product?.description);

  // ---------------- effects (still hooks) ----------------
  // keep active image index valid when images change
  useEffect(() => {
    if (!images.length) {
      setActiveImageIndex(0);
      setThumbStart(0);
      return;
    }
    // clamp activeImageIndex within range
    if (activeImageIndex >= images.length) {
      setActiveImageIndex(0);
    }
    if (activeImageIndex < 0) {
      setActiveImageIndex(0);
    }
  }, [images.length]); // run when images length changes

  // keep the active image inside the visible thumbnail window
  useEffect(() => {
    if (!images.length) return;

    if (activeImageIndex < thumbStart) {
      setThumbStart(activeImageIndex);
    } else if (activeImageIndex >= thumbStart + visibleThumbsCount) {
      setThumbStart(activeImageIndex - visibleThumbsCount + 1);
    }
  }, [activeImageIndex, images.length, thumbStart]);

  // ------------------- UI guards -------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
        <Header />
        <div className="container py-20 text-center">
          <div className="animate-pulse">
            <p className="text-muted-foreground text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background">
        <Header />
        <div className="container py-20 text-center">
          <div className="max-w-md mx-auto bg-gradient-card rounded-3xl p-12 shadow-soft">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">Sorry, we couldn't find this product.</p>
            <Link to="/shop">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- safe to use product from here ----------
  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount).toFixed(2) : "0.00";
  const currency = selectedVariant?.price?.currencyCode || "USD";



  const handleAddToCart = () => {
    if (!product) return;

    const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;

    if (!selectedVariant) {
      toast.error("Product unavailable");
      return;
    }

    const cartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    };

    addItem(cartItem);
    toast.success("Added to cart! 🎉", {
      description: `${product.title} is ready for checkout`,
      position: "top-center",
    });
  };

  const handlePrevImage = () => {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!images.length) return;
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // thumbnail window slice to display (using thumbStart)
  const visibleThumbs = images.slice(thumbStart, thumbStart + visibleThumbsCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/20 to-background overflow-x-hidden">
      <Header />

      <div className="w-full max-w-7xl mx-auto px-4 xs:px-6 sm:container py-8 sm:py-12">
        <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 sm:mb-8 transition-colors group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:items-start">
          {/* Product Images */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24 self-start lg:max-h-[calc(100vh-6rem)]">
            {/* Main image */}
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-accent/30 to-transparent shadow-2xl border-2 border-border/50 flex items-center justify-center h-[280px] sm:h-[360px] md:h-[440px] lg:h-[520px]">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-2xl pointer-events-none" />

              {images[activeImageIndex] ? (
                <img src={images[activeImageIndex].url} alt={product.title} className="relative max-h-full w-auto object-contain" />
              ) : (
                <div className="relative w-full h-[260px] flex items-center justify-center text-muted-foreground">No image available</div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-primary shadow-lg uppercase">
                  {product.tags[0]}
                </div>
              )}
            </div>

            {/* Thumbnails + arrows */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3">
                {/* left arrow */}
                <button type="button" onClick={handlePrevImage} className="p-2 rounded-full border border-border/60 bg-white/80 shadow-sm hover:border-primary hover:bg-white transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* thumbnails window */}
                <div className="flex items-center gap-2">
                  {visibleThumbs.map((image: any, idx: number) => {
                    const realIndex = thumbStart + idx;
                    return (
                      <button
                        key={image.id ?? realIndex}
                        type="button"
                        onClick={() => setActiveImageIndex(realIndex)}
                        className={`relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-accent border transition-all ${activeImageIndex === realIndex ? "border-primary ring-2 ring-primary/40" : "border-border/50 hover:border-primary/60"
                          }`}
                      >
                        <img src={image.url} alt={`${product.title} thumbnail ${realIndex + 1}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>

                {/* right arrow */}
                <button type="button" onClick={handleNextImage} className="p-2 rounded-full border border-border/60 bg-white/80 shadow-sm hover:border-primary hover:bg-white transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 md:space-y-10">
            {/* Title / rating / price */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(4.9 from 2,500+ reviews)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-poppins">{product.title}</h1>

              <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
                <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-none">₹{price}</p>
                <span className="text-xs sm:text-sm md:text-base text-muted-foreground">Inclusive of all taxes · {currency}</span>
              </div>
            </div>

            {/* ---------- DESCRIPTION (FIXED) ---------- */}
            <div className="space-y-4 text-muted-foreground font-nunito">
              {paragraph && (
                <p className="text-lg leading-relaxed">{paragraph}</p>
              )}

              {bullets.length > 0 && (
                <ul className="space-y-2">
                  {bullets.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-md border border-border/60 shadow-soft p-4 sm:p-6 md:p-7">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Why shop with us</p>
                <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">100% safe & dermat tested</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {[{ icon: Shield, text: "Derma Tested" }, { icon: Leaf, text: "Natural Formula" }, { icon: Heart, text: "pH Balanced" }, { icon: Package, text: "Fast Delivery" }].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm flex-shrink-0">
                      <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}              </div>
            </div>

            {/* Add to Cart strip */}
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary to-secondary p-[1px] shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-background/90 px-4 py-4 sm:px-6 md:px-8 md:py-5 backdrop-blur">
                <div className="space-y-1 text-center md:text-left">
                  <p className="text-sm font-semibold text-foreground">Complete your intimate care routine</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Free shipping on orders over ₹{freeShippingThreshold} · Secure checkout</p>
                </div>

                <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto text-base md:text-lg px-8 py-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="rounded-2xl sm:rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-secondary/10 to-background shadow-soft p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <h3 className="text-xl sm:text-2xl font-extrabold font-poppins">Key Benefits</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-white/60 text-primary font-medium w-fit">Everyday comfort & confidence</span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {[
                  "pH-balanced formula for intimate health",
                  "Dermatologically tested and approved",
                  "All-day comfort and freshness",
                  "Made with premium natural ingredients",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                    </span>
                    <p className="text-xs sm:text-sm md:text-base text-foreground font-nunito">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use */}
            <div className="rounded-2xl sm:rounded-3xl border border-border/60 bg-white/70 backdrop-blur-md shadow-soft p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold font-poppins">How to Use</h3>

              <div className="space-y-3 sm:space-y-4">
                {[
                  "Gently cleanse the intimate area with water.",
                  "Apply a small amount of wash, lather, and rinse thoroughly.",
                  "Pat dry and wear panty liners for all-day freshness.",
                  "Use daily for best results and long-lasting comfort.",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <span className="mt-0.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">{i + 1}</span>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-nunito">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature / Explore Images */}
        {featureImages.length > 0 && (
          <section className="space-y-6 mt-12">
            <h3 className="text-2xl font-normal font-poppins mt-6">Explore More About {product.title}</h3>

            <div className="space-y-6 mt-4">
              {featureImages.map((img: any, index: number) => (
                <button
                  key={img.id ?? index}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  className="group w-full rounded-3xl overflow-hidden border border-border/60 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label={`Open feature image ${index + 1}`}
                  type="button"
                >
                  <div className="relative w-full aspect-[16/7] bg-muted">
                    <img
                      src={img.url}
                      alt={img.altText || `${product.title} feature ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {img.altText && (
                      <div className="absolute left-4 bottom-4 right-4 p-3 rounded-md bg-black/30 text-white text-sm backdrop-blur-sm opacity-90">
                        {img.altText}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {lightboxOpen && (
              <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" onClick={() => setLightboxOpen(false)}>
                <div className="relative max-w-6xl w-full rounded-2xl overflow-hidden bg-background shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setLightboxOpen(false)} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow hover:scale-105 transition" aria-label="Close" type="button">✕</button>

                  <button onClick={() => setLightboxIndex((i) => (i === 0 ? featureImages.length - 1 : i - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow hover:scale-105 transition" aria-label="Previous" type="button">‹</button>

                  <button onClick={() => setLightboxIndex((i) => (i === featureImages.length - 1 ? 0 : i + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow hover:scale-105 transition" aria-label="Next" type="button">›</button>

                  <div className="w-full h-[70vh] md:h-[80vh] flex items-center justify-center bg-black">
                    <img src={featureImages[lightboxIndex].url} alt={featureImages[lightboxIndex].altText || `Feature ${lightboxIndex + 1}`} className="max-h-full max-w-full object-contain" loading="eager" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/90">
                    <div className="text-sm text-muted-foreground">{featureImages[lightboxIndex].altText || `${lightboxIndex + 1} of ${featureImages.length}`}</div>
                    <div className="text-sm text-muted-foreground">{lightboxIndex + 1} / {featureImages.length}</div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
