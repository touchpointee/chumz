import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { createRazorpayOrder, createShopifyOrderFromRazorpay } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
};

type ShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Phone is required")
    .max(15, "Phone is too long"),
});

const shippingSchema = z.object({
  address1: z.string().min(3, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

type CheckoutFormValues = {
  customer: CustomerInfo;
  shipping: ShippingAddress;
};

const checkoutSchema = z.object({
  customer: customerSchema,
  shipping: shippingSchema,
});

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpayInstance = {
  open: () => void;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id?: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
  image?: string;
};

async function loadRazorpayScript() {
  if (window.Razorpay) return true;
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Checkout = () => {
  const { items, clearCart } = useCartStore();
  const [isPaying, setIsPaying] = useState(false);

  const { user, isGuest } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isGuest) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    }
  }, [user, isGuest, navigate]);

  const defaultValues: CheckoutFormValues = {
    customer: {
      name: user ? `${user.firstName} ${user.lastName}`.trim() : "",
      email: user?.email || "",
      phone: user?.phone || ""
    },
    shipping: {
      address1: user?.defaultAddress?.address1 || "",
      address2: user?.defaultAddress?.address2 || "",
      city: user?.defaultAddress?.city || "",
      state: user?.defaultAddress?.province || "",
      postalCode: user?.defaultAddress?.zip || "",
      country: user?.defaultAddress?.country || "India"
    },
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      form.reset({
        customer: {
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: user.phone || ""
        },
        shipping: {
          address1: user.defaultAddress?.address1 || "",
          address2: user.defaultAddress?.address2 || "",
          city: user.defaultAddress?.city || "",
          state: user.defaultAddress?.province || "",
          postalCode: user.defaultAddress?.zip || "",
          country: user.defaultAddress?.country || "India",
        }
      });
    }
  }, [user, form]);

  const totals = useMemo(() => {
    const currency = items[0]?.price.currencyCode || "INR";
    const subTotal = items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
    const shipping = subTotal > 499 ? 0 : 49;
    const total = subTotal + shipping;
    return { currency, subTotal, shipping, total };
  }, [items]);

  useEffect(() => {
    if (items.length === 0) {
      toast.info("Your cart is empty");
    } else {
      // GTM Begin Checkout Event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: totals.currency,
          value: totals.total,
          items: items.map(item => ({
            item_name: item.product.node.title,
            item_id: item.variantId,
            price: parseFloat(item.price.amount),
            quantity: item.quantity
          }))
        }
      });
    }
  }, [items.length, totals]);

  const handleRazorpayPay = async () => {
    if (items.length === 0) {
      toast.error("Add items to cart before checkout");
      return;
    }

    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsPaying(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setIsPaying(false);
      toast.error("Failed to load Razorpay. Check your network and try again.");
      return;
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      setIsPaying(false);
      toast.error("Razorpay Key ID missing. Add VITE_RAZORPAY_KEY_ID to your env.");
      return;
    }

    const values = form.getValues();
    const amountPaise = Math.round(totals.total * 100);

    let orderId: string;
    try {
      const order = await createRazorpayOrder(amountPaise, totals.currency || "INR");
      orderId = order.orderId;
    } catch (e) {
      setIsPaying(false);
      toast.error("Failed to create Razorpay order");
      return;
    }

    const options: RazorpayOptions = {
      key: keyId,
      amount: amountPaise,
      currency: totals.currency || "INR",
      name: "Chumz Comfort Shop",
      description: "Order Payment",
      image: window.location.origin + "/chumz_logo.png",
      order_id: orderId,
      prefill: {
        name: values.customer.name,
        email: values.customer.email,
        contact: values.customer.phone,
      },
      notes: {
        address: `${values.shipping.address1} ${values.shipping.address2 || ""}, ${values.shipping.city}, ${values.shipping.state} ${values.shipping.postalCode}, ${values.shipping.country}`,
      },
      handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
        try {
          const shopify = await createShopifyOrderFromRazorpay({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            customer: values.customer,
            shipping: values.shipping,
            items: items.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
            currency: totals.currency || "INR",
            amountPaise,
          });

          // GTM Purchase Event
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "purchase",
            ecommerce: {
              transaction_id: shopify.shopifyOrderName || response.razorpay_order_id,
              value: totals.total,
              tax: 0,
              shipping: totals.shipping,
              currency: totals.currency || "INR",
              items: items.map(item => ({
                item_name: item.product.node.title,
                item_id: item.variantId,
                price: parseFloat(item.price.amount),
                quantity: item.quantity
              }))
            }
          });

          toast.success("Order created", {
            description: shopify.shopifyOrderName ? `Order ${shopify.shopifyOrderName}` : "Shopify order saved",
          });
          clearCart();
          if (user) {
            navigate("/orders");
          } else {
            navigate("/");
          }
        } catch (err: any) {
          console.error("Order creation error:", err);
          toast.error(err.message || "Payment succeeded but order creation failed");
        }
      },
      modal: {
        ondismiss: function () {
          // GTM Payment Cancel Event
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "payment_cancel",
            ecommerce: {
              currency: totals.currency,
              value: totals.total,
              items: items.map(item => ({
                item_name: item.product.node.title,
                item_id: item.variantId,
                price: parseFloat(item.price.amount),
                quantity: item.quantity
              }))
            }
          });
          toast.info("Payment window closed");
        },
      },
      theme: { color: "#d35f99" },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      toast.error("Failed to start payment");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6 font-poppins">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customer.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jane@example.com" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="+91 xxxxxxxxxx" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shipping.address1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 1 <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="House number, street" {...field} required />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping.address2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Apartment, landmark (optional)" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="shipping.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} required />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} required />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="PIN code" {...field} required />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shipping.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Country" {...field} required />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No items in cart</p>
                    ) : (
                      items.map((item) => {
                        const unit = parseFloat(item.price.amount);
                        return (
                          <div key={item.variantId} className="flex items-center justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{item.product.node.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} × {totals.currency} {unit.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-sm font-semibold">
                              {totals.currency} {(unit * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="border-t pt-3 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        {totals.currency} {totals.subTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {totals.currency} {totals.shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        {totals.currency} {totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Label className="text-xs text-muted-foreground">
                      Payments are processed securely via Razorpay
                    </Label>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleRazorpayPay} disabled={isPaying || items.length === 0}>
                    {isPaying ? "Processing..." : "Pay with Razorpay"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
