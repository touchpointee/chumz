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

export async function getCycleData(customerId: string) {
  const res = await fetch("/api/cycle/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch cycle data");
  }
  return res.json() as Promise<{ cycleData: any }>;
}

export async function saveCycleData(customerId: string, cycleData: any, nextPeriodDate?: string, notificationDate?: string) {
  const res = await fetch("/api/cycle/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, cycleData, nextPeriodDate, notificationDate }),
  });
  if (!res.ok) {
    throw new Error("Failed to save cycle data");
  }
  return res.json() as Promise<{ success: boolean }>;
}
// Push Notifications
export async function subscribeToPush(customerId: string) {
  // 1. Get Public Key
  const keyRes = await fetch("/api/push/public-key");
  const { publicKey } = await keyRes.json();
  if (!publicKey) throw new Error("No public key found");

  // 2. Register Service Worker
  const swRegistration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  // 3. Subscribe
  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  // 4. Send to Backend
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, subscription }),
  });

  if (!res.ok) throw new Error("Failed to save subscription");
  return true;
}

export async function triggerTestPush(customerId: string) {
  const res = await fetch("/api/push/trigger-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to trigger test push");
  }
  return true;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
