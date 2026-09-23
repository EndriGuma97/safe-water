// ==========================================
// CONTACT FORM -> RESEND
// Vercel Serverless Function: POST /api/contact
//
// Env vars (Vercel -> Project -> Settings -> Environment Variables):
//   RESEND_API_KEY      required  re_xxxxxxxx
//   CONTACT_TO_EMAIL    optional  where leads are delivered (comma separated)
//   CONTACT_FROM_EMAIL  optional  sender, must be on a domain verified in Resend
// ==========================================

const { createHash } = require("crypto");

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_TO = "andrewgouma@gmail.com";
const DEFAULT_FROM = "SafeWater <noreply@dasmavip.com>";

const LIMITS = {
  name: 100,
  phone: 30,
  email: 254,
  city: 60,
  business: 120,
  message: 2000,
};

const CUSTOMER_TYPES = {
  shtepi: "Shtëpi",
  biznes: "Biznes",
};

// Same pattern browsers use for <input type="email"> (also used in js/script.js)
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Best-effort throttle per warm instance (no shared store on a static site)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 10;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanMultiline(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim().slice(0, max);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseBody(req) {
  let body;
  try {
    // Vercel's lazy req.body getter throws on malformed JSON
    body = req.body;
  } catch (e) {
    return null;
  }
  if (!body) return {};
  if (typeof body === "object" && !Buffer.isBuffer(body)) return body;
  const raw = Buffer.isBuffer(body) ? body.toString("utf8") : String(body);
  try {
    return JSON.parse(raw);
  } catch (e) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
}

function validate(input) {
  const data = {
    name: clean(input.name, LIMITS.name),
    phone: clean(input.phone, LIMITS.phone),
    email: clean(input.email, LIMITS.email).toLowerCase(),
    city: clean(input.city, LIMITS.city),
    customerType: input.customerType === "biznes" ? "biznes" : "shtepi",
    business: clean(input.business, LIMITS.business),
    message: cleanMultiline(input.message, LIMITS.message),
  };

  const errors = [];
  if (data.name.length < 2) errors.push("name");
  const digits = data.phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15 || !/^[+\d\s().-]+$/.test(data.phone)) {
    errors.push("phone");
  }
  if (data.email && !EMAIL_RE.test(data.email)) {
    errors.push("email");
  }
  if (!data.city) errors.push("city");
  if (data.customerType !== "biznes") data.business = "";

  return { data, errors };
}

