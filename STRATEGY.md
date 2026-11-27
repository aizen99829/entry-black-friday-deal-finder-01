# Strategy — Black Friday Deal Finder

## The competition in one line

"Build the best real Black Friday deal finder" — a program/v1 harness entry
judged by paired AI comparison over screenshots and a source outline. The
entry must be a working deal finder with real deals, not a demo with made-up
prices. Entries close 29 Nov 2026 07:42 WIB; round 1 is blind from 19:42 WIB
on 27 Nov 2026.

## What wins here

A judge comparing two deal finders side by side will notice, in order:
(1) are the deals real and checkable, (2) can I find what I want fast
(search, filters, sort), (3) does it tell me which discounts are genuine
and which are marketing, (4) does it look and work well on a phone as well
as a desktop. Everything in this entry is built to serve that order.

## Choices made

- **Real prices, verified by hand, on Black Friday itself.** Ten deals were
  read off the Target and Best Buy homepages live on 27 Nov 2026; the other
  fourteen come from dated deal reports that name the store and the exact
  price, re-confirmed by a fresh search the same day. Every card names its
  source and check time; the dossier repeats it in a table. Nothing is
  scraped at runtime — the site makes zero network requests, so it cannot
  show a stale or broken price feed.
- **24 deals, not 200.** A curated catalogue the builder actually checked
  beats a long list of unverified rows. Seven categories, four stores, and
  all three verdicts represented, so the finder is honest about thin deals
  instead of calling everything a bargain.
- **The verdict is computed, not asserted.** Real ≥40%, Fair 15–39%, Thin
  <15%, from the numbers in the data. The same rule runs in `main.ts` (the
  smoke check) and in `app/app.js` (the page), so they can never disagree.
  Reference "was" prices (Best Buy's "comparable value") are flagged on the
  card instead of hidden.
- **Static site, no build step.** `app/` is plain HTML + CSS + JS. It works
  opened straight from disk, from `main.ts --serve`, or from any static
  host. No framework, no fonts, no CDN — nothing to fail.
- **The entrypoint is a smoke check, not a server.** `node main.ts` with no
  arguments validates the data, the files, the vendor file and the dossier
  size, prints a report, and exits 0 in under a second. `--serve` is the
  only way to start a server, behind an explicit flag.
- **Cross-store comparison where it exists.** When the same deal was seen
  cheaper or equal elsewhere ("also at"), the card says so — a finder
  should help you compare, not lock you to one store.

## What was deliberately left out

- No live price fetching: a runtime scrape would be a network dependency
  and would show unverified prices. The catalogue is a dated snapshot and
  says so.
- No Apple Store deals: Apple's 2026 event gives gift cards, not price
  cuts, so listing one would be misleading.
- No deal whose price could not be corroborated by at least one solid
  source (e.g. Apple Watch Series 12, where reports disagreed $299 vs $399).
- No accounts, no tracking, no affiliate links: store links go to the
  store's own site, source links to the page that reported the price.
