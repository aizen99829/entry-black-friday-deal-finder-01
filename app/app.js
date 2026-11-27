// app.js — rendering and filtering for the Black Friday Deal Finder.
//
// Plain browser JavaScript, no dependencies, no network: it reads the
// catalogue from window.DEALS (app/deals.js, loaded before this file) and
// renders it into #deal-grid. Every control on the page is wired here:
// search, category, store, minimum discount, sort order, and the
// "Real deals only" toggle. The verdict rule is the same one main.ts checks
// on the server side, so the page and the smoke check can never disagree.

(function () {
  "use strict";

  var DEALS = (window.DEALS || []).slice();

  // -- Small helpers ---------------------------------------------------------

  function money(n) {
    return "$" + n.toFixed(2).replace(/\.00$/, "");
  }

  function pct(d) {
    return ((d.regularPrice - d.salePrice) / d.regularPrice) * 100;
  }

  function saved(d) {
    return d.regularPrice - d.salePrice;
  }

  // The verdict rule, stated on the page: >=40% Real, 15-39% Fair, <15% Thin.
  function verdict(d) {
    var p = pct(d);
    if (p >= 40) return { label: "Real deal", cls: "real" };
    if (p >= 15) return { label: "Fair deal", cls: "fair" };
    return { label: "Thin deal", cls: "thin" };
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // -- Controls --------------------------------------------------------------

  var searchEl = document.getElementById("search");
  var categoryEl = document.getElementById("category");
  var storeEl = document.getElementById("store");
  var minDiscountEl = document.getElementById("min-discount");
  var sortEl = document.getElementById("sort");
  var realOnlyEl = document.getElementById("real-only");
  var gridEl = document.getElementById("deal-grid");
  var emptyEl = document.getElementById("empty");
  var countEl = document.getElementById("result-count");

  // Fill the category and store dropdowns from the data itself, so the
  // controls can never list a value no deal carries.
  function fillSelect(el, values) {
    values.forEach(function (v) {
      var opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      el.appendChild(opt);
    });
  }

  function unique(values) {
    var seen = {};
    var out = [];
    values.forEach(function (v) {
      if (!seen[v]) {
        seen[v] = true;
        out.push(v);
      }
    });
    return out.sort();
  }

  fillSelect(
    categoryEl,
    unique(DEALS.map(function (d) { return d.category; }))
  );
  fillSelect(
    storeEl,
    unique(DEALS.map(function (d) { return d.store; }))
  );

  // -- Filtering and sorting -------------------------------------------------

  function currentFilters() {
    return {
      q: (searchEl.value || "").trim().toLowerCase(),
      category: categoryEl.value,
      store: storeEl.value,
      minDiscount: Number(minDiscountEl.value || 0),
      sort: sortEl.value,
      realOnly: !!realOnlyEl.checked,
    };
  }

  function applyFilters(list, f) {
    var out = list.filter(function (d) {
      if (f.category && d.category !== f.category) return false;
      if (f.store && d.store !== f.store) return false;
      if (pct(d) < f.minDiscount) return false;
      if (f.realOnly && verdict(d).cls !== "real") return false;
      if (f.q) {
        var hay = (d.product + " " + d.brand + " " + d.category + " " + d.store).toLowerCase();
        if (hay.indexOf(f.q) === -1) return false;
      }
      return true;
    });
    var sorts = {
      "pct-desc": function (a, b) { return pct(b) - pct(a); },
      "saved-desc": function (a, b) { return saved(b) - saved(a); },
      "price-asc": function (a, b) { return a.salePrice - b.salePrice; },
      "price-desc": function (a, b) { return b.salePrice - a.salePrice; },
      "name-asc": function (a, b) { return a.product.localeCompare(b.product); },
    };
    out.sort(sorts[f.sort] || sorts["pct-desc"]);
    return out;
  }

  // -- Rendering -------------------------------------------------------------

  function cardHtml(d) {
    var v = verdict(d);
    var p = pct(d);
    var note = d.note
      ? '<p class="note">' + esc(d.note) + "</p>"
      : "";
    var alsoAt = d.alsoAt
      ? '<p class="also">Also seen at ' + esc(d.alsoAt) + "</p>"
      : "";
    var refFlag = d.referencePrice
      ? '<p class="note ref">“Was” price is the store’s own reference value — see the note above.</p>'
      : "";
    return (
      '<article class="card" data-id="' + esc(d.id) + '">' +
      '<div class="card-top"><span class="category">' + esc(d.category) + "</span>" +
      '<span class="store">' + esc(d.store) + "</span></div>" +
      '<h3>' + esc(d.product) + "</h3>" +
      '<p class="brand">' + esc(d.brand) + "</p>" +
      '<p class="prices"><span class="sale">' + money(d.salePrice) + "</span> " +
      '<span class="was"><s>' + money(d.regularPrice) + "</s></span> " +
      '<span class="pct">-' + p.toFixed(0) + "%</span></p>" +
      '<p class="saved">You save ' + money(saved(d)) + "</p>" +
      '<p><span class="badge ' + v.cls + '">' + v.label + "</span> " +
      '<span class="ends">Sale ends ' + esc(d.saleEnds) + "</span></p>" +
      note + alsoAt + refFlag +
      '<p class="links"><a href="' + esc(d.storeUrl) + '" target="_blank" rel="noopener">Shop at ' +
      esc(d.store) + " &rarr;</a> " +
      '<a href="' + esc(d.sourceUrl) + '" target="_blank" rel="noopener">Price source</a></p>' +
      '<details><summary>How this price was checked</summary><p>' +
      esc(d.verification) + "</p></details>" +
      "</article>"
    );
  }

  function renderStats() {
    var totalSaved = DEALS.reduce(function (s, d) { return s + saved(d); }, 0);
    var realCount = DEALS.filter(function (d) { return verdict(d).cls === "real"; }).length;
    var stores = unique(DEALS.map(function (d) { return d.store; })).length;
    document.getElementById("stat-deals").textContent = String(DEALS.length);
    document.getElementById("stat-saving").textContent = money(totalSaved);
    document.getElementById("stat-real").textContent = String(realCount);
    document.getElementById("stat-stores").textContent = String(stores);
  }

  function render() {
    var f = currentFilters();
    var list = applyFilters(DEALS, f);
    gridEl.innerHTML = list.map(cardHtml).join("");
    emptyEl.hidden = list.length !== 0;
    countEl.textContent =
      list.length === DEALS.length
        ? "Showing all " + DEALS.length + " deals."
        : "Showing " + list.length + " of " + DEALS.length + " deals.";
  }

  // -- Wiring ----------------------------------------------------------------

  [searchEl, categoryEl, storeEl, minDiscountEl, sortEl, realOnlyEl].forEach(
    function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    }
  );

  renderStats();
  render();
})();
