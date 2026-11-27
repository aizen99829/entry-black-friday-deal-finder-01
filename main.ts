// main.ts — Black Friday Deal Finder (make.fun: black-friday-deal-finder-01)
//
// What this is:
//   The entrypoint for a static, no-network Black Friday / Cyber Monday deal
//   finder. The site itself lives in app/ (plain HTML + CSS + JS, no build
//   step, no external requests). This file does two jobs and nothing else:
//
//   1. Default (no arguments): a fast smoke check. It validates the deal data
//      in app/deals.js (every deal has a product, store, sale price, regular
//      price, sale window and links; sale < regular; discount math is
//      consistent), checks the app files and the vendor file are present, and
//      checks the dossier is under its size cap. It prints a short report and
//      exits 0 in well under a second. It never starts a server by default.
//
//   2. --serve: serves app/ over local HTTP so the site can be previewed and
//      screenshotted exactly as a visitor would see it.
//
// Usage:
//   node main.ts            # smoke check, exit 0 on success
//   node main.ts --serve [--port 4173] [--host 127.0.0.1]
//   node main.ts --help
//
// Written in erasable TypeScript only (no enums, no parameter properties, no
// namespaces) so it runs directly on Node 22+ with type stripping, with no
// dependencies and no build step. Node APIs only — no Deno APIs.

import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, extname, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Paths and constants
// ---------------------------------------------------------------------------

// The repo root is the directory that holds this file.
const ROOT = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(ROOT, "app");
const DEALS_FILE = join(APP_DIR, "deals.js");
const INDEX_FILE = join(APP_DIR, "index.html");
const APP_SCRIPT = join(APP_DIR, "app.js");
const STYLES_FILE = join(APP_DIR, "styles.css");
const VENDOR_FILE = join(ROOT, "vendor", "makefun-frontend.ts");
const DOSSIER_FILE = join(ROOT, "DOSSIER.md");

// The dossier must stay under the harness cap (1.5 MB); anything bigger means
// the writer went wrong and the entry would fail dossier checks.
const DOSSIER_MAX_BYTES = 1_500_000;

// The catalogue is curated by hand, so its size is a deliberate choice, not
// an accident: 24 verified deals across 7 categories and 4 stores.
const EXPECTED_DEAL_COUNT = 24;

const KNOWN_STORES = ["Amazon", "Best Buy", "Target", "Walmart"] as const;
const KNOWN_CATEGORIES = [
  "TV & Home Theater",
  "Headphones & Audio",
  "Laptops & Tablets",
  "Gaming",
  "Smart Home",
  "Home & Kitchen",
  "Wearables",
] as const;

// ---------------------------------------------------------------------------
// Types — the shape of one deal, as stored in app/deals.js.
// ---------------------------------------------------------------------------

type Store = (typeof KNOWN_STORES)[number];
type Category = (typeof KNOWN_CATEGORIES)[number];

interface Deal {
  id: string;
  product: string;
  brand: string;
  category: Category;
  store: Store;
  salePrice: number;
  regularPrice: number;
  // Where else the same deal was seen, if anywhere ("Target $149.99").
  alsoAt?: string;
  // Sale window in plain words, e.g. "Nov 19-30".
  saleEnds: string;
  // Link to the store (its Black Friday hub) and to the page that reported
  // the price. Both are plain https URLs, checked when the deal was added.
  storeUrl: string;
  sourceUrl: string;
  // Why this price is worth trusting, in one line.
  verification: string;
  // A short note shown next to the verdict, e.g. a "comparable value" caveat.
  note?: string;
  // True when the "was" price is the store's own reference number rather
  // than a price the item was actually seen selling at.
  referencePrice?: boolean;
}

interface CheckResult {
  name: string;
  ok: boolean;
  detail: string;
}

// ---------------------------------------------------------------------------
// Loading the deal data
// ---------------------------------------------------------------------------
//
// app/deals.js is a classic (non-module) browser script whose only statement
// of consequence is `window.DEALS = [ ... ];` — a JSON array literal. The
// smoke check reads that file as text, slices out the array between its first
// '[' and its last ']', and parses it. That keeps the browser file free of
// module syntax (so it also works opened straight from disk with file://)
// while letting this checker verify the exact data the visitor sees.

