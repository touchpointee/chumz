import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { items, isLoading, updateQuantity, removeItem, createCheckout } = useCartStore();
  const { user, isGuest } = useAuthStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );
  const currencyCode = items[0]?.price.currencyCode || "USD";

  const handleCheckoutClick = () => {
    setIsOpen(false);
    if (user || isGuest) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    }
  };

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-primary/20"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-gradient-to-b from-background via-accent/10 to-background">
        {/* Header */}
        <SheetHeader className="flex-shrink-0 pb-2">
          <SheetTitle className="flex items-center justify-between">
            <span>Shopping Cart</span>
            {totalItems > 0 && (
              <span className="text-xs rounded-full bg-primary/10 text-primary px-3 py-1 font-medium">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Your cart is empty."
              : "Review your items and proceed to secure checkout."}
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/40">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-xs text-muted-foreground">
                  Looks like you haven&apos;t added anything yet.
                </p>
                <Button
                  onClick={() => { setIsOpen(false); navigate("/shop"); }}
                  className="mt-4 w-full"
                >
                  Start Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 space-y-3">
                {items.map((item) => {
                  const unitPrice = parseFloat(item.price.amount);
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.variantId}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 p-[1px] shadow-sm"
                    >
                      <div className="flex gap-3 rounded-2xl bg-background/90 px-3 py-3">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent flex-shrink-0 shadow-sm">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={item.product.node.images.edges[0].node.url}
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm truncate">
                                {item.product.node.title}
                              </h4>
                              {item.selectedOptions?.length > 0 && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {item.selectedOptions
                                    .map((o) => o.value)
                                    .join(" • ")}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.variantId)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          <div className="flex items-end justify-between gap-2 pt-1">
                            <div className="flex items-center gap-1.5 rounded-full bg-accent/40 px-2 py-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  updateQuantity(
                                    item.variantId,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-7 text-center text-xs font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  updateQuantity(
                                    item.variantId,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {currencyCode} {unitPrice.toFixed(2)} each
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                {currencyCode} {lineTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer / summary */}
              <div className="flex-shrink-0 space-y-3 pt-4 mt-2 border-t border-border/60 bg-background/80 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Total
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">
                        {currencyCode} {totalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        incl. taxes
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-600 font-medium">
                      Free shipping over ₹499
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Secure Shopify checkout
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleCheckoutClick}
                  className="w-full"
                  size="lg"
                  disabled={items.length === 0}
                >
                  Continue to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
