export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
};

export type ShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export async function createRazorpayOrder(amountPaise: number, currency: string) {
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountPaise, currency }),
  });
  if (!res.ok) {
    throw new Error("Failed to create Razorpay order");
  }
  return res.json() as Promise<{ orderId: string }>;
}

export async function createShopifyOrderFromRazorpay(input: {
  paymentId: string;
  orderId: string;
  signature: string;
  customer: CustomerInfo;
  shipping: ShippingAddress;
  items: Array<{ variantId: string; quantity: number }>;
  currency: string;
  amountPaise: number;
}) {
  const res = await fetch("/api/orders/create-from-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Failed to create Shopify order" }));
    throw new Error(data.error || "Failed to create Shopify order");
  }
  return res.json() as Promise<{ shopifyOrderId: string; shopifyOrderName?: string }>;
}