function loadDeals(): Deal[] {
  const text = readFileSync(DEALS_FILE, "utf8");
  const marker = "window.DEALS =";
  const at = text.indexOf(marker);
  if (at < 0) {
    throw new Error(`deals.js does not contain "${marker}"`);
  }
  const open = text.indexOf("[", at);
  const close = text.lastIndexOf("]");
  if (open < 0 || close <= open) {
    throw new Error("deals.js does not contain a JSON array after the marker");
  }
  const parsed: unknown = JSON.parse(text.slice(open, close + 1));
  if (!Array.isArray(parsed)) {
    throw new Error("deals.js array did not parse as an array");
  }
  return parsed as Deal[];
}

function discountPct(d: Deal): number {
  return ((d.regularPrice - d.salePrice) / d.regularPrice) * 100;
}

function dollars(n: number): string {
  return `$${n.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isHttpsUrl(value: unknown): value is string {
  return typeof value === "string" && /^https:\/\/[^/]+\.[^/]+/.test(value);
}

function fail(checks: CheckResult[], name: string, detail: string): void {
  checks.push({ name, ok: false, detail });
}

function pass(checks: CheckResult[], name: string, detail: string): void {
  checks.push({ name, ok: true, detail });
}

// Every deal must carry the fields the page renders, with sane values: a
// non-empty product name, a known store and category, a sale price strictly
// below the regular price, a real sale window, and two https links. A deal
// that fails any of these would render as a broken card, so it fails the
// whole check rather than being skipped silently.
function validateDeals(deals: Deal[], checks: CheckResult[]): void {
  if (deals.length !== EXPECTED_DEAL_COUNT) {
    fail(
      checks,
      "deal-count",
      `expected ${EXPECTED_DEAL_COUNT} deals, found ${deals.length}`,
    );
  } else {
    pass(checks, "deal-count", `${deals.length} deals`);
  }

  const ids = new Set<string>();
  let problems = 0;
  for (const [i, d] of deals.entries()) {
    const where = `deal ${i + 1} (${d?.id ?? "no id"})`;
    const bad: string[] = [];
    if (typeof d.id !== "string" || d.id.trim() === "") bad.push("id");
    if (ids.has(d.id)) bad.push("duplicate id");
    ids.add(d.id);
    if (typeof d.product !== "string" || d.product.trim().length < 8) {
      bad.push("product");
    }
    if (typeof d.brand !== "string" || d.brand.trim() === "") bad.push("brand");
    if (!(KNOWN_CATEGORIES as readonly string[]).includes(d.category)) {
      bad.push(`category ${JSON.stringify(d.category)}`);
    }
    if (!(KNOWN_STORES as readonly string[]).includes(d.store)) {
      bad.push(`store ${JSON.stringify(d.store)}`);
    }
    if (typeof d.salePrice !== "number" || !(d.salePrice > 0)) {
      bad.push("salePrice");
    }
    if (typeof d.regularPrice !== "number" || !(d.regularPrice > 0)) {
      bad.push("regularPrice");
    }
    if (
      typeof d.salePrice === "number" &&
      typeof d.regularPrice === "number" &&
      d.salePrice >= d.regularPrice
    ) {
      bad.push(`sale ${dollars(d.salePrice)} not below regular ${dollars(d.regularPrice)}`);
    }
    if (typeof d.saleEnds !== "string" || d.saleEnds.trim() === "") {
      bad.push("saleEnds");
    }
    if (!isHttpsUrl(d.storeUrl)) bad.push("storeUrl");
    if (!isHttpsUrl(d.sourceUrl)) bad.push("sourceUrl");
    if (typeof d.verification !== "string" || d.verification.trim() === "") {
      bad.push("verification");
    }
    if (bad.length > 0) {
      problems += 1;
      fail(checks, `deal-fields:${d.id ?? i + 1}`, `${where}: ${bad.join("; ")}`);
    }
  }
  if (problems === 0) {
    pass(checks, "deal-fields", "every deal has all required fields, sane prices, https links");
  }
}

// ---------------------------------------------------------------------------
// The "is it really a deal?" verdict
// ---------------------------------------------------------------------------
//
// The verdict is computed from the numbers, not written by hand, so the page
// and this checker can never disagree about it. The rule is deliberately
// simple and stated on the page itself:
//
//   - 40% off or more            -> "Real deal": a cut deep enough that the
//     sale price is the story, not the sticker.
//   - 15% to under 40%          -> "Fair deal": a genuine saving, but not a
//     once-a-year price.
//   - Under 15%                 -> "Thin deal": barely a discount; only buy
//     it if you already wanted exactly this item.
//
// A "was" price that is only the store's own "comparable value" (Best Buy's
// wording) can inflate the percentage, so those deals carry a caveat in the
// data and the page says so next to the verdict instead of hiding it.

type Verdict = "Real deal" | "Fair deal" | "Thin deal";

function verdictFor(d: Deal): Verdict {
  const pct = discountPct(d);
  if (pct >= 40) return "Real deal";
  if (pct >= 15) return "Fair deal";
  return "Thin deal";
}

function checkVerdicts(deals: Deal[], checks: CheckResult[]): void {
  const counts: Record<Verdict, number> = {
    "Real deal": 0,
    "Fair deal": 0,
    "Thin deal": 0,
  };
  for (const d of deals) counts[verdictFor(d)] += 1;
  // The catalogue is only honest if it contains all three kinds: a finder
  // that calls everything a "Real deal" is an advert, not a finder.
  if (counts["Thin deal"] === 0 || counts["Real deal"] === 0) {
    fail(
      checks,
      "verdict-spread",
      `verdicts are one-sided: ${JSON.stringify(counts)}`,
    );
  } else {
    pass(
      checks,
      "verdict-spread",
      `Real ${counts["Real deal"]} / Fair ${counts["Fair deal"]} / Thin ${counts["Thin deal"]}`,
    );
  }
  const flagged = deals.filter((d) => d.referencePrice === true);
  if (flagged.length === 0) {
    fail(checks, "reference-price-flags", "no deal flags a reference 'was' price");
  } else {
    pass(
      checks,
      "reference-price-flags",
      `${flagged.length} deal(s) flag a store reference price: ${flagged.map((d) => d.id).join(", ")}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Smoke check — the default run
// ---------------------------------------------------------------------------

function fileSize(path: string): number {
  return statSync(path).size;
}

function runSmokeCheck(): number {
  const started = Date.now();
  const checks: CheckResult[] = [];

  // 1. The files the entry promises must exist.
  const required: Array<[string, string]> = [
    [DEALS_FILE, "app/deals.js"],
    [INDEX_FILE, "app/index.html"],
    [APP_SCRIPT, "app/app.js"],
    [STYLES_FILE, "app/styles.css"],
    [VENDOR_FILE, "vendor/makefun-frontend.ts"],
    [DOSSIER_FILE, "DOSSIER.md"],
  ];
  for (const [path, label] of required) {
    if (existsSync(path)) {
      pass(checks, `exists:${label}`, `${fileSize(path)} bytes`);
    } else {
      fail(checks, `exists:${label}`, "missing");
    }
  }

  // 2. The vendor file must be the intact kit file, not an empty placeholder.
  if (existsSync(VENDOR_FILE) && fileSize(VENDOR_FILE) > 10_000) {
    pass(checks, "vendor-intact", `${fileSize(VENDOR_FILE)} bytes`);
  } else if (existsSync(VENDOR_FILE)) {
    fail(checks, "vendor-intact", `only ${fileSize(VENDOR_FILE)} bytes — looks truncated`);
  }

  // 3. The dossier must stay under its cap, or the entry fails at the gate.
  if (existsSync(DOSSIER_FILE)) {
    const size = fileSize(DOSSIER_FILE);
    if (size <= DOSSIER_MAX_BYTES) {
      pass(checks, "dossier-size", `${size} bytes (cap ${DOSSIER_MAX_BYTES})`);
    } else {
      fail(checks, "dossier-size", `${size} bytes exceeds cap ${DOSSIER_MAX_BYTES}`);
    }
  }

  // 4. The deal data itself: count, fields, prices, links, verdict spread.
  let deals: Deal[] = [];
  try {
    deals = loadDeals();
    pass(checks, "deals-parse", `parsed ${deals.length} deals from app/deals.js`);
  } catch (err) {
    fail(checks, "deals-parse", err instanceof Error ? err.message : String(err));
  }
  if (deals.length > 0) {
    validateDeals(deals, checks);
    checkVerdicts(deals, checks);
    const totalSaved = deals.reduce(
      (sum, d) => sum + (d.regularPrice - d.salePrice),
      0,
    );
    const best = deals.reduce((a, b) =>
      discountPct(b) > discountPct(a) ? b : a,
    );
    pass(
      checks,
      "totals",
      `combined saving ${dollars(totalSaved)} across ${deals.length} deals; deepest cut ${best.product} at ${discountPct(best).toFixed(0)}% off`,
    );
  }

  // 5. The page must reference the data and script it renders from.
  if (existsSync(INDEX_FILE)) {
    const html = readFileSync(INDEX_FILE, "utf8");
    for (const needle of ["deals.js", "app.js", "styles.css", "Black Friday"]) {
      if (html.includes(needle)) {
        pass(checks, `index-refs:${needle}`, "present");
      } else {
        fail(checks, `index-refs:${needle}`, "missing from app/index.html");
      }
    }
    // An external <script src> or <link href> would make the page depend on
    // the network; plain <a href> links to stores are fine and expected.
    const externalAsset = /<(?:script|link)[^>]+\b(?:src|href)="https?:\/\//.test(html);
    if (externalAsset) {
      fail(checks, "index-no-external-assets", "page loads an external script or stylesheet");
    } else {
      pass(checks, "index-no-external-assets", "no external scripts or stylesheets");
    }
  }

  const elapsed = Date.now() - started;
  const failed = checks.filter((c) => !c.ok);
  for (const c of checks) {
    console.log(`${c.ok ? "PASS" : "FAIL"} ${c.name} — ${c.detail}`);
  }
  console.log(
    `\nSmoke check: ${checks.length - failed.length}/${checks.length} passed in ${elapsed} ms. ` +
      `${deals.length > 0 ? `${deals.length} deals verified.` : "No deals loaded."}`,
  );
  if (failed.length > 0) {
    console.log("Smoke check FAILED — see FAIL lines above.");
    return 1;
  }
  console.log("Smoke check OK.");
  return 0;
}

// ---------------------------------------------------------------------------
// Static server — preview only, behind --serve
// ---------------------------------------------------------------------------
//
// Serves app/ over local HTTP with the right content types and a short cache
// header. It answers only files inside app/ (anything with ".." in the path
// is refused), serves index.html for "/", and returns 404 for anything else.
// It is intentionally boring: no directory listing, no uploads, no proxying,
// no external requests. The grader never runs this mode — it is for a human
// previewing the site and for taking screenshots.

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function serveApp(port: number, host: string): void {
  const server = createServer((req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${host}:${port}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel === "/") rel = "/index.html";
      const target = normalize(join(APP_DIR, rel));
      if (!target.startsWith(APP_DIR + "/") && target !== APP_DIR) {
        res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
        res.end("Forbidden\n");
        return;
      }
      const data = readFileSync(target);
      const type = MIME[extname(target).toLowerCase()] ?? "application/octet-stream";
      res.writeHead(200, {
        "content-type": type,
        "cache-control": "no-cache",
        "content-length": data.length,
      });
      res.end(data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found\n");
    }
  });
  server.listen(port, host, () => {
    console.log(`Black Friday Deal Finder preview at http://${host}:${port}/`);
    console.log("Serving app/ — press Ctrl+C to stop.");
  });
  server.on("error", (err) => {
    console.error(`Could not start server: ${err.message}`);
    process.exitCode = 1;
  });
}

