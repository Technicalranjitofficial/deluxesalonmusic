#!/usr/bin/env node
/**
 * submit-site.js — Legitimate site submission script for deluxesalonmusic.com
 *
 * What this does (all safe, Google-approved methods):
 *   1. IndexNow  — notifies Bing, Yandex, DuckDuckGo to crawl immediately
 *   2. Bing URL submission via IndexNow protocol
 *   3. Ping-o-Matic — pings 15+ blog/web directories
 *   4. Google ping (unofficial but functional)
 *   5. Checks if your site is already indexed in Google
 *
 * Run after every deploy:
 *   node submit-site.js
 *
 * Requirements: Node.js 18+ (uses built-in fetch)
 */

const SITE_URL  = "https://www.deluxesalonmusic.com";
const SITE_NAME = "Deluxe Salon Music";

// URLs to submit (homepage + about page)
const URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/about`,
  `${SITE_URL}/sitemap.xml`,
];

// IndexNow key — generate one at https://www.indexnow.org/documentation
// Format: any random hex string, must also be hosted at /<key>.txt on your site
// For now using a placeholder — see instructions at end of script
const INDEXNOW_KEY = "deluxesalonmusic2026indexnow";

// ─── colours ────────────────────────────────────────────────────────────────
const c = {
  reset:  "\x1b[0m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  yellow: "\x1b[33m",
  cyan:   "\x1b[36m",
  dim:    "\x1b[2m",
  bold:   "\x1b[1m",
};
const ok   = (msg) => console.log(`  ${c.green}✓${c.reset} ${msg}`);
const fail = (msg) => console.log(`  ${c.red}✗${c.reset} ${msg}`);
const info = (msg) => console.log(`  ${c.cyan}→${c.reset} ${msg}`);
const warn = (msg) => console.log(`  ${c.yellow}⚠${c.reset} ${msg}`);

// ─── helpers ─────────────────────────────────────────────────────────────────
async function post(url, body, headers = {}) {
  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(10000),
    });
    return { ok: res.ok, status: res.status, text: await res.text().catch(() => "") };
  } catch (e) {
    return { ok: false, status: 0, text: e.message };
  }
}

async function get(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return { ok: res.ok, status: res.status, text: await res.text().catch(() => "") };
  } catch (e) {
    return { ok: false, status: 0, text: e.message };
  }
}

// ─── 1. IndexNow (Bing + Yandex + DuckDuckGo) ───────────────────────────────
async function submitIndexNow() {
  console.log(`\n${c.bold}[1] IndexNow — Bing / Yandex / DuckDuckGo${c.reset}`);

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  const body = {
    host:       "www.deluxesalonmusic.com",
    key:        INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList:    URLS,
  };

  for (const endpoint of endpoints) {
    const name = new URL(endpoint).hostname;
    const res  = await post(endpoint, body);
    if (res.status === 200 || res.status === 202) {
      ok(`${name} — accepted (${res.status})`);
    } else if (res.status === 422) {
      warn(`${name} — key not hosted yet (422). See step below.`);
    } else if (res.status === 403) {
      warn(`${name} — key mismatch (403). Check INDEXNOW_KEY.`);
    } else {
      fail(`${name} — ${res.status || "network error"}: ${res.text.slice(0, 80)}`);
    }
  }
}

// ─── 2. Bing Webmaster direct ping ──────────────────────────────────────────
async function pingBing() {
  console.log(`\n${c.bold}[2] Bing Sitemap Ping${c.reset}`);
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const pingUrl    = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  const res        = await get(pingUrl);
  if (res.ok) {
    ok(`Bing sitemap ping accepted`);
  } else {
    fail(`Bing ping — ${res.status}: ${res.text.slice(0, 80)}`);
  }
}

// ─── 3. Google Sitemap Ping (unofficial, still functional) ──────────────────
async function pingGoogle() {
  console.log(`\n${c.bold}[3] Google Sitemap Ping${c.reset}`);
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const pingUrl    = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  const res        = await get(pingUrl);
  if (res.status === 200 || res.status === 204) {
    ok(`Google sitemap ping accepted`);
  } else {
    warn(`Google ping returned ${res.status} (may still be processed)`);
  }
}

// ─── 4. Ping-o-Matic (notifies 15+ web directories) ─────────────────────────
async function pingOMatic() {
  console.log(`\n${c.bold}[4] Ping-o-Matic (web directories)${c.reset}`);
  // Ping-o-Matic uses a web form, so we use the XML-RPC endpoint
  const xmlBody = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value><string>${SITE_NAME}</string></value></param>
    <param><value><string>${SITE_URL}</string></value></param>
    <param><value><string>${SITE_URL}/sitemap.xml</string></value></param>
  </params>
</methodCall>`;

  const services = [
    { name: "Ping-o-Matic",  url: "http://rpc.pingomatic.com/"    },
    { name: "Ping.in",        url: "http://ping.in/ping/"          },
    { name: "WeblogUpdates",  url: "http://www.weblogues.com/RPC/" },
  ];

  for (const svc of services) {
    try {
      const res = await fetch(svc.url, {
        method:  "POST",
        headers: { "Content-Type": "text/xml" },
        body:    xmlBody,
        signal:  AbortSignal.timeout(8000),
      });
      if (res.ok) {
        ok(`${svc.name} — pinged`);
      } else {
        warn(`${svc.name} — ${res.status}`);
      }
    } catch (e) {
      warn(`${svc.name} — ${e.message.slice(0, 60)}`);
    }
  }
}