function buildEmail(data) {
  const type = CUSTOMER_TYPES[data.customerType];
  const rows = [
    ["Emri", data.name],
    ["Telefoni", data.phone],
    ["Email", data.email || "-"],
    ["Qyteti", data.city],
    ["Për", type],
  ];
  if (data.business) rows.push(["Biznesi", data.business]);

  const phoneHref = data.phone.replace(/[^\d+]/g, "");
  const htmlRows = rows
    .map(([label, value]) => {
      let cell = escapeHtml(value);
      if (label === "Telefoni") cell = `<a href="tel:${escapeHtml(phoneHref)}">${cell}</a>`;
      if (label === "Email" && data.email) {
        const mailto = data.email.split("@").map(encodeURIComponent).join("@");
        cell = `<a href="mailto:${escapeHtml(mailto)}">${cell}</a>`;
      }
      return `<tr><td style="padding:8px 12px;color:#6b7280;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:8px 12px;color:#1a1a1a;font-weight:600">${cell}</td></tr>`;
    })
    .join("");

  const messageHtml = data.message
    ? `<p style="margin:24px 0 8px;color:#6b7280">Mesazhi</p><div style="padding:16px;background:#f5f9fc;border-radius:12px;color:#1a1a1a;white-space:pre-wrap">${escapeHtml(data.message)}</div>`
    : "";

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<h2 style="margin:0 0 4px;color:#03045e">Kërkesë e re për ofertë</h2>
<p style="margin:0 0 20px;color:#6b7280">Nga formulari në filtrameqera.al</p>
<table style="border-collapse:collapse;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px">${htmlRows}</table>
${messageHtml}
</div>`;

  const text = [
    "Kërkesë e re për ofertë (filtrameqera.al)",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(data.message ? ["", "Mesazhi:", data.message] : []),
  ].join("\n");

  const subjectBits = [data.name, data.city, type].filter(Boolean).join(" · ");
  return { subject: `Kërkesë për ofertë: ${subjectBits}`, html, text };
}

function wantsHtmlRedirect(req) {
  const type = String(req.headers["content-type"] || "");
  return type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data");
}

const WHATSAPP_URL = "https://wa.me/355693410332";

// Plain page for visitors whose browser posted the form without JavaScript
function resultPage(payload) {
  let title = "Faleminderit!";
  let text = "Kërkesa jote u dërgua me sukses. Do të të kontaktojmë brenda 24 orëve.";
  let link = `<a href="/">Kthehu në faqen kryesore</a>`;
  if (!payload.ok) {
    title = "Kërkesa nuk u dërgua";
    text =
      payload.error === "invalid"
        ? "Kontrollo të dhënat: emri, një numër telefoni i vlefshëm dhe qyteti janë të detyrueshëm."
        : `Provo përsëri pas pak ose na shkruaj në <a href="${WHATSAPP_URL}">WhatsApp</a>.`;
    link = `<a href="/#contact">Kthehu te formulari</a>`;
  }
  return `<!DOCTYPE html>
<html lang="sq">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex" />
<title>${title} | Filtra Uji me Qera</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#03045e 0%,#0077b6 100%);font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;padding:24px;box-sizing:border-box}
main{background:#fff;border-radius:20px;padding:40px 28px;max-width:440px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.16)}
h1{margin:0 0 12px;font-size:26px;color:#03045e}
p{margin:0 0 24px;color:#6b7280;line-height:1.6}
p a{color:#0077b6}
main>a{display:inline-block;padding:14px 28px;border-radius:50px;background:linear-gradient(135deg,#00b4d8 0%,#0077b6 100%);color:#fff;text-decoration:none;font-weight:700}
</style>
</head>
<body><main><h1>${title}</h1><p>${text}</p>${link}</main></body>
</html>`;
}

function reply(req, res, status, payload) {
  if (wantsHtmlRedirect(req)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(status).send(resultPage(payload));
  }
  return res.status(status).json(payload);
}

async function sendWithResend(apiKey, payload) {
  const body = JSON.stringify(payload);
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Resend blocks requests without a User-Agent (403, error 1010)
      "User-Agent": "filtrameqera-site/1.0",
      // Identical lead submitted again within 24h -> Resend sends it only once
      "Idempotency-Key": `contact-form/${createHash("sha256").update(body).digest("hex")}`,
    },
    body,
    signal: AbortSignal.timeout(10000),
  });
  // 409 = the same submission is already being sent
  if (response.ok || response.status === 409) return { ok: true };
  const detail = await response.text().catch(() => "");
  return { ok: false, status: response.status, detail };
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const input = parseBody(req);
  if (!input || typeof input !== "object") {
    return reply(req, res, 400, { ok: false, error: "invalid_body" });
  }

  // Honeypot: real visitors never see or fill this field
  if (clean(input.website, 200)) {
    return reply(req, res, 200, { ok: true });
  }

  const { data, errors } = validate(input);
  if (errors.length) {
    return reply(req, res, 400, { ok: false, error: "invalid", fields: errors });
  }

  // Many Albanian mobile users share one IP (CGNAT), so the limit stays generous
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return reply(req, res, 429, { ok: false, error: "rate_limited" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return reply(req, res, 500, { ok: false, error: "not_configured" });
  }

  const to = (process.env.CONTACT_TO_EMAIL || DEFAULT_TO)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  const { subject, html, text } = buildEmail(data);

  const payload = { from, to, subject, html, text };
  if (data.email) payload.reply_to = data.email;

  try {
    let result = await sendWithResend(apiKey, payload);

    // An address Resend refuses as reply_to must not cost us the lead:
    // it is still in the email body, so retry once without it
    if (!result.ok && payload.reply_to && (result.status === 400 || result.status === 422)) {
      console.error("[contact] Resend rejected the request, retrying without reply_to", result.status, result.detail);
      delete payload.reply_to;
      result = await sendWithResend(apiKey, payload);
    }

    if (!result.ok) {
      console.error("[contact] Resend error", result.status, result.detail);
      return reply(req, res, 502, { ok: false, error: "send_failed" });
    }

    return reply(req, res, 200, { ok: true });
  } catch (err) {
    console.error("[contact] Resend request failed", err);
    return reply(req, res, 502, { ok: false, error: "send_failed" });
  }
};
