import { NextResponse } from "next/server";

// Secret token to prevent unauthorized pings
// Set PING_SECRET env var on your server, or leave blank to disable auth
const PING_SECRET = process.env.PING_SECRET ?? "";

const SITE_URL   = "https://www.deluxesalonmusic.com";
const INDEX_KEY  = "deluxesalonmusic2026indexnow";
const URLS       = [`${SITE_URL}/`, `${SITE_URL}/about`];

async function submitIndexNow() {
  const body = {
    host:        "www.deluxesalonmusic.com",
    key:         INDEX_KEY,
    keyLocation: `${SITE_URL}/${INDEX_KEY}.txt`,
    urlList:     URLS,
  };
  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];
  const results: string[] = [];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
        signal:  AbortSignal.timeout(8000),
      });
      results.push(`${new URL(ep).hostname}: ${res.status}`);
    } catch (e: unknown) {
      results.push(`${ep}: error`);
    }
  }
  return results;
}

async function pingBingSitemap() {
  // Bing's old /ping endpoint is deprecated (returns 410 Gone)
  // IndexNow (above) is the replacement — no action needed here
  return "bing-sitemap: skipped (deprecated, covered by IndexNow)";
}

export async function POST(req: Request) {
  // Optional secret auth
  if (PING_SECRET) {
    const auth = req.headers.get("x-ping-secret") ?? "";
    if (auth !== PING_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const [indexNowResults, bingResult] = await Promise.all([
    submitIndexNow(),
    pingBingSitemap(),
  ]);

  const results = [...indexNowResults, bingResult];
  console.log("[ping] Post-deploy submissions:", results);

  return NextResponse.json({
    ok:        true,
    timestamp: new Date().toISOString(),
    results,
  });
}

// Also allow GET for manual browser testing
export async function GET(req: Request) {
  if (PING_SECRET) {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("secret") !== PING_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const [indexNowResults, bingResult] = await Promise.all([
    submitIndexNow(),
    pingBingSitemap(),
  ]);
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    results: [...indexNowResults, bingResult],
  });
}
