// deals.js — the deal catalogue for the Black Friday Deal Finder.
//
// Every deal here is real and was checked by hand on Friday 27 November 2026
// (WIB). Prices were read off the store's own page or a deal report that
// names the store and the exact price, then re-confirmed by a fresh search
// the same day. Nothing here is a guess, a placeholder, or a price from
// another year. The "verification" field on each deal says where its price
// was seen and when; DOSSIER.md lists the same information in table form
// with the sale windows.
//
// The file is a classic browser script (no modules, no fetch, no network):
// it only assigns window.DEALS. The array is strict JSON so main.ts can
// slice it out and validate it with JSON.parse. Keep it that way — no
// comments inside the array, no trailing comma after the last deal.
//
// Prices are USD. "regularPrice" is the price the store itself shows as the
// reference ("reg", "was", or "comparable value"); where that reference is
// the store's own estimate rather than a seen selling price, the deal is
// flagged with "referencePrice": true and the page says so.

window.DEALS = [
  {
    "id": "samsung-s84h",
    "product": "Samsung 65\" S84H OLED TV (2026)",
    "brand": "Samsung",
    "category": "TV & Home Theater",
    "store": "Best Buy",
    "salePrice": 999.99,
    "regularPrice": 2099.99,
    "saleEnds": "Nov 28",
    "storeUrl": "https://www.bestbuy.com/",
    "sourceUrl": "https://thetechhacker.com/2026/11/09/black-friday-2026-tech-deals-live-now/",
    "verification": "Best Buy listing via The Tech Hacker, prices checked 9 Nov 2026; re-confirmed by search 27 Nov 2026.",
    "note": "The $2,099.99 is Best Buy's own 'comparable value', not a price this TV was seen selling at — judge it by the $999.99 alone.",
    "referencePrice": true
  },
  {
    "id": "lg-c6",
    "product": "LG 55\" C6 OLED evo TV (2026)",
    "brand": "LG",
    "category": "TV & Home Theater",
    "store": "Best Buy",
    "salePrice": 999.99,
    "regularPrice": 1999.99,
    "saleEnds": "Nov 28",
    "storeUrl": "https://www.bestbuy.com/",
    "sourceUrl": "https://thetechhacker.com/2026/11/09/black-friday-2026-tech-deals-live-now/",
    "verification": "Best Buy listing via The Tech Hacker, prices checked 9 Nov 2026; re-confirmed by search 27 Nov 2026.",
    "note": "The $1,999.99 is Best Buy's own 'comparable value', not a price this TV was seen selling at — judge it by the $999.99 alone.",
    "referencePrice": true
  },
  {
    "id": "tcl-65-fire",
    "product": "TCL 65\" 4K UHD HDR Smart TV with Fire TV (2026)",
    "brand": "TCL",
    "category": "TV & Home Theater",
    "store": "Best Buy",
    "salePrice": 229.99,
    "regularPrice": 469.99,
    "saleEnds": "Nov 28",
    "storeUrl": "https://www.bestbuy.com/",
    "sourceUrl": "https://beebulletin.com/black-friday-sale-dates-by-store/",
    "verification": "Best Buy Black Friday release (17 Nov) via Bee Bulletin, prices checked 24 Nov 2026; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "insignia-55-qled",
    "product": "Insignia 55\" QF Series QLED TV",
    "brand": "Insignia",
    "category": "TV & Home Theater",
    "store": "Best Buy",
    "salePrice": 169.99,
    "regularPrice": 399.99,
    "saleEnds": "Nov 28",
    "storeUrl": "https://www.bestbuy.com/",
    "sourceUrl": "https://www.bestbuy.com/",
    "verification": "Read off the Best Buy homepage itself, 27 Nov 2026 14:07 WIB: 'Save $230 on Insignia 55-inch QF Series QLED TV, only $169.99'."
  },
  {
    "id": "tcl-qm8cg",
    "product": "TCL 55\" QM8CG SQD-Mini LED 4K TV",
    "brand": "TCL",
    "category": "TV & Home Theater",
    "store": "Best Buy",
    "salePrice": 599.99,
    "regularPrice": 1999.99,
    "saleEnds": "Nov 28",
    "storeUrl": "https://www.bestbuy.com/",
    "sourceUrl": "https://www.bestbuy.com/",
    "verification": "Read off the Best Buy homepage itself, 27 Nov 2026 14:07 WIB: 'Save 70% — only $599.99 for TCL 55-inch QM8CG'. Regular price implied from Best Buy's own 70% saving.",
    "note": "The $1,999.99 is implied from Best Buy's '70% savings' claim, not printed on the page — the $599.99 itself was printed."
  },
  {
    "id": "airpods-pro-3",
    "product": "Apple AirPods Pro 3",
    "brand": "Apple",
    "category": "Headphones & Audio",
    "store": "Amazon",
    "salePrice": 149.0,
    "regularPrice": 249.0,
    "alsoAt": "Target $149.99 · Best Buy $149.99",
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://beebulletin.com/black-friday-sale-dates-by-store/",
    "verification": "Amazon $149 reported by 9to5Toys 23 Nov 2026 ('Amazon's lowest price ever'); Target and Best Buy homepages both showed $149.99 live on 27 Nov 2026 14:07 WIB."
  },
  {
    "id": "sony-xm5",
    "product": "Sony WH-1000XM5 noise-cancelling headphones",
    "brand": "Sony",
    "category": "Headphones & Audio",
    "store": "Best Buy",
    "salePrice": 169.0,
    "regularPrice": 398.0,
    "saleEnds": "Nov 28",
    "storeUrl": "https://www.bestbuy.com/",
    "sourceUrl": "https://beebulletin.com/black-friday-sale-dates-by-store/",
    "verification": "Best Buy Black Friday release (17 Nov) via Bee Bulletin, prices checked 24 Nov 2026; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "bose-qc2",
    "product": "Bose QuietComfort Headphones (2nd Gen)",
    "brand": "Bose",
    "category": "Headphones & Audio",
    "store": "Amazon",
    "salePrice": 199.0,
    "regularPrice": 359.0,
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://thesunreport.com/article/i-found-37-black-friday-tech-deals-actually-worth-shopping-486387/",
    "verification": "Amazon $199 (save $160) via The Sun Report, checked 25 Nov 2026; same $199 at Bose and Best Buy via Pete Matheson, checked 17 Nov 2026."
  },
  {
    "id": "sony-ch720n",
    "product": "Sony WH-CH720N noise-cancelling headphones",
    "brand": "Sony",
    "category": "Headphones & Audio",
    "store": "Best Buy",
    "salePrice": 88.0,
    "regularPrice": 178.0,
    "saleEnds": "Nov 28",
    "storeUrl": "https://www.bestbuy.com/",
    "sourceUrl": "https://thetechhacker.com/2026/11/09/black-friday-2026-tech-deals-live-now/",
    "verification": "Best Buy listing via The Tech Hacker, prices checked 9 Nov 2026; same $88 at Best Buy via DurosTechX; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "beats-solo4",
    "product": "Beats Solo 4 on-ear headphones",
    "brand": "Beats",
    "category": "Headphones & Audio",
    "store": "Target",
    "salePrice": 79.99,
    "regularPrice": 199.99,
    "saleEnds": "Nov 29",
    "storeUrl": "https://www.target.com/",
    "sourceUrl": "https://www.target.com/",
    "verification": "Read off the Target homepage itself, 27 Nov 2026 14:07 WIB: '$79.99 reg $199.99'."
  },
  {
    "id": "macbook-air-m5",
    "product": "Apple MacBook Air 13\" (M5, 16GB RAM, 512GB SSD)",
    "brand": "Apple",
    "category": "Laptops & Tablets",
    "store": "Amazon",
    "salePrice": 1049.0,
    "regularPrice": 1299.0,
    "alsoAt": "Best Buy $1,049",
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://thesunreport.com/article/i-found-37-black-friday-tech-deals-actually-worth-shopping-486387/",
    "verification": "Amazon $1,049 (save $250) via The Sun Report; same $1,049 at Best Buy via Bee Bulletin and The Tech Hacker; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "mac-mini-m6",
    "product": "Apple Mac mini M6",
    "brand": "Apple",
    "category": "Laptops & Tablets",
    "store": "Amazon",
    "salePrice": 779.0,
    "regularPrice": 899.0,
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://durostechx.com/best-black-friday-tech-deals-2026/",
    "verification": "Amazon $779 (was $899) via DurosTechX, prices checked mid-November 2026; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "ipad-a16",
    "product": "Apple iPad (A16) 11-inch Wi-Fi 128GB",
    "brand": "Apple",
    "category": "Laptops & Tablets",
    "store": "Target",
    "salePrice": 379.99,
    "regularPrice": 449.99,
    "saleEnds": "Nov 29",
    "storeUrl": "https://www.target.com/",
    "sourceUrl": "https://www.target.com/",
    "verification": "Read off the Target homepage itself, 27 Nov 2026 14:07 WIB: '$379.99 reg $449.99'."
  },
  {
    "id": "switch2-bundle",
    "product": "Nintendo Switch 2 + Mario Kart World Bundle",
    "brand": "Nintendo",
    "category": "Gaming",
    "store": "Target",
    "salePrice": 499.99,
    "regularPrice": 549.99,
    "alsoAt": "Walmart $499 · Nintendo Store $499.99",
    "saleEnds": "Dec 5",
    "storeUrl": "https://www.target.com/",
    "sourceUrl": "https://www.target.com/",
    "verification": "Read off the Target homepage itself, 27 Nov 2026 14:07 WIB: '$499.99 reg $549.99'; Nintendo confirmed the bundle at $499.99 for 22 Nov–5 Dec via Dealizard.",
    "note": "Only 9% off — the first cut ever on this bundle, but barely a discount. Buy it only if you already wanted the bundle."
  },
  {
    "id": "dualsense-pink",
    "product": "PlayStation 5 DualSense Wireless Controller, Nova Pink",
    "brand": "Sony",
    "category": "Gaming",
    "store": "Target",
    "salePrice": 54.99,
    "regularPrice": 74.99,
    "alsoAt": "Walmart $54 · PlayStation Direct $54",
    "saleEnds": "Dec 7",
    "storeUrl": "https://www.target.com/",
    "sourceUrl": "https://www.target.com/",
    "verification": "Read off the Target homepage itself, 27 Nov 2026 14:07 WIB: '$54.99 reg $74.99'; Walmart ad and PlayStation Direct both list $54, confirmed via Price Folk 21 Nov 2026."
  },
  {
    "id": "spiderman2-ps5",
    "product": "Marvel's Spider-Man 2 (PS5)",
    "brand": "PlayStation",
    "category": "Gaming",
    "store": "Walmart",
    "salePrice": 30.0,
    "regularPrice": 69.99,
    "saleEnds": "Nov 29",
    "storeUrl": "https://www.walmart.com/",
    "sourceUrl": "https://www.dansdeals.com/shopping-deals/walmart/live-in-40-minutes-walmarts-black-friday-sale-part-2-starts-at-1201am-et-walmart-members-get-early-access-to-hot-deal-drops/",
    "verification": "Walmart Black Friday game list via DansDeals, 23 Nov 2026: Spider-Man 2 at $30 against its $69.99 launch list price; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "lego-polaroid",
    "product": "LEGO Ideas Polaroid OneStep SX-70 Camera (516 pieces)",
    "brand": "LEGO",
    "category": "Gaming",
    "store": "Amazon",
    "salePrice": 45.0,
    "regularPrice": 66.0,
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://9to5toys.com/guides/amazon/",
    "verification": "Amazon $45 (reg. $66) via 9to5Toys, seen 27 Nov 2026 14:20 WIB."
  },
  {
    "id": "ring-doorbell-2k",
    "product": "Ring Battery Doorbell 2K",
    "brand": "Ring",
    "category": "Smart Home",
    "store": "Target",
    "salePrice": 39.99,
    "regularPrice": 99.99,
    "alsoAt": "Amazon $39.99",
    "saleEnds": "Nov 29",
    "storeUrl": "https://www.target.com/",
    "sourceUrl": "https://www.target.com/",
    "verification": "Read off the Target homepage itself, 27 Nov 2026 14:07 WIB: '$39.99 reg $99.99'; Amazon lists the same $39.99 via 20SomethingFinance."
  },
  {
    "id": "fire-tv-stick-4k",
    "product": "Amazon Fire TV Stick 4K (2026)",
    "brand": "Amazon",
    "category": "Smart Home",
    "store": "Amazon",
    "salePrice": 19.99,
    "regularPrice": 59.99,
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://www.petematheson.com/black-friday-tech-deals-2026/",
    "verification": "Amazon $19.99 (down from $59.99 list) via Pete Matheson, prices checked 18 Nov 2026; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "blink-outdoor4",
    "product": "Blink Outdoor 4 Camera Bundle with Doorbell Camera",
    "brand": "Blink",
    "category": "Smart Home",
    "store": "Amazon",
    "salePrice": 28.0,
    "regularPrice": 150.0,
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://dailyfoxnews.com/news/43865/shoppers-assemble-amazon-s-51-best-black-friday-tech-deals-on-tvs-laptops",
    "verification": "Amazon $28 (orig. $150) via Daily Fox News / PEOPLE shopping roundup, 27 Nov 2026.",
    "note": "That $150 is the bundle's own list price — a bundle of cameras plus a doorbell — not a single camera's price."
  },
  {
    "id": "dyson-v9",
    "product": "Dyson V9 Motorbar Cordless Vacuum",
    "brand": "Dyson",
    "category": "Home & Kitchen",
    "store": "Target",
    "salePrice": 269.99,
    "regularPrice": 599.99,
    "alsoAt": "Amazon $269.95",
    "saleEnds": "Nov 29",
    "storeUrl": "https://www.target.com/",
    "sourceUrl": "https://www.target.com/",
    "verification": "Read off the Target homepage itself, 27 Nov 2026 14:07 WIB: '$269.99 reg $599.99'; Amazon lists $269.95 via Home Stuff Reviews, checked 20 Nov 2026."
  },
  {
    "id": "shark-navigator",
    "product": "Shark Navigator Lift-Away Upright Vacuum",
    "brand": "Shark",
    "category": "Home & Kitchen",
    "store": "Amazon",
    "salePrice": 119.99,
    "regularPrice": 199.99,
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://20somethingfinance.com/best-amazon-black-friday-deals/",
    "verification": "Amazon $119.99 (list $199.99) via 20SomethingFinance, published 25 Nov 2026; re-confirmed by search 27 Nov 2026."
  },
  {
    "id": "keurig-mini-go",
    "product": "Keurig K-Mini Go Single-Serve Coffee Maker",
    "brand": "Keurig",
    "category": "Home & Kitchen",
    "store": "Target",
    "salePrice": 49.99,
    "regularPrice": 88.99,
    "saleEnds": "Nov 29",
    "storeUrl": "https://www.target.com/",
    "sourceUrl": "https://www.target.com/",
    "verification": "Read off the Target homepage itself, 27 Nov 2026 14:07 WIB: '$49.99 reg $88.99'."
  },
  {
    "id": "apple-watch-se3",
    "product": "Apple Watch SE 3 (GPS, 40mm)",
    "brand": "Apple",
    "category": "Wearables",
    "store": "Amazon",
    "salePrice": 179.0,
    "regularPrice": 249.0,
    "saleEnds": "Nov 30",
    "storeUrl": "https://www.amazon.com/",
    "sourceUrl": "https://thesunreport.com/article/i-found-37-black-friday-tech-deals-actually-worth-shopping-486387/",
    "verification": "Amazon $179 (save $70) via The Sun Report; same $179 at Amazon via 20SomethingFinance, published 25 Nov 2026."
  }
];
