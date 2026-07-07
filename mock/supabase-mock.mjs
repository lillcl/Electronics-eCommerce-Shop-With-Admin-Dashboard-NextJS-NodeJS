/**
 * Local Supabase REST/Auth/Storage mock.
 * Implements the surface that @supabase/ssr and the data layer hit.
 *
 * Run: node mock/supabase-mock.mjs
 * Listens on http://localhost:54321
 *
 * No external deps. Stays in-process; restarts on each run.
 */
import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = process.env.MOCK_PORT || 54321;

const ANON_KEY = "mock-anon-key";
const SERVICE_KEY = "mock-service-key";

const db = {
  profiles: [
    { id: "adadadad-0000-0000-0000-000000000001", email: "admin@test.com", full_name: "Admin User", role: "admin", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "adadadad-0000-0000-0000-000000000002", email: "user@test.com", full_name: "Regular User", role: "user", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  categories: [
    { id: "11111111-1111-1111-1111-111111111111", name: "Smartphones" },
    { id: "22222222-2222-2222-2222-222222222222", name: "Laptops" },
    { id: "33333333-3333-3333-3333-333333333333", name: "Tablets" },
    { id: "44444444-4444-4444-4444-444444444444", name: "Audio" },
    { id: "55555555-5555-5555-5555-555555555555", name: "Wearables" },
  ],
  merchants: [
    { id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "TechWorld", description: "Premium electronics", email: "tw@x.com", phone: null, address: null, status: "ACTIVE", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "GadgetHub", description: "Gadgets", email: null, phone: null, address: null, status: "ACTIVE", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  products: [
    { id: "p0000001-0000-0000-0000-000000000001", slug: "iphone-15-pro", title: "iPhone 15 Pro", main_image: "https://images.unsplash.com/photo-1696446702183-be3074bb09cf?w=800", price: 999, rating: 5, description: "<p>The latest iPhone.</p>", manufacturer: "Apple", in_stock: 50, category_id: "11111111-1111-1111-1111-111111111111", merchant_id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "p0000002-0000-0000-0000-000000000002", slug: "macbook-pro-14", title: "MacBook Pro 14\"", main_image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", price: 1999, rating: 5, description: "<p>M3 Pro laptop.</p>", manufacturer: "Apple", in_stock: 30, category_id: "22222222-2222-2222-2222-222222222222", merchant_id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "p0000003-0000-0000-0000-000000000003", slug: "galaxy-s24-ultra", title: "Galaxy S24 Ultra", main_image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", price: 1199, rating: 5, description: "<p>Flagship.</p>", manufacturer: "Samsung", in_stock: 40, category_id: "11111111-1111-1111-1111-111111111111", merchant_id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "p0000004-0000-0000-0000-000000000004", slug: "airpods-pro-2", title: "AirPods Pro 2", main_image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800", price: 249, rating: 5, description: "<p>ANC earbuds.</p>", manufacturer: "Apple", in_stock: 100, category_id: "44444444-4444-4444-4444-444444444444", merchant_id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  product_images: [],
  orders: [],
  order_items: [],
  wishlists: [],
  notifications: [],
  bulk_upload_batches: [],
  bulk_upload_items: [],
};

const sessions = new Map();

function send(res, status, body, extraHeaders = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    ...extraHeaders,
  });
  if (body === undefined || body === null) res.end();
  else res.end(typeof body === "string" ? body : JSON.stringify(body));
}

function authUserId(req) {
  const auth = req.headers["authorization"] || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return sessions.get(token) || null;
}

function parseBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString();
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { resolve({}); }
    });
  });
}

function isAdmin(req) {
  const auth = req.headers["authorization"] || "";
  return auth.includes(SERVICE_KEY) || auth === `Bearer ${SERVICE_KEY}`;
}

function nowIso() { return new Date().toISOString(); }

