import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local" });
import http from "http";
import crypto from "crypto";
import { URL } from "url";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import webPush from "web-push";
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "..", "dist");

// VAPID Setup
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    'mailto:support@chumz.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Cron Job: Check for notifications daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log("[Cron] Checking for push notifications...");
  try {
    // Fetch customers with their metafields
    // Note: For production, implement pagination (after: cursor)
    const query = `
            query {
                customers(first: 50) {
                    edges {
                        node {
                            id
                            metafield_notification: metafield(namespace: "custom", key: "notification_date") { value }
                            metafield_subscription: metafield(namespace: "custom", key: "push_subscription") { value }
                        }
                    }
                }
            }
        `;
    const data = await shopifyGraphql(query, {});
    const customers = data.customers?.edges || [];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    for (const { node } of customers) {
      const notificationDate = node.metafield_notification?.value;
      const subscriptionJson = node.metafield_subscription?.value;

      if (notificationDate === today && subscriptionJson) {
        console.log(`[Cron] Triggering notification for customer ${node.id}`);
        try {
          const subscription = JSON.parse(subscriptionJson);
          await webPush.sendNotification(subscription, JSON.stringify({
            title: "Cycle Alert",
            body: "Period predicted in 5 days! Time to stock up.",
            url: "/shop"
          }));
        } catch (err) {
          console.error(`[Cron] Failed to send push to ${node.id}`, err);
        }
      }
    }
  } catch (error) {
    console.error("[Cron] Error executing job:", error);
  }
});

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
};

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
    return true;
  } catch (err) {
    return false;
  }
}

async function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

async function createRazorpayOrder(amountPaise, currency) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Missing Razorpay credentials");
  }
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency,
      payment_capture: 1,
      receipt: `rcpt_${Date.now()}`,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create Razorpay order");
  }
  const data = await res.json();
  return { orderId: data.id };
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Missing Razorpay secret");
  }
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}

async function shopifyGraphql(query, variables) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_ADMIN_API_VERSION || "2025-01";
  if (!storeDomain || !token) {
    throw new Error("Missing Shopify admin credentials");
  }
  const url = `https://${storeDomain}/admin/api/${version}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Shopify request failed");
  }
  const data = await res.json();
  if (data.errors) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data.data;
}

async function createDraftOrder({ name, email, shipping, items }) {
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";
  const input = {
    email,
    shippingAddress: {
      address1: shipping.address1,
      address2: shipping.address2 || "",
      city: shipping.city,
      province: shipping.state,
      zip: shipping.postalCode,
      country: shipping.country,
      firstName: firstName,
      lastName: lastName,
    },
    lineItems: items.map((i) => ({
      variantId: i.variantId,
      quantity: i.quantity,
    })),
    tags: ["razorpay"],
    note: "Created via custom checkout",
  };
  const query = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id }
        userErrors { field message }
      }
    }
  `;
  const resp = await shopifyGraphql(query, { input });
  const errors = resp.draftOrderCreate.userErrors;
  if (errors && errors.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }
  return resp.draftOrderCreate.draftOrder.id;
}

