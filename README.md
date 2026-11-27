# Black Friday Deal Finder — Real Deals, Verified Prices

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/aizen99829/entry-black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/aizen99829/entry-black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A Black Friday / Cyber Monday deal finder for the 2026 US sales — **24 real deals,
checked by hand on Friday 27 November 2026**, across Amazon, Best Buy, Target and
Walmart. Every deal shows the sale price, the regular price, the store, the sale
window, and a link to the store — plus an honest verdict on whether the "deal" is
actually a deal, or just a big red sticker on an ordinary price.

No network requests, no build step, no tracking. Open `app/index.html` in any
browser — desktop or phone — and it works. Search, filter by category, store and
minimum discount, sort by biggest saving, and see at a glance which discounts are
genuine and which ones deserve a second look before you pay.

## What you get

- **24 verified deals** in 7 categories — TV & Home Theater, Headphones &
  Audio, Laptops & Tablets, Gaming, Smart Home, Home & Kitchen, Wearables —
  from Amazon, Best Buy, Target and Walmart. Combined saving if you bought
  one of everything: **$5,980.99**.
- **Search** across product, brand, category and store — try "OLED",
  "AirPods" or "Dyson".
- **Filters** for category, store, and minimum discount (20/30/40/50%),
  plus a **"Real deals only"** toggle.
- **Sorting** by biggest % off, biggest $ saving, lowest or highest price,
  or name.
- **A verdict on every deal** — not just a percentage. The page scores each
  discount from its numbers:

  | Verdict | Rule | Meaning |
  | --- | --- | --- |
  | 🟢 Real deal | 40% off or more | The sale price is the story. |
  | 🟡 Fair deal | 15–39% off | A genuine saving, not a once-a-year price. |
  | 🔴 Thin deal | Under 15% off | Only if you already wanted exactly this item. |

  17 of the 24 deals are Real, 5 are Fair, and 2 are Thin — the Switch 2
  bundle (9% off, the first cut ever on the bundle) and the Mac mini M6
  (13%). A finder that calls everything a bargain is an advert; this one
  keeps all three verdicts.
- **"Also seen at" notes** where the same deal was spotted at another store,
  and a **"How this price was checked"** note on every card, with a link to
  the store and a link to the source that reported the price.
- **Caveats where they belong.** Where a "was" price is only the store's own
  "comparable value" (Best Buy's wording for the two OLED TVs), the card says
  so instead of letting the percentage do the talking.

## Run it

No dependencies, no build step, no network requests. Node 22+ is all you need.

```sh
# Fast smoke check (the default) — validates all 24 deals, the app files,
# the intact vendor file and the dossier size, then exits 0.
node main.ts

# Preview the site locally at http://127.0.0.1:4173/
node main.ts --serve

# Or just open app/index.html in any browser — desktop or phone.
```

The smoke check prints one PASS/FAIL line per check, including the deal
count, the verdict spread (Real/Fair/Thin), the combined saving, and the
deepest cut. It fails loudly if a deal is missing a field, if a sale price
is not below its regular price, if a link is not https, or if the dossier
grows past its 1.5 MB cap.

## How the prices were checked

Ten deals were read off the Target and Best Buy homepages live on Friday
27 November 2026 at 14:07 WIB. The other fourteen come from dated deal
reports that name the store and the exact price, re-confirmed by a fresh
search on 27 November 2026 before they were listed. Full table, sources and
sale windows: [`DOSSIER.md`](DOSSIER.md). Strategy and deliberate
omissions: [`STRATEGY.md`](STRATEGY.md).

Prices move hourly in Black Friday week and stock runs out — every price
here is "seen at this time", and the site tells visitors to confirm on the
store page before paying.

## What's in the repo

| Path | What it is |
| --- | --- |
| `main.ts` | Node 22 entrypoint. Default: smoke check, exit 0. `--serve`: static preview server. |
| `app/index.html` | The site. Search, filters, sorting, verdict explainer. |
| `app/styles.css` | Plain CSS, mobile-first (1 → 2 → 3 columns). |
| `app/app.js` | Rendering, filtering, sorting, verdicts. No dependencies, no network. |
| `app/deals.js` | The 24-deal catalogue (strict JSON in a classic script). |
| `vendor/makefun-frontend.ts` | Kit vendor file, copied intact, never edited. |
| `DOSSIER.md` | Deal table, verification method, sources, honesty notes. |
| `STRATEGY.md` | Why the entry was built this way. |
| `screenshots/` | Desktop and mobile screenshots of the rendered site. |

## License

MIT — see [`LICENSE`](LICENSE).