function matchFilters(row, filters) {
  for (const [k, v] of Object.entries(filters)) {
    const [col, op, valRaw] = parseFilter(v);
    const rv = row[col ?? k];
    if (op === "eq") { if (rv != valRaw) return false; }
    else if (op === "neq") { if (rv == valRaw) return false; }
    else if (op === "in") { if (!valRaw.split(",").includes(String(rv))) return false; }
    else if (op === "ilike") {
      const re = new RegExp("^" + valRaw.replace(/%/g, ".*") + "$", "i");
      if (!re.test(String(rv ?? ""))) return false;
    }
    else if (op === "is") { if (String(rv) !== valRaw) return false; }
  }
  return true;
}

function parseFilter(v) {
  if (typeof v === "string" && v.startsWith("eq.")) return [null, "eq", v.slice(3)];
  if (typeof v === "string" && v.startsWith("neq.")) return [null, "neq", v.slice(4)];
  if (typeof v === "string" && v.startsWith("in.")) return [null, "in", v.slice(3).replace(/[()]/g, "")];
  if (typeof v === "string" && v.startsWith("ilike.")) return [null, "ilike", v.slice(6)];
  if (typeof v === "string" && v.startsWith("is.")) return [null, "is", v.slice(3)];
  if (typeof v === "object" && v !== null) {
    const key = Object.keys(v)[0];
    return [key, key, String(v[key])];
  }
  return [null, "eq", v];
}

function readQuery(url) {
  const out = {};
  for (const [k, v] of url.searchParams.entries()) out[k] = v;
  return out;
}