async function completeDraftOrder(id) {
  const query = `
    mutation draftOrderComplete($id: ID!, $paymentPending: Boolean!) {
      draftOrderComplete(id: $id, paymentPending: $paymentPending) {
        draftOrder {
          order { id name }
        }
        userErrors { field message }
      }
    }
  `;
  const resp = await shopifyGraphql(query, { id, paymentPending: false });
  const errors = resp.draftOrderComplete.userErrors;
  if (errors && errors.length) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }
  return resp.draftOrderComplete.draftOrder.order;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // API Routes - handle these first
  if (req.method === "GET" && url.pathname === "/api/push/public-key") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ publicKey: process.env.VAPID_PUBLIC_KEY }));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/push/subscribe") {
    try {
      const body = await readJson(req);
      const { customerId, subscription } = body;
      if (!customerId || !subscription) throw new Error("Missing data");

      // Save subscription to customer metafield
      const mutation = `
            mutation updatePushMetafield($input: CustomerInput!) {
              customerUpdate(input: $input) {
                userErrors { field message }
              }
            }
          `;
      const input = {
        id: customerId,
        metafields: [{
          namespace: "custom",
          key: "push_subscription",
          value: JSON.stringify(subscription),
          type: "json"
        }]
      };
      await shopifyGraphql(mutation, { input });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (e) {
      console.error("Push subscribe error:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // --- TEST ENDPOINT ---
  if (req.method === "POST" && url.pathname === "/api/push/trigger-test") {
    try {
      const body = await readJson(req);
      const { customerId } = body;
      if (!customerId) throw new Error("Missing customerId");

      // 1. Fetch Subscription from Shopify
      const query = `
            query getSubscription($id: ID!) {
              customer(id: $id) {
                metafield(namespace: "custom", key: "push_subscription") {
                  value
                }
              }
            }
          `;
      const data = await shopifyGraphql(query, { id: customerId });
      const subscriptionJson = data.customer?.metafield?.value;

      if (!subscriptionJson) throw new Error("No subscription found for this user.");

      // 2. Send Notification
      const subscription = JSON.parse(subscriptionJson);
      await webPush.sendNotification(subscription, JSON.stringify({
        title: "Test Notification",
        body: "This is a test alert from Chumz! Your notifications are working.",
        url: "/shop"
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (e) {
      console.error("Test Push Error:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/razorpay/create-order") {
    try {
      const body = await readJson(req);
      const { amountPaise, currency } = body;
      const order = await createRazorpayOrder(amountPaise, currency || "INR");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(order));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(e.message || e) }));
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    try {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      const domain = process.env.SHOPIFY_STORE_DOMAIN;
      const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
      let shopifyConnected = null;
      let shopName = undefined;
      if (domain && token) {
        try {
          const data = await shopifyGraphql(
            `
            query {
              shop {
                name
              }
            }
          `,
            {}
          );
          shopifyConnected = true;
          shopName = data.shop?.name;
        } catch {
          shopifyConnected = false;
        }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          razorpay: { keyIdPresent: !!keyId, secretPresent: !!keySecret },
          shopify: { domainPresent: !!domain, tokenPresent: !!token, connected: shopifyConnected, shopName },
        })
      );
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(e.message || e) }));
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/orders/create-from-razorpay") {
    try {
      const body = await readJson(req);
      const { paymentId, orderId, signature, customer, shipping, items } = body;
      const valid = verifyRazorpaySignature(orderId, paymentId, signature);
      if (!valid) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid signature" }));
        return;
      }
      const draftId = await createDraftOrder({
        name: customer.name,
        email: customer.email,
        shipping,
        items,
      });
      const order = await completeDraftOrder(draftId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ shopifyOrderId: order.id, shopifyOrderName: order.name }));
    } catch (e) {
      console.error("Error creating order:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(e.message || e) }));
    }
    return;
  }

  // --- Shipping Config Endpoint ---
  if (req.method === "GET" && url.pathname === "/api/shipping/config") {
    try {
      // Initialize defaults
      let config = {
        freeShippingThreshold: 100,
        shippingRate: 50,
        freeShippingLabel: "Free Shipping",
        shippingLabel: "Standard Shipping"
      };

      // Priority 1: Try to fetch from Shopify Delivery Profiles (BEST SOURCE)
      try {
        const query = `
          query {
            deliveryProfiles(first: 5) {
              edges {
                node {
                  name
                  profileLocationGroups {
                    locationGroupZones(first: 5) {
                      edges {
                        node {
                          methodDefinitions(first: 5) {
                            edges {
                              node {
                                name
                                active
                                rateProvider {
                                  ... on DeliveryRateDefinition {
                                    price { amount }
                                  }
                                }
                                methodConditions {
                                  field
                                  operator
                                  conditionCriteria {
                                    ... on MoneyV2 { amount }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
        const data = await shopifyGraphql(query, {});

        // Debug
        // console.log("[Shipping] Profiles raw:", JSON.stringify(data));

        let foundThreshold = null;
        let foundRate = null;

        const profiles = data.deliveryProfiles?.edges || [];
        // console.log("[Shipping] Profiles found:", profiles.length);

        for (const profile of profiles) {
          const locationGroups = profile.node?.profileLocationGroups || [];
          for (const group of locationGroups) {
            const zones = group.locationGroupZones?.edges || [];
            for (const zone of zones) {
              const methodDefs = zone.node?.methodDefinitions?.edges || [];
              for (const method of methodDefs) {
                const node = method.node;
                if (!node.active) continue;

                const price = parseFloat(node.rateProvider?.price?.amount || "0");
                // console.log(`[Shipping] Found active method: ${node.name} - Price: ${price}`);

                if (price === 0) {
                  // Found a free rate, check conditions for threshold
                  const conditions = node.methodConditions || [];
                  for (const cond of conditions) {
                    if (cond.field === "TOTAL_PRICE" && cond.conditionCriteria?.amount) {
                      foundThreshold = parseFloat(cond.conditionCriteria.amount);
                    }
                  }
                } else {
                  // Found a paid shipping rate - take the first active paid rate we find as default
                  if (foundRate === null) {
                    foundRate = price;
                  }
                }
              }
            }
          }
        }

        if (foundThreshold !== null) {
          config.freeShippingThreshold = foundThreshold;
          config.freeShippingLabel = `Free shipping on orders over ₹${foundThreshold}`;
        }
        if (foundRate !== null) {
          config.shippingRate = foundRate;
        }

        console.log("[Shipping Config] Fetched from Delivery Profiles:", config);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(config));
        return;

      } catch (profileError) {
        console.error("[Shipping Config] Delivery Profiles fetch failed:", profileError.message);
        // Fallthrough to next methods
      }

      // Priority 2: Try to fetch from Shopify shop metafield (Legacy)
      try {
        const query = `
          query {
            shop {
              metafield(namespace: "custom", key: "shipping_config") {
                value
              }
            }
          }
        `;
        const data = await shopifyGraphql(query, {});
        const configValue = data.shop?.metafield?.value;

        if (configValue) {
          const parsed = JSON.parse(configValue);
          config = { ...config, ...parsed };
          console.log("[Shipping Config] From Shopify metafield:", config);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(config));
          return;
        }
      } catch (metaError) {
        // Ignore
      }

      // Priority 3: Check environment variables
      const envThreshold = process.env.SHIPPING_FREE_THRESHOLD;
      const envRate = process.env.SHIPPING_RATE;

      if (envThreshold && envRate) {
        config.freeShippingThreshold = parseFloat(envThreshold);
        config.shippingRate = parseFloat(envRate);
        console.log("[Shipping Config] Using env vars:", config);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(config));
        return;
      }

      // Fallback: Return defaults
      console.log("[Shipping Config] Using defaults:", config);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(config));

    } catch (e) {
      console.error("[Shipping Config] Critical Error:", e.message);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        freeShippingThreshold: 100,
        shippingRate: 50,
        freeShippingLabel: "Free Shipping",
        shippingLabel: "Standard Shipping"
      }));
    }
    return;
  }

  // --- NEW: Cycle Tracking Endpoints ---

  if (req.method === "POST" && url.pathname === "/api/cycle/get") {
    try {
      const body = await readJson(req);
      const { customerId } = body;
      if (!customerId) throw new Error("Missing customerId");

      // Query the metafield from the customer using Admin API
      // Note: customerId should be the Global ID (gid://shopify/Customer/...)
      const query = `
        query getCycleMetafield($id: ID!) {
          customer(id: $id) {
            metafield(namespace: "custom", key: "cycle_data") {
              value
            }
          }
        }
      `;
      const data = await shopifyGraphql(query, { id: customerId });
      const value = data.customer?.metafield?.value;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ cycleData: value ? JSON.parse(value) : null }));
    } catch (e) {
      console.error("Error fetching cycle data:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(e.message || e) }));
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/cycle/save") {
    try {
      const body = await readJson(req);
      const { customerId, cycleData, nextPeriodDate, notificationDate } = body;
      console.log(`[Cycle Save] Attempting to save for customer: ${customerId}`);

      if (!customerId) throw new Error("Missing customerId");

      // Mutation to update/create BOTH metafields: data and prediction
      const mutation = `
        mutation updateCycleMetafield($input: CustomerInput!) {
          customerUpdate(input: $input) {
            customer {
              id
              cycle_data: metafield(namespace: "custom", key: "cycle_data") {
                value
              }
              notification_date: metafield(namespace: "custom", key: "notification_date") {
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const metafields = [
        {
          namespace: "custom",
          key: "cycle_data",
          value: JSON.stringify(cycleData),
          type: "json"
        }
      ];

      // If we have a calculated next date, save it too
      if (nextPeriodDate) {
        metafields.push({
          namespace: "custom",
          key: "next_period_date",
          value: nextPeriodDate, // expected format: YYYY-MM-DD
          type: "date"
        });
      }

      // If we have a notification date (Start + 22 days), save it
      if (notificationDate) {
        metafields.push({
          namespace: "custom",
          key: "notification_date",
          value: notificationDate, // expected format: YYYY-MM-DD
          type: "date"
        });
      }

      const input = {
        id: customerId,
        metafields: metafields
      };

      console.log(`[Cycle Save] Sending mutation to Shopify...`);
      const data = await shopifyGraphql(mutation, { input });

      // Log to file for debugging
      const fs = await import('fs');
      const logMsg = `[${new Date().toISOString()}] Customer: ${customerId} | Response: ${JSON.stringify(data)}\n`;
      try { fs.appendFileSync('server/debug.log', logMsg); } catch (e) { }

      console.log(`[Cycle Save] Shopify Response:`, JSON.stringify(data));

      const errors = data.customerUpdate?.userErrors;
      if (errors && errors.length > 0) {
        console.error(`[Cycle Save] Shopify UserErrors:`, errors);
        try { fs.appendFileSync('server/debug.log', `[Error] UserErrors: ${JSON.stringify(errors)}\n`); } catch (e) { }
        throw new Error(errors.map(e => e.message).join(", "));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (e) {
      console.error("Error saving cycle data:", e);
      const fs = await import('fs');
      try { fs.appendFileSync('server/debug.log', `[${new Date().toISOString()}] Exception: ${e.message}\n`); } catch (err) { }

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(e.message || e) }));
    }
    return;
  }

  // Static file serving for React app
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(DIST_DIR, requestedPath);

  // Check if file exists and serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (serveStaticFile(res, filePath)) return;
  }

  // SPA fallback - serve index.html for client-side routing
  const indexPath = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(indexPath)) {
    if (serveStaticFile(res, indexPath)) return;
  }

  // If nothing found, return 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

const port = process.env.PORT || 8787;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
  console.log(`Serving static files from: ${DIST_DIR}`);
});
