import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ShoppingCart, Star } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  
  const handleAddToCart = () => {
    const firstVariant = product.node.variants.edges[0]?.node;
    
    if (!firstVariant) {
      toast.error("Product unavailable");
      return;
    }

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart! 🎉", {
      description: `${product.node.title} is ready for checkout`,
      position: "top-center"
    });
  };

  const price = parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2);
  const currency = product.node.priceRange.minVariantPrice.currencyCode;
  const imageUrl = product.node.images.edges[0]?.node.url;

  return (
    <Card className="group overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-2xl bg-white/80 backdrop-blur-sm">
      <Link to={`/product/${product.node.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-accent/30 to-transparent">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.node.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-lg">
            NEW
          </div>
        </div>
      </Link>
      
      <CardContent className="p-6 space-y-4">
        <Link to={`/product/${product.node.handle}`}>
          <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors font-poppins line-clamp-2">
            {product.node.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 text-yellow-400">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
          <span className="text-xs text-muted-foreground ml-2">(4.9)</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 font-nunito">
          {product.node.description || "Premium quality hygiene product for everyday comfort and confidence"}
        </p>
        
        <div className="flex items-end justify-between pt-2">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ₹{price}
            </p>
            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>
        </div>

        <Button 
          onClick={handleAddToCart}
          className="w-full group/btn shadow-lg hover:shadow-xl transition-all"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};
