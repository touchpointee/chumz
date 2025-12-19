import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local" });
import http from "http";
import crypto from "crypto";
import { URL } from "url";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "..", "dist");

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