function splitTopLevel(str) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of str) {
    if (ch === "(") { depth++; cur += ch; }
    else if (ch === ")") { depth--; cur += ch; }
    else if (ch === "," && depth === 0) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

// Parse a PostgREST select into embed specs [{ alias, table }].
function parseEmbeds(select) {
  const embeds = [];
  for (const raw of splitTopLevel(select || "*")) {
    const part = raw.trim();
    const paren = part.indexOf("(");
    if (paren === -1) continue; // plain column
    const head = part.slice(0, paren).trim();
    if (head.includes(":")) {
      const [alias, table] = head.split(":").map((s) => s.trim());
      embeds.push({ alias, table });
    } else {
      embeds.push({ alias: head, table: head });
    }
  }
  return embeds;
}

function embed(row, table, embeds) {
  if (!embeds.length) return row;
  const result = { ...row };
  for (const { alias, table: target } of embeds) {
    const related = db[target];
    if (!related) continue;
    let joined = null;
    if (target === "categories") joined = related.find((r) => r.id === row.category_id) ?? null;
    else if (target === "merchants") joined = related.find((r) => r.id === row.merchant_id) ?? null;
    else if (target === "product_images") joined = related.filter((r) => r.product_id === row.id);
    else if (target === "products") {
      if (table === "merchants") joined = related.filter((r) => r.merchant_id === row.id);
      else if (table === "categories") joined = related.filter((r) => r.category_id === row.id);
      else joined = related.find((r) => r.id === row.product_id) ?? null;
    }
    else if (target === "order_items") joined = related.filter((r) => r.order_id === row.id);
    result[alias] = joined;
  }
  return result;
}

async function handleRest(req, res, url, table) {
  if (!db[table]) return send(res, 404, { message: `Table ${table} not found` });
  const method = req.method;
  const q = readQuery(url);
  const filters = { ...q };
  delete filters.select;
  delete filters.order;
  delete filters.limit;
  delete filters.offset;
  const embeds = parseEmbeds(q.select);
  const wantsSingle = (req.headers["accept"] || "").includes("vnd.pgrst.object");

  if (method === "GET") {
    let rows = db[table].filter((r) => matchFilters(r, filters));
    if (q.order) {
      const [col, dir] = q.order.split(".");
      rows = [...rows].sort((a, b) => (a[col] > b[col] ? 1 : -1) * (dir === "desc" ? -1 : 1));
    }
    if (q.limit) rows = rows.slice(0, parseInt(q.limit));
    const embedded = rows.map((r) => embed(r, table, embeds));
    if (wantsSingle) {
      if (embedded.length === 1) return send(res, 200, embedded[0]);
      const code = embedded.length === 0 ? "PGRST116" : "PGRST116";
      return send(res, 406, {
        code,
        message: `JSON object requested, multiple (or no) rows returned`,
        details: `Results contain ${embedded.length} rows`,
      });
    }
    if (q.select && q.select.includes("id")) {
      return send(res, 200, embedded, { "Content-Range": `0-${embedded.length - 1}/${embedded.length}` });
    }
    return send(res, 200, embedded);
  }

  if (method === "POST") {
    const body = await parseBody(req);
    const newRows = (Array.isArray(body) ? body : [body]).map((b) => {
      const id = b.id || randomUUID();
      const row = { id, created_at: nowIso(), updated_at: nowIso(), ...b };
      db[table].push(row);
      return row;
    });
    const header = q.select ? "return=representation" : "return=minimal";
    if (wantsSingle) return send(res, 201, newRows[0] ?? null);
    return send(res, 201, newRows, { "Content-Range": `0-${newRows.length - 1}/${newRows.length}` });
  }

  if (method === "PATCH") {
    const body = await parseBody(req);
    const updates = Array.isArray(body) ? body : [body];
    const updated = [];
    for (const u of updates) {
      const row = db[table].find((r) => matchFilters(r, filters) || (u.id && r.id === u.id));
      if (row) {
        Object.assign(row, u, { updated_at: nowIso() });
        updated.push(row);
      }
    }
    if (wantsSingle) return send(res, 200, updated[0] ?? null);
    return send(res, 200, updated);
  }

  if (method === "DELETE") {
    const before = db[table].length;
    db[table] = db[table].filter((r) => !matchFilters(r, filters));
    return send(res, 200, []);
  }

  return send(res, 405, { message: "Method not allowed" });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Auth: signup
  if (url.pathname === "/auth/v1/signup" && req.method === "POST") {
    const body = await parseBody(req);
    const id = randomUUID();
    const email = body.email;
    const existing = db.profiles.find((p) => p.email === email);
    if (existing) return send(res, 422, { msg: "User already registered", code: "user_already_exists" });
    const profile = { id, email, full_name: body?.data?.full_name || null, role: "user", created_at: nowIso(), updated_at: nowIso() };
    db.profiles.push(profile);
    const token = randomUUID();
    sessions.set(token, id);
    return send(res, 200, {
      access_token: token,
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: randomUUID(),
      user: { id, email, app_metadata: {}, user_metadata: body?.data || {}, aud: "authenticated", role: "authenticated" },
    });
  }

  // Auth: signin
  if (url.pathname === "/auth/v1/token" && req.method === "POST") {
    const body = await parseBody(req);
    const email = body.email;
    const profile = db.profiles.find((p) => p.email === email);
    if (!profile) return send(res, 400, { msg: "Invalid login credentials", code: "invalid_credentials" });
    const token = randomUUID();
    sessions.set(token, profile.id);
    return send(res, 200, {
      access_token: token,
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: randomUUID(),
      user: { id: profile.id, email, app_metadata: {}, user_metadata: {}, aud: "authenticated", role: "authenticated" },
    });
  }

  // Auth: get user
  if (url.pathname === "/auth/v1/user" && req.method === "GET") {
    const uid = authUserId(req);
    if (!uid) return send(res, 401, { msg: "Not authenticated" });
    const profile = db.profiles.find((p) => p.id === uid);
    if (!profile) return send(res, 401, { msg: "Not authenticated" });
    return send(res, 200, { id: profile.id, email: profile.email, app_metadata: {}, user_metadata: { full_name: profile.full_name }, aud: "authenticated", role: "authenticated" });
  }

  // Auth: logout
  if (url.pathname === "/auth/v1/logout" && req.method === "POST") {
    return send(res, 200, {});
  }

  // REST
  if (url.pathname.startsWith("/rest/v1/")) {
    const table = url.pathname.replace("/rest/v1/", "").split("?")[0];
    return handleRest(req, res, url, table);
  }

  return send(res, 404, { message: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[supabase-mock] listening on http://localhost:${PORT}`);
  console.log(`[supabase-mock] ANON key: ${ANON_KEY}`);
  console.log(`[supabase-mock] SERVICE key: ${SERVICE_KEY}`);
});