// ─── 5. Check if site is indexed in Google ──────────────────────────────────
async function checkIndexed() {
  console.log(`\n${c.bold}[5] Google Index Check${c.reset}`);
  // Use Google's "site:" search — if it returns results, you're indexed
  const searchUrl = `https://www.google.com/search?q=site:www.deluxesalonmusic.com`;
  const res = await get(searchUrl);
  if (res.ok) {
    const isIndexed = res.text.includes("deluxesalonmusic.com") &&
                      !res.text.includes("did not match any documents");
    if (isIndexed) {
      ok(`Site appears indexed in Google`);
    } else {
      warn(`Site not yet indexed — submit to Google Search Console`);
      info(`→ https://search.google.com/search-console`);
    }
  } else {
    warn(`Could not check Google index (${res.status})`);
  }
}

// ─── 6. Check live site health ───────────────────────────────────────────────
async function checkSiteHealth() {
  console.log(`\n${c.bold}[6] Site Health Check${c.reset}`);

  const checks = [
    { label: "Homepage",    url: `${SITE_URL}/`           },
    { label: "About page",  url: `${SITE_URL}/about`      },
    { label: "Sitemap",     url: `${SITE_URL}/sitemap.xml` },
    { label: "Robots.txt",  url: `${SITE_URL}/robots.txt`  },
    { label: "Favicon",     url: `${SITE_URL}/favicon.svg` },
  ];

  for (const { label, url } of checks) {
    const res = await get(url);
    if (res.status === 200) {
      ok(`${label} — ${res.status} OK`);
    } else {
      fail(`${label} — ${res.status} (${url})`);
    }
  }

  // Check canonical
  const homeRes = await get(`${SITE_URL}/`);
  if (homeRes.ok) {
    const hasCanonical = homeRes.text.includes('rel="canonical"');
    const canonicalWww = homeRes.text.includes('canonical" href="https://www.deluxesalonmusic.com"');
    if (canonicalWww) {
      ok(`Canonical URL — points to www correctly`);
    } else if (hasCanonical) {
      warn(`Canonical found but may not point to www — check layout.tsx`);
    } else {
      fail(`No canonical tag found`);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}╔══════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║   Deluxe Salon Music — Site Submitter   ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════╝${c.reset}`);
  console.log(`${c.dim}  Target: ${SITE_URL}${c.reset}\n`);

  await checkSiteHealth();
  await submitIndexNow();
  await pingBing();
  await pingGoogle();
  await pingOMatic();
  await checkIndexed();

  console.log(`\n${c.bold}${c.green}══════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}${c.green}  Done! Run this after every deploy.${c.reset}`);
  console.log(`${c.bold}${c.green}══════════════════════════════════════════${c.reset}`);

  console.log(`
${c.bold}NEXT STEPS — Manual (one-time):${c.reset}

${c.yellow}A) Host the IndexNow key file${c.reset}
   Create file: public/${INDEXNOW_KEY}.txt
   Contents:    ${INDEXNOW_KEY}
   Then redeploy — IndexNow submissions will be accepted.

${c.yellow}B) Google Search Console (most important)${c.reset}
   1. Go to https://search.google.com/search-console
   2. Add property: https://www.deluxesalonmusic.com
   3. Verify via DNS TXT record (Cloudflare makes this easy)
   4. Submit sitemap: ${SITE_URL}/sitemap.xml
   5. Click "Request Indexing" on the URL inspection tool

${c.yellow}C) Bing Webmaster Tools${c.reset}
   1. Go to https://www.bing.com/webmasters
   2. Add site and submit sitemap

${c.yellow}D) Free directory submissions (one-time, safe):${c.reset}
   • https://www.dmoz-odp.org
   • https://www.ezilon.com/submit.html
   • https://www.somuch.com/submit-links/
   • https://www.exactseek.com/add.html
`);
}

main().catch(console.error);