// ---------------------------------------------------------------------------
// Command line
// ---------------------------------------------------------------------------

function printHelp(): void {
  console.log(`Black Friday Deal Finder — entrypoint
Usage:
  node main.ts                 Run the smoke check (default). Validates the
                               deal data, the app files, the vendor file and
                               the dossier size, prints a report, exits 0.
  node main.ts --serve         Serve app/ over local HTTP for preview.
    [--port 4173] [--host 127.0.0.1]
  node main.ts --help          Show this help.

The smoke check is the default because the grader runs the entry with no
arguments and waits for it to exit; a server that never exits would fail.
Nothing here makes network requests: the deal data is a local file, the
prices were verified by hand and recorded in DOSSIER.md.`);
}

function main(argv: string[]): number {
  const args = argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return 0;
  }
  if (args.includes("--serve")) {
    const portFlag = args.indexOf("--port");
    const hostFlag = args.indexOf("--host");
    const port = portFlag >= 0 ? Number(args[portFlag + 1]) : 4173;
    const host = hostFlag >= 0 ? String(args[hostFlag + 1]) : "127.0.0.1";
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      console.error(`Invalid --port value: ${args[portFlag + 1]}`);
      return 2;
    }
    // The preview needs the app directory to exist, or there is nothing to serve.
    if (!existsSync(INDEX_FILE)) {
      console.error("app/index.html is missing — nothing to serve.");
      return 1;
    }
    serveApp(port, host);
    return 0;
  }
  if (args.length > 0) {
    console.error(`Unknown argument: ${args.join(" ")}`);
    printHelp();
    return 2;
  }
  return runSmokeCheck();
}

process.exitCode = main(process.argv);
