/* =========================================================
   RasaRuang Web Self-Order — Prototipe Interaktif (Vanilla JS)
   Alur: Katalog → Kustomisasi (Bottom Sheet) → Checkout → Pembayaran → Status
   ========================================================= */
(() => {
  "use strict";

  /* ---------------- Konfigurasi ---------------- */
  const CONFIG = {
    TAX_RATE: 0.10,          // Pajak PB1 (dapat diatur, 0 untuk menonaktifkan)
    SERVICE_FEE: 0,          // Biaya layanan/kemasan Dine-in
    PAY_TIMEOUT_SEC: 600,    // 10:00 menit
    FIRST_ORDER_NO: 84,      // #RR-084
    STORAGE_KEY: "rasaruang-selforder-v1",
    MERCHANT: "RasaRuang Everyday Dining",
  };

  /* ---------------- Ikon (Lucide, stroke) ---------------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
    "shopping-bag": '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    armchair: '<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M5 18v2M19 18v2"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    "qr-code": '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"/>',
    landmark: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11"/>',
    "chef-hat": '<path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/><path d="M6 17h12"/>',
    "concierge": '<path d="M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z"/><path d="M20 16a8 8 0 1 0-16 0M12 4v4M10 4h4"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  };
  const icon = (name) =>
    `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
  const hydrateIcons = (root = document) =>
    root.querySelectorAll("[data-icon]:empty").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));

  /* ---------------- Data Katalog (PRD §5) ---------------- */
  const CATEGORIES = [
    { id: "paket", label: "Paket Hemat", emoji: "🔥" },
    { id: "bowl", label: "Rice Bowl", emoji: "🍚" },
    { id: "drink", label: "Minuman", emoji: "🥤" },
    { id: "snack", label: "Snack", emoji: "🍟" },
  ];

  const PRODUCTS = [
    { id: "PKT-01", cat: "paket", name: "Paket Kombo Ruang 1 (Ayam + Es Teh)", desc: "Nasi hangat + Ayam Crispy Sambal Bawang + Telur Ceplok + Es Teh Manis.", price: 28000, emoji: "🍱", badges: ["Terlaris"], normal: 33000 },
    { id: "PKT-02", cat: "paket", name: "Paket Kombo Ruang 2 (Sapi + Kopi Susu)", desc: "Beef Teriyaki Rice Bowl + Scramble Egg + Es Kopi Susu Gula Aren.", price: 38000, emoji: "🥩", badges: ["Paket Hemat"], normal: 45000 },
    { id: "PKT-03", cat: "paket", name: "Paket Duo Sahabat (2 Rice Bowl + 2 Minum)", desc: "2 Chicken Katsu Mentai Bowl + 2 Lemon Tea Segar. Lebih hemat Rp 10.000.", price: 58000, emoji: "👫", badges: ["Hemat Rp 10.000"], normal: 68000, drinkCount: 2 },
    { id: "RB-01", cat: "bowl", name: "Beef Bulgogi Truffle Bowl", desc: "Irisan daging sapi manis gurih khas Korea di atas nasi hangat dan rumput laut.", price: 32000, emoji: "🥢", badges: [] },
    { id: "RB-02", cat: "bowl", name: "Chicken Crispy Sambal Matah Bali", desc: "Ayam fillet goreng renyah disiram sambal matah segar racikan khas RasaRuang.", price: 25000, emoji: "🍗", badges: ["Terlaris"] },
    { id: "RB-03", cat: "bowl", name: "Chicken Katsu Torch Mentai Bowl", desc: "Chicken katsu tebal dengan saus mentai creamy yang dibakar (torched) harum.", price: 27000, emoji: "🔥", badges: ["Favorit"] },
    { id: "RB-04", cat: "bowl", name: "Dori Crispy Saus Telur Asin", desc: "Ikan dori fillet tepung renyah berpadu saus salted egg gurih dan daun kari.", price: 29000, emoji: "🐟", badges: [] },
    { id: "MNM-01", cat: "drink", name: "Es Kopi Susu RasaRuang", desc: "Perpaduan espresso house blend, susu creamy, dan gula aren murni pilihan.", price: 18000, emoji: "☕", badges: ["Terlaris"] },
    { id: "MNM-02", cat: "drink", name: "Fresh Lychee Yakult Breeze", desc: "Minuman segar perpaduan Yakult, sirup leci premium, dan buah leci asli.", price: 16000, emoji: "🧋", badges: [] },
    { id: "MNM-03", cat: "drink", name: "Artisan Iced Lemon Tea", desc: "Seduhan teh hitam wangi dengan perasan jeruk lemon segar penghilang dahaga.", price: 12000, emoji: "🍋", badges: [] },
    { id: "SNK-01", cat: "snack", name: "Crispy Nori Tempura & Fries", desc: "Kentang goreng renyah dan rumput laut tempura dengan saus keju spesial.", price: 17000, emoji: "🍟", badges: [] },
    { id: "SNK-02", cat: "snack", name: "Gyoza Ayam Panggang (Isi 5)", desc: "Dumpling ayam lembut dipanggang renyah di bagian bawah dengan saus chili oil.", price: 19000, emoji: "🥟", badges: ["Baru"] },
  ];
  const productById = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------------- Modifier (PRD Layar 2) ---------------- */
  const SPICE = [
    { id: 0, name: "Tidak Pedas", sub: "Gurih", price: 0 },
    { id: 1, name: "Pedas Santai", sub: "Sedikit hangat", price: 0 },
    { id: 2, name: "Pedas Sedang", sub: "Nendang", price: 0 },
    { id: 3, name: "Pedas Ruang Maksimal", sub: "Untuk pecinta pedas sejati", price: 2000 },
  ];
  const TOPPINGS = [
    { id: "egg", name: "Telur Mata Sapi", price: 5000 },
    { id: "cheese", name: "Keju Mozzarella Melt", price: 6000 },
    { id: "sambal", name: "Ekstra Sambal Bawang", price: 3000 },
    { id: "rice", name: "Ekstra Nasi Putih", price: 5000 },
  ];
  const PKG_DRINKS = [
    { id: "teh", name: "Es Teh Manis Ruang", price: 0 },
    { id: "jeruk", name: "Es Jeruk Peras", price: 3000 },
    { id: "kopi", name: "Es Kopi Susu Ruang", price: 6000 },
  ];
  const SUGAR = [
    { id: "normal", name: "Normal Sugar" },
    { id: "less", name: "Less Sugar" },
    { id: "none", name: "No Sugar" },
  ];
  const ICE = [
    { id: "normal", name: "Normal Ice" },
    { id: "less", name: "Less Ice" },
  ];
  // Opsi apa saja yang berlaku per kategori
  const optionsFor = (p) => ({
    spice: p.cat === "paket" || p.cat === "bowl",
    toppings: p.cat === "paket" || p.cat === "bowl",
    drink: p.cat === "paket",
    sugarIce: p.cat === "drink",
  });

  /* ---------------- Util ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const rp = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const chilis = (lvl, max = 3) =>
    `<span class="chilis">${Array.from({ length: max }, (_, i) => `<span class="${i < lvl ? "" : "off"}">🌶️</span>`).join("")}</span>`;
  const fmtTime = (ts) => new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const fmtDate = (ts) => new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  // Gambar produk: coba .jpg → .png → fallback emoji
  const imgHTML = (p) =>
    `<img src="assets/menu/${p.id.toLowerCase()}.jpg" alt="${esc(p.name)}" loading="lazy" data-try="png" data-emoji="${p.emoji}" />`;
  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.dataset.emoji) return;
      if (img.dataset.try === "png") {
        img.dataset.try = "none";
        img.src = img.src.replace(/\.jpg$/, ".png");
      } else {
        img.outerHTML = `<div class="fallback">${img.dataset.emoji}</div>`;
      }
    },
    true
  );

  /* ---------------- Nomor Meja dari QR (?table=08) ---------------- */
  const params = new URLSearchParams(location.search);
  const rawTable = (params.get("table") || params.get("meja") || "08").replace(/\D/g, "") || "08";
  const TABLE = rawTable.padStart(2, "0").slice(-3);

  /* ---------------- State + LocalStorage ---------------- */
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {}; } catch { return {}; }
  })();
  const state = {
    cart: Array.isArray(saved.cart) ? saved.cart.filter((i) => productById(i.productId)) : [],
    guest: saved.guest || { name: "", phone: "" },
    payMethod: saved.payMethod || "qris",
    order: saved.order || null,
    orderSeq: saved.orderSeq || CONFIG.FIRST_ORDER_NO,
  };
  const persist = () => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
        cart: state.cart, guest: state.guest, payMethod: state.payMethod, order: state.order, orderSeq: state.orderSeq,
      }));
    } catch { /* storage penuh / mode privat */ }
  };

  /* ---------------- Kalkulasi Harga ---------------- */
  function unitPrice(item) {
    const p = productById(item.productId);
    let price = p.price;
    if (item.spice != null) price += SPICE[item.spice].price;
    (item.toppings || []).forEach((t) => (price += TOPPINGS.find((x) => x.id === t)?.price || 0));
    if (item.drink) price += (PKG_DRINKS.find((d) => d.id === item.drink)?.price || 0) * (p.drinkCount || 1);
    return price;
  }
  const lineTotal = (item) => unitPrice(item) * item.qty;
  const cartCount = () => state.cart.reduce((s, i) => s + i.qty, 0);
  function totals(items = state.cart) {
    const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
    const service = CONFIG.SERVICE_FEE;
    const tax = Math.round(subtotal * CONFIG.TAX_RATE);
    return { subtotal, service, tax, total: subtotal + service + tax };
  }
  const itemKey = (i) =>
    [i.productId, i.spice ?? "", [...(i.toppings || [])].sort().join("+"), i.drink || "", i.sugar || "", i.ice || "", (i.note || "").trim().toLowerCase()].join("|");

  function modsText(item) {
    const p = productById(item.productId);
    const parts = [];
    if (item.spice != null) parts.push(`Level ${item.spice} · ${SPICE[item.spice].name}`);
    if (item.drink) parts.push(`Minum: ${PKG_DRINKS.find((d) => d.id === item.drink).name}${p.drinkCount > 1 ? ` ×${p.drinkCount}` : ""}`);
    if (item.sugar) parts.push(SUGAR.find((s) => s.id === item.sugar).name);
    if (item.ice) parts.push(ICE.find((s) => s.id === item.ice).name);
    (item.toppings || []).forEach((t) => parts.push("+ " + TOPPINGS.find((x) => x.id === t).name));
    return parts;
  }

  /* =========================================================
     LAYAR 1 — KATALOG
     ========================================================= */
  function renderGreeting() {
    const h = new Date().getHours();
    const waktu = h < 11 ? "pagi" : h < 15 ? "siang" : h < 18 ? "sore" : "malam";
    $("#greeting-title").textContent = `Selamat ${waktu}, mau makan apa hari ini? 👋`;
    $$(".js-table").forEach((el) => (el.textContent = TABLE));
    document.title = `RasaRuang · Meja #${TABLE} · Self-Order`;
  }

  function renderCategories() {
    $("#cat-scroll").innerHTML = CATEGORIES.map(
      (c, i) => `<button class="cat-pill${i === 0 ? " active" : ""}" data-cat="${c.id}">${c.emoji} ${c.label}</button>`
    ).join("");
  }

  const qtyInCart = (pid) => state.cart.filter((i) => i.productId === pid).reduce((s, i) => s + i.qty, 0);

  function badgesHTML(p) {
    return p.badges.map((b) => `<span class="badge">${esc(b)}</span>`).join("");
  }

  function renderCatalog() {
    const q = $("#search-input").value.trim().toLowerCase();
    const match = (p) => !q || (p.name + " " + p.desc + " " + CATEGORIES.find((c) => c.id === p.cat).label).toLowerCase().includes(q);
    let anyVisible = false;

    $("#catalog").innerHTML = CATEGORIES.map((c) => {
      const items = PRODUCTS.filter((p) => p.cat === c.id && match(p));
      if (!items.length) return "";
      anyVisible = true;
      const head = `<div class="section-head"><h2>${c.emoji} ${c.label}</h2><span>${items.length} menu</span></div>`;

      if (c.id === "paket") {
        return `<section class="cat-section" id="sec-${c.id}" data-cat="${c.id}">${head}
          <div class="paket-scroll">${items.map((p) => {
            const n = qtyInCart(p.id);
            return `<article class="paket-card" data-open="${p.id}">
              <div class="p-img food-img">${imgHTML(p)}
                ${p.badges[0] ? `<span class="badge img-badge">${esc(p.badges[0])}</span>` : ""}
                ${n ? `<span class="in-cart-badge">${n}</span>` : ""}
              </div>
              <div class="p-body">
                <h3>${esc(p.name)}</h3>
                <p>${esc(p.desc)}</p>
                <div class="p-foot">
                  <div><span class="price">${rp(p.price)}</span>${p.normal ? `<span class="price-strike">${rp(p.normal)}</span>` : ""}</div>
                  <button class="btn-add" data-add="${p.id}" aria-label="Tambah ${esc(p.name)}">${icon("plus")} Tambah</button>
                </div>
              </div>
            </article>`;
          }).join("")}</div></section>`;
      }

      return `<section class="cat-section" id="sec-${c.id}" data-cat="${c.id}">${head}
        <div class="menu-list">${items.map((p) => {
          const n = qtyInCart(p.id);
          return `<article class="menu-item" data-open="${p.id}">
            <div class="m-img food-img">${imgHTML(p)}${n ? `<span class="in-cart-badge">${n}</span>` : ""}</div>
            <div class="m-body">
              ${p.badges.length ? `<div class="badges-inline">${badgesHTML(p)}</div>` : ""}
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.desc)}</p>
              <div class="m-foot">
                <span class="price">${rp(p.price)}</span>
                <button class="btn-add" data-add="${p.id}" aria-label="Tambah ${esc(p.name)}">${icon("plus")} Tambah</button>
              </div>
            </div>
          </article>`;
        }).join("")}</div></section>`;
    }).join("");

    $("#empty-search").classList.toggle("hidden", anyVisible);
    $("#promo-banner").classList.toggle("hidden", !!q);
    $("#search-clear").classList.toggle("hidden", !q);
    updateSpy();
  }

  /* --- Sticky category + Auto-Spy Scroll --- */
  let spyLock = 0;
  function setActivePill(catId) {
    $$(".cat-pill").forEach((b) => {
      const on = b.dataset.cat === catId;
      if (on && !b.classList.contains("active")) {
        const sc = $("#cat-scroll");
        sc.scrollTo({ left: b.offsetLeft - sc.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
      }
      b.classList.toggle("active", on);
    });
  }
  function updateSpy() {
    if (currentView !== "menu") return;
    const bar = $("#cat-bar");
    bar.classList.toggle("stuck", bar.getBoundingClientRect().top <= 0.5);
    if (Date.now() < spyLock) return;
    const line = bar.getBoundingClientRect().bottom + 24;
    const secs = $$(".cat-section");
    if (!secs.length) return;
    let active = secs[0].dataset.cat;
    secs.forEach((s) => { if (s.getBoundingClientRect().top <= line) active = s.dataset.cat; });
    // jika sudah mentok bawah, aktifkan section terakhir
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = secs[secs.length - 1].dataset.cat;
    setActivePill(active);
  }
  function scrollToCat(catId) {
    const sec = $(`#sec-${catId}`);
    if (!sec) return;
    const barH = $("#cat-bar").offsetHeight;
    const top = sec.getBoundingClientRect().top + window.scrollY - barH + 2;
    spyLock = Date.now() + 700;
    setActivePill(catId);
    window.scrollTo({ top, behavior: "smooth" });
  }

  /* --- Floating Cart Bar --- */
  function renderCartBar() {
    const n = cartCount();
    const bar = $("#cart-bar");
    $("#cart-badge").textContent = n;
    $("#cart-count").textContent = `${n} Item`;
    $("#cart-total").textContent = rp(totals().subtotal);
    bar.classList.toggle("show", n > 0 && currentView === "menu");
  }
  function bumpCart() {
    const bar = $("#cart-bar");
    bar.classList.remove("bump");
    void bar.offsetWidth;
    bar.classList.add("bump");
  }

  /* =========================================================
     LAYAR 2 — BOTTOM SHEET KUSTOMISASI
     ========================================================= */
  let sheet = null; // { product, editKey, spice, toppings:Set, drink, sugar, ice, note, qty }

  function openSheet(productId, editKey = null) {
    const p = productById(productId);
    const o = optionsFor(p);
    const existing = editKey ? state.cart.find((i) => i.key === editKey) : null;
    sheet = {
      product: p,
      editKey,
      spice: existing ? existing.spice : o.spice ? null : undefined,
      toppings: new Set(existing?.toppings || []),
      drink: existing ? existing.drink : o.drink ? null : undefined,
      sugar: existing?.sugar || (o.sugarIce ? "normal" : undefined),
      ice: existing?.ice || (o.sugarIce ? "normal" : undefined),
      note: existing?.note || "",
      qty: existing?.qty || 1,
    };

    $("#sheet-img").className = "sheet-img food-img";
    $("#sheet-img").innerHTML = imgHTML(p);
    $("#sheet-badges").innerHTML = p.badges.length ? `<div class="badges-inline">${badgesHTML(p)}</div>` : "";
    $("#sheet-title").textContent = p.name;
    $("#sheet-desc").textContent = p.desc;
    $("#sheet-price").innerHTML = `${rp(p.price)}${p.normal ? `<span class="price-strike">${rp(p.normal)}</span>` : ""}`;
    $("#sheet-note").value = sheet.note;
    $("#note-count").textContent = sheet.note.length;

    let html = "";
    if (o.spice) {
      html += `<div class="opt-group" data-group="spice">
        <div class="opt-head"><h4>Pilih Level Pedas</h4><span class="tag-required">Wajib · Pilih 1</span></div>
        <p class="opt-sub">Sesuaikan tingkat kepedasan sesuai selera Anda.</p>
        <div class="spice-grid">${SPICE.map((s) => `
          <button type="button" class="spice-chip" data-spice="${s.id}" aria-pressed="false">
            <div class="lvl">Level ${s.id}</div>
            <div class="ch">${s.id === 0 ? "😋" : "🌶️".repeat(s.id)}</div>
            <div class="nm">${s.id === 3 ? "Maksimal" : s.name.replace("Pedas ", "")}</div>
            ${s.price ? `<div class="ex">+${rp(s.price)}</div>` : ""}
          </button>`).join("")}
        </div>
        <p class="spice-desc" id="spice-desc">Ketuk salah satu level di atas.</p>
      </div>`;
    }
    if (o.drink) {
      const mult = p.drinkCount || 1;
      html += `<div class="opt-group" data-group="drink">
        <div class="opt-head"><h4>Pilihan Minuman Paket</h4><span class="tag-required">Wajib · Pilih 1</span></div>
        <p class="opt-sub">${mult > 1 ? `Berlaku untuk ${mult} gelas minuman dalam paket.` : "Minuman yang termasuk dalam paket."}</p>
        ${PKG_DRINKS.map((d) => `
          <label class="option">
            <input type="radio" name="drink" value="${d.id}" />
            <span class="ctrl radio">${icon("check")}</span>
            <span class="o-label">${d.name}${mult > 1 ? ` <small>×${mult} gelas</small>` : ""}</span>
            <span class="o-price ${d.price ? "" : "free"}">${d.price ? "+" + rp(d.price * mult) : "Gratis"}</span>
          </label>`).join("")}
      </div>`;
    }
    if (o.toppings) {
      html += `<div class="opt-group" data-group="toppings">
        <div class="opt-head"><h4>Ekstra Topping</h4><span class="tag-optional">Opsional · Bisa pilih banyak</span></div>
        <p class="opt-sub">Bikin makin puas dengan tambahan favoritmu.</p>
        ${TOPPINGS.map((t) => `
          <label class="option">
            <input type="checkbox" name="topping" value="${t.id}" />
            <span class="ctrl check">${icon("check")}</span>
            <span class="o-label">${t.name}</span>
            <span class="o-price">+${rp(t.price)}</span>
          </label>`).join("")}
      </div>`;
    }
    if (o.sugarIce) {
      html += `<div class="opt-group" data-group="sugar">
        <div class="opt-head"><h4>Tingkat Gula</h4><span class="tag-required ok">Wajib · Pilih 1</span></div>
        ${SUGAR.map((s) => `
          <label class="option"><input type="radio" name="sugar" value="${s.id}" /><span class="ctrl radio">${icon("check")}</span>
          <span class="o-label">${s.name}</span><span class="o-price free">Gratis</span></label>`).join("")}
      </div>
      <div class="opt-group" data-group="ice">
        <div class="opt-head"><h4>Takaran Es</h4><span class="tag-required ok">Wajib · Pilih 1</span></div>
        ${ICE.map((s) => `
          <label class="option"><input type="radio" name="ice" value="${s.id}" /><span class="ctrl radio">${icon("check")}</span>
          <span class="o-label">${s.name}</span><span class="o-price free">Gratis</span></label>`).join("")}
      </div>`;
    }
    $("#sheet-options").innerHTML = html;

    // set nilai awal
    if (sheet.spice != null) syncSpice(sheet.spice);
    if (sheet.drink) $(`#sheet-options input[name=drink][value=${sheet.drink}]`).checked = true;
    sheet.toppings.forEach((t) => ($(`#sheet-options input[name=topping][value=${t}]`).checked = true));
    if (sheet.sugar) $(`#sheet-options input[name=sugar][value=${sheet.sugar}]`).checked = true;
    if (sheet.ice) $(`#sheet-options input[name=ice][value=${sheet.ice}]`).checked = true;

    updateSheetPrice();
    $("#sheet-scroll").scrollTop = 0;
    $("#sheet-overlay").classList.add("show");
    $("#product-sheet").classList.add("show");
    document.body.classList.add("no-scroll");
  }

  function syncSpice(lvl) {
    sheet.spice = lvl;
    $$(".spice-chip").forEach((c) => {
      const on = +c.dataset.spice === lvl;
      c.classList.toggle("active", on);
      c.setAttribute("aria-pressed", on);
    });
    const s = SPICE[lvl];
    const d = $("#spice-desc");
    if (d) d.innerHTML = `<b>Level ${s.id} — ${s.name}</b>${chilis(s.id)} · ${s.sub}${s.price ? ` · <b class="ex">+${rp(s.price)}</b>` : ""}`;
    const g = $('[data-group="spice"]');
    g?.classList.remove("invalid");
    g?.querySelector(".tag-required")?.classList.add("ok");
  }

  function closeSheet() {
    $("#sheet-overlay").classList.remove("show");
    $("#product-sheet").classList.remove("show");
    document.body.classList.remove("no-scroll");
    sheet = null;
  }

  function sheetAsItem() {
    return {
      productId: sheet.product.id,
      spice: sheet.spice === undefined ? undefined : sheet.spice,
      toppings: [...sheet.toppings],
      drink: sheet.drink || undefined,
      sugar: sheet.sugar,
      ice: sheet.ice,
      note: sheet.note.trim(),
      qty: sheet.qty,
    };
  }

  function updateSheetPrice() {
    const item = sheetAsItem();
    if (item.spice === null) item.spice = undefined;
    const total = unitPrice(item) * sheet.qty;
    $("#qty-value").textContent = sheet.qty;
    $("#qty-minus").disabled = sheet.qty <= 1;
    $("#sheet-add-btn").textContent = `${sheet.editKey ? "Simpan Perubahan" : "Tambah ke Pesanan"} - ${rp(total)}`;
  }

  function validateSheet() {
    const missing = [];
    if (sheet.spice === null) missing.push("spice");
    if (sheet.drink === null) missing.push("drink");
    missing.forEach((g) => {
      const el = $(`[data-group="${g}"]`);
      el.classList.remove("invalid");
      void el.offsetWidth;
      el.classList.add("invalid");
    });
    if (missing.length) {
      const first = $(`[data-group="${missing[0]}"]`);
      $("#sheet-scroll").scrollTo({ top: first.offsetTop - 10, behavior: "smooth" });
      toast(missing[0] === "spice" ? "Pilih level pedas terlebih dahulu 🌶️" : "Pilih minuman paket terlebih dahulu 🥤", false);
    }
    return !missing.length;
  }

  function submitSheet() {
    if (!validateSheet()) return;
    const item = sheetAsItem();
    item.key = itemKey(item);
    const wasEdit = !!sheet.editKey;
    if (wasEdit) state.cart = state.cart.filter((i) => i.key !== sheet.editKey);
    const same = state.cart.find((i) => i.key === item.key);
    if (same) same.qty += item.qty; else state.cart.push(item);
    const name = sheet.product.name;
    closeSheet();
    persist();
    refreshAll();
    bumpCart();
    toast(wasEdit ? "Pesanan diperbarui" : `${item.qty}× ${name} ditambahkan`);
  }

  // Tambah cepat (untuk menu tanpa opsi wajib → langsung masuk keranjang)
  function quickAdd(productId) {
    const p = productById(productId);
    const o = optionsFor(p);
    if (o.spice || o.drink) return openSheet(productId);
    const item = { productId, toppings: [], note: "", qty: 1, sugar: o.sugarIce ? "normal" : undefined, ice: o.sugarIce ? "normal" : undefined };
    item.key = itemKey(item);
    const same = state.cart.find((i) => i.key === item.key);
    if (same) same.qty += 1; else state.cart.push(item);
    persist();
    refreshAll();
    bumpCart();
    toast(`${p.name} ditambahkan`);
  }

  /* =========================================================
     LAYAR 3 — CHECKOUT
     ========================================================= */
  function priceRowsHTML(t) {
    return `
      <div class="price-row"><span>Subtotal Menu</span><span>${rp(t.subtotal)}</span></div>
      <div class="price-row"><span>Biaya Layanan / Kemasan (Dine-in)</span><span class="${t.service ? "" : "free"}">${t.service ? rp(t.service) : "Rp 0"}</span></div>
      ${CONFIG.TAX_RATE ? `<div class="price-row"><span>Pajak PB1 (${Math.round(CONFIG.TAX_RATE * 100)}%)</span><span>${rp(t.tax)}</span></div>` : ""}
      <div class="price-row total"><span>Total Pembayaran</span><span>${rp(t.total)}</span></div>`;
  }

  function renderCheckout() {
    const list = $("#checkout-items");
    $("#checkout-count").textContent = `${cartCount()} item`;
    if (!state.cart.length) {
      list.innerHTML = `<div class="empty-cart"><div>🛍️</div>Keranjang Anda masih kosong.</div>`;
    } else {
      list.innerHTML = state.cart.map((i) => {
        const p = productById(i.productId);
        const mods = modsText(i);
        const editable = optionsFor(p);
        return `<div class="co-item" data-key="${esc(i.key)}">
          <div class="co-img food-img">${imgHTML(p)}</div>
          <div class="co-body">
            <h4>${esc(p.name)}</h4>
            ${mods.length || i.note ? `<div class="co-mods">${mods.map(esc).join("<br>")}${i.note ? `${mods.length ? "<br>" : ""}<span class="note">“${esc(i.note)}”</span>` : ""}</div>` : ""}
            <div class="co-foot">
              <b class="price">${rp(lineTotal(i))}</b>
              <div class="co-actions">
                <button class="co-edit" data-edit="${esc(i.key)}">${icon("pencil")} Ubah</button>
                <div class="qty-stepper sm">
                  <button data-dec="${esc(i.key)}" aria-label="Kurangi">${i.qty === 1 ? icon("trash") : icon("minus")}</button>
                  <span>${i.qty}</span>
                  <button data-inc="${esc(i.key)}" aria-label="Tambah">${icon("plus")}</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      }).join("");
    }
    const t = totals();
    $("#checkout-prices").innerHTML = priceRowsHTML(t);
    $("#checkout-total-footer").textContent = rp(t.total);
    $("#to-payment-btn").disabled = !state.cart.length;
    $("#guest-name").value = state.guest.name;
    $("#guest-phone").value = state.guest.phone;
  }

  function changeQty(key, delta) {
    const it = state.cart.find((i) => i.key === key);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) {
      state.cart = state.cart.filter((i) => i.key !== key);
      toast(`${productById(it.productId).name} dihapus`, false);
    }
    persist();
    refreshAll();
    if (!state.cart.length && currentView === "checkout") setTimeout(() => go("menu"), 900);
  }

  const normPhone = (v) => v.replace(/[^\d]/g, "");
  function validateGuest() {
    const name = $("#guest-name").value.trim();
    const phone = normPhone($("#guest-phone").value);
    const nameF = $("#guest-name").closest(".field");
    const phoneF = $("#guest-phone").closest(".field");
    let ok = true;
    if (name.length < 2) {
      nameF.classList.add("invalid");
      nameF.querySelector(".error-msg").textContent = name ? "Nama minimal 2 huruf." : "Nama pemesan wajib diisi.";
      ok = false;
    } else nameF.classList.remove("invalid");
    if (!/^(08|628|8)\d{7,12}$/.test(phone)) {
      phoneF.classList.add("invalid");
      phoneF.querySelector(".error-msg").textContent = phone ? "Format nomor WhatsApp tidak valid (contoh: 081234567890)." : "Nomor WhatsApp wajib diisi.";
      ok = false;
    } else phoneF.classList.remove("invalid");
    state.guest = { name, phone };
    persist();
    if (!ok) {
      const f = $(".field.invalid input");
      f.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => f.focus({ preventScroll: true }), 300);
    }
    return ok;
  }

  /* =========================================================
     LAYAR 4 — PEMBAYARAN
     ========================================================= */
  const PAY_METHODS = [
    { group: "QRIS", icon: "qr-code", items: [
      { id: "qris", name: "QRIS Instan", logo: "QRIS", rec: true, desc: "Scan dengan aplikasi bank / e-wallet apa pun", apps: ["GoPay", "OVO", "DANA", "ShopeePay", "BCA Mobile", "Livin' Mandiri", "myBCA"] },
    ]},
    { group: "Virtual Account Bank", icon: "landmark", items: [
      { id: "va-bca", name: "BCA Virtual Account", logo: "BCA", desc: "Dicek otomatis", prefix: "39358" },
      { id: "va-mandiri", name: "Mandiri Virtual Account", logo: "mandiri", desc: "Dicek otomatis", prefix: "89608" },
      { id: "va-bri", name: "BRI Virtual Account", logo: "BRI", desc: "Dicek otomatis", prefix: "26215" },
    ]},
    { group: "E-Wallet Langsung", icon: "wallet", items: [
      { id: "ew-gopay", name: "GoPay", logo: "gopay", desc: "Notifikasi dikirim ke aplikasi" },
      { id: "ew-ovo", name: "OVO", logo: "OVO", desc: "Notifikasi dikirim ke aplikasi" },
      { id: "ew-dana", name: "DANA", logo: "DANA", desc: "Notifikasi dikirim ke aplikasi" },
      { id: "ew-shopeepay", name: "ShopeePay", logo: "Shopee", desc: "Notifikasi dikirim ke aplikasi" },
    ]},
  ];
  const methodById = (id) => PAY_METHODS.flatMap((g) => g.items).find((m) => m.id === id);

  function renderPayment() {
    const t = totals();
    $("#pay-total").textContent = rp(t.total);
    $("#pay-now-amount").textContent = rp(t.total);
    $("#pay-name").textContent = state.guest.name || "-";
    $$(".js-items-count").forEach((el) => (el.textContent = cartCount()));
    $("#pay-methods").innerHTML = PAY_METHODS.map((g) => `
      <div class="pm-group">
        <div class="pm-group-title">${icon(g.icon)} ${g.group}</div>
        ${g.items.map((m) => `
          <label class="pm-option">
            <input type="radio" name="paymethod" value="${m.id}" ${state.payMethod === m.id ? "checked" : ""} />
            <span class="pm-logo">${m.logo}</span>
            <span class="pm-info">
              <b>${m.name}${m.rec ? ' <span class="badge">Rekomendasi</span>' : ""}</b>
              <small>${m.desc}</small>
              ${m.apps ? `<span class="qris-apps">${m.apps.map((a) => `<span>${a}</span>`).join("")}</span>` : ""}
            </span>
            <span class="pm-radio"></span>
          </label>`).join("")}
      </div>`).join("");
  }

  /* --- QRIS tiruan (SVG) --- */
  function fakeQR(seedStr, size = 29) {
    let seed = [...seedStr].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const finder = (x, y) => {
      const inF = (fx, fy) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7;
      for (const [fx, fy] of [[0, 0], [size - 7, 0], [0, size - 7]]) {
        if (inF(fx, fy)) {
          const dx = x - fx, dy = y - fy;
          return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
        }
        if (x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7) return 0;
      }
      return null;
    };
    let rects = "";
    const c = size / 2;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const f = finder(x, y);
      let on = f !== null ? f : rnd() > 0.52;
      if (f === null && Math.abs(x - c + 0.5) < 4.5 && Math.abs(y - c + 0.5) < 4.5) on = false; // ruang logo
      if (f === null && (x === 6 || y === 6)) on = (x + y) % 2 === 0; // timing pattern
      if (on) rects += `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${size + 2} ${size + 2}" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${size + 2}" height="${size + 2}" fill="#fff"/><g fill="#1f120b">${rects}</g></svg>`;
  }

  let payTimer = null;
  let payDeadline = 0;
  let paySession = null;

  function openPaySheet() {
    const m = methodById(state.payMethod);
    const t = totals();
    const ref = "RR" + Date.now().toString().slice(-8);
    paySession = { ref, method: m, total: t.total };
    renderPaySheetBody();
    $("#pay-overlay").classList.add("show");
    $("#pay-sheet").classList.add("show");
    document.body.classList.add("no-scroll");
    startPayTimer();
  }

  function renderPaySheetBody() {
    const { method: m, total, ref } = paySession;
    let body = "";
    if (m.id === "qris") {
      body = `
        <h3>Scan QRIS untuk Membayar</h3>
        <p class="sub">Buka aplikasi e-wallet / m-banking lalu scan kode di bawah.</p>
        <div class="timer" id="pay-timer">${icon("clock")} <span>10:00</span></div>
        <div class="qris-frame" id="qris-frame">
          <div class="qris-top">
            <div class="qris-mark">QR<span>IS</span></div>
            <div class="qris-merchant"><b>RasaRuang</b>Everyday Dining · NMID ID10230984</div>
          </div>
          <div class="qris-code">${fakeQR(ref)}<div class="qris-center">RR</div></div>
          <div class="qris-amount">Total Tagihan<b>${rp(total)}</b></div>
        </div>`;
    } else if (m.id.startsWith("va-")) {
      const va = m.prefix + "0" + normPhone(state.guest.phone).slice(-10).padStart(10, "0");
      body = `
        <h3>Transfer ke Virtual Account</h3>
        <p class="sub">Selesaikan pembayaran sebelum waktu habis.</p>
        <div class="timer" id="pay-timer">${icon("clock")} <span>10:00</span></div>
        <div class="va-box">
          <div class="va-bank"><span class="pm-logo">${m.logo}</span> ${m.name}</div>
          <span class="muted small">Nomor Virtual Account</span>
          <div class="va-number"><b id="va-no">${va.replace(/(\d{4})(?=\d)/g, "$1 ")}</b>
            <button class="btn-ghost" data-copy="${va}">${icon("copy")} Salin</button></div>
          <ol class="va-steps">
            <li>Buka aplikasi / ATM ${m.logo.toUpperCase()}.</li>
            <li>Pilih menu <b>Transfer → Virtual Account</b>.</li>
            <li>Masukkan nomor VA di atas & pastikan nominal <b>${rp(total)}</b>.</li>
            <li>Pembayaran terverifikasi otomatis.</li>
          </ol>
        </div>
        <div class="pay-total-row"><span>Total Tagihan</span><b>${rp(total)}</b></div>`;
    } else {
      body = `
        <h3>Konfirmasi di Aplikasi ${m.name}</h3>
        <p class="sub">Kami telah mengirim permintaan pembayaran.</p>
        <div class="timer" id="pay-timer">${icon("clock")} <span>10:00</span></div>
        <div class="ew-box">
          <div class="ew-loader"></div>
          <span class="muted small">Notifikasi dikirim ke akun ${m.name}</span>
          <div class="ew-phone">${esc(state.guest.phone)}</div>
          <p class="muted small">Buka aplikasi ${m.name} dan setujui pembayaran.</p>
        </div>
        <div class="pay-total-row"><span>Total Tagihan</span><b>${rp(total)}</b></div>`;
    }
    $("#pay-sheet-body").innerHTML = `
      <div class="pay-wait">
        ${body}
        <div class="pay-actions">
          <button class="btn-primary btn-success block" id="simulate-success">${icon("check")} Simulasikan Pembayaran Berhasil <span class="demo-tag">DEMO</span></button>
          ${m.id === "qris" ? `<button class="btn-secondary block" id="download-qris">${icon("download")} Unduh QRIS</button>` : ""}
          <button class="btn-ghost" id="change-method" style="justify-content:center">Ganti Metode Pembayaran</button>
        </div>
      </div>`;
  }

  function startPayTimer() {
    clearInterval(payTimer);
    payDeadline = Date.now() + CONFIG.PAY_TIMEOUT_SEC * 1000;
    const tick = () => {
      const left = Math.max(0, Math.round((payDeadline - Date.now()) / 1000));
      const el = $("#pay-timer");
      if (!el) return;
      el.querySelector("span").textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
      if (left <= 0) {
        clearInterval(payTimer);
        el.classList.add("expired");
        el.querySelector("span").textContent = "Waktu habis";
        const frame = $("#qris-frame");
        if (frame && !frame.querySelector(".qris-expired-mask")) {
          frame.insertAdjacentHTML("beforeend", `<div class="qris-expired-mask">QRIS kedaluwarsa<button class="btn-primary" id="regen-qris">${icon("refresh")} Buat Ulang</button></div>`);
        }
      }
    };
    tick();
    payTimer = setInterval(tick, 1000);
  }

  function closePaySheet() {
    clearInterval(payTimer);
    $("#pay-overlay").classList.remove("show");
    $("#pay-sheet").classList.remove("show");
    document.body.classList.remove("no-scroll");
  }

  function downloadBlob(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function completePayment() {
    const t = totals();
    const no = `#RR-${String(state.orderSeq).padStart(3, "0")}`;
    state.order = {
      no,
      table: TABLE,
      guest: { ...state.guest },
      items: state.cart.map((i) => ({ ...i, unit: unitPrice(i) })),
      totals: t,
      method: paySession.method.name,
      ref: paySession.ref,
      paidAt: Date.now(),
    };
    state.orderSeq += 1;
    state.cart = [];
    persist();
    closePaySheet();
    go("status");
  }

  /* =========================================================
     LAYAR 4c — STATUS PESANAN
     ========================================================= */
  const STEPS = [
    { title: "Pesanan Diterima", desc: "Pembayaran terverifikasi & pesanan masuk ke sistem dapur.", icon: "receipt", at: 0 },
    { title: "Sedang Dimasak di Dapur", desc: "Chef kami sedang menyiapkan hidangan Anda dengan penuh cinta.", icon: "chef-hat", at: 6 },
    { title: "Siap Diantar ke Meja", desc: "Staf kami segera mengantar pesanan ke meja Anda.", icon: "concierge", at: 18 },
  ];
  let statusTimer = null;
  let lastStep = -1;

  function renderStatus() {
    const o = state.order;
    if (!o) return go("menu");
    $("#status-name").textContent = o.guest.name || "Kak";
    $("#status-order-no").textContent = o.no;
    $("#status-table").textContent = o.table;
    $("#status-meta").innerHTML = `
      <div><span>Nama Pemesan</span><b>${esc(o.guest.name)}</b></div>
      <div><span>WhatsApp</span><b>${esc(o.guest.phone)}</b></div>
      <div><span>Metode Bayar</span><b>${esc(o.method)}</b></div>
      <div><span>Waktu Bayar</span><b>${fmtTime(o.paidAt)} WIB</b></div>`;
    $("#status-items").innerHTML = o.items.map((i) => {
      const p = productById(i.productId);
      const mods = modsText(i);
      return `<div class="st-item"><div><span class="q">${i.qty}×</span>${esc(p.name)}
        ${mods.length || i.note ? `<small>${mods.map(esc).join(" · ")}${i.note ? ` · “${esc(i.note)}”` : ""}</small>` : ""}</div>
        <b>${rp(i.unit * i.qty)}</b></div>`;
    }).join("");
    $("#status-prices").innerHTML = priceRowsHTML(o.totals);
    const check = $(".check-anim");
    check.classList.remove("done");
    void check.offsetWidth;
    check.classList.add("done");
    lastStep = -1;
    tickStatus();
    clearInterval(statusTimer);
    statusTimer = setInterval(tickStatus, 1000);
  }

  function tickStatus() {
    const o = state.order;
    if (!o || currentView !== "status") return clearInterval(statusTimer);
    const elapsed = (Date.now() - o.paidAt) / 1000;
    let cur = 0;
    STEPS.forEach((s, i) => { if (elapsed >= s.at) cur = i; });
    if (cur === lastStep) return;
    if (lastStep !== -1 && cur > lastStep) toast(cur === STEPS.length - 1 ? "Pesanan siap diantar ke meja Anda! 🛎️" : "Pesanan sedang dimasak 👨‍🍳");
    lastStep = cur;
    const allDone = cur === STEPS.length - 1;
    $("#status-stepper").innerHTML = STEPS.map((s, i) => {
      const cls = i < cur || (allDone && i === cur) ? "done" : i === cur ? "current" : "";
      const time = i <= cur ? `<time>${fmtTime(o.paidAt + s.at * 1000)}</time>` : "";
      return `<li class="step ${cls}"><span class="step-icon">${i < cur || (allDone && i === cur) ? icon("check") : icon(s.icon)}</span>
        <div class="step-text"><b>${s.title}</b><small>${s.desc}</small>${time}</div></li>`;
    }).join("");
    if (allDone) clearInterval(statusTimer);
  }

  function downloadReceipt() {
    const o = state.order;
    if (!o) return;
    const rows = o.items.map((i) => {
      const p = productById(i.productId);
      const mods = modsText(i);
      return `<tr><td>${i.qty}× ${esc(p.name)}${mods.length || i.note ? `<div class="m">${mods.map(esc).join(", ")}${i.note ? ` · "${esc(i.note)}"` : ""}</div>` : ""}</td><td class="r">${rp(i.unit * i.qty)}</td></tr>`;
    }).join("");
    const t = o.totals;
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Struk ${o.no} - RasaRuang</title>
<style>body{font-family:'Courier New',monospace;background:#F6EEE0;color:#4A2C1D;margin:0;padding:24px}.r{text-align:right;white-space:nowrap}
.s{max-width:340px;margin:auto;background:#FAF6F0;border:1px solid #E6D7C3;border-radius:12px;padding:22px}h1{font-family:Georgia,serif;text-align:center;margin:0;font-size:24px}
.c{text-align:center;font-size:12px}hr{border:0;border-top:1px dashed #6B442B;margin:12px 0}table{width:100%;font-size:13px;border-collapse:collapse}td{padding:4px 0;vertical-align:top}
.m{font-size:11px;color:#8A6F5C}.t td{font-weight:bold;font-size:15px}.ok{display:inline-block;background:#2E6F40;color:#fff;padding:3px 10px;border-radius:99px;font-size:11px}</style></head>
<body><div class="s"><h1>RasaRuang</h1><div class="c">EVERYDAY DINING<br>Outlet Utama</div><hr>
<table><tr><td>No. Pesanan</td><td class="r"><b>${o.no}</b></td></tr><tr><td>Meja</td><td class="r">#${o.table} · Dine-In</td></tr>
<tr><td>Nama</td><td class="r">${esc(o.guest.name)}</td></tr><tr><td>WhatsApp</td><td class="r">${esc(o.guest.phone)}</td></tr>
<tr><td>Tanggal</td><td class="r">${fmtDate(o.paidAt)} ${fmtTime(o.paidAt)}</td></tr></table><hr>
<table>${rows}</table><hr>
<table><tr><td>Subtotal</td><td class="r">${rp(t.subtotal)}</td></tr><tr><td>Layanan (Dine-in)</td><td class="r">${rp(t.service)}</td></tr>
${CONFIG.TAX_RATE ? `<tr><td>PB1 ${Math.round(CONFIG.TAX_RATE * 100)}%</td><td class="r">${rp(t.tax)}</td></tr>` : ""}
<tr class="t"><td>TOTAL</td><td class="r">${rp(t.total)}</td></tr><tr><td>Bayar via</td><td class="r">${esc(o.method)}</td></tr><tr><td>Ref</td><td class="r">${o.ref}</td></tr></table>
<hr><div class="c"><span class="ok">LUNAS</span><br><br>Terima kasih telah makan di RasaRuang!<br>Selamat menikmati 🍚</div></div></body></html>`;
    downloadBlob(html, `Struk-${o.no.replace("#", "")}-RasaRuang.html`, "text/html");
    toast("Struk digital berhasil diunduh");
  }

  /* =========================================================
     ROUTER (hash) & REFRESH
     ========================================================= */
  let currentView = "menu";
  const VIEWS = ["menu", "checkout", "payment", "status"];

  function go(view, replace = false) {
    const url = `${location.pathname}${location.search}#/${view}`;
    if (replace) history.replaceState(null, "", url); else history.pushState(null, "", url);
    route();
  }

  function route() {
    let view = (location.hash.match(/#\/(\w+)/) || [])[1] || "menu";
    if (!VIEWS.includes(view)) view = "menu";
    if ((view === "checkout" || view === "payment") && !state.cart.length) view = state.order ? "status" : "menu";
    if (view === "payment" && !(state.guest.name && state.guest.phone)) view = "checkout";
    if (view === "status" && !state.order) view = "menu";
    if (`#/${view}` !== location.hash) history.replaceState(null, "", `${location.pathname}${location.search}#/${view}`);

    const prev = currentView;
    currentView = view;
    if (sheet) closeSheet();
    if ($("#pay-sheet").classList.contains("show")) closePaySheet();
    $$(".view").forEach((v) => v.classList.toggle("hidden", v.dataset.view !== view));
    if (view === "menu") renderCatalog();
    if (view === "checkout") renderCheckout();
    if (view === "payment") renderPayment();
    if (view === "status") renderStatus();
    renderCartBar();
    if (prev !== view) window.scrollTo({ top: 0, behavior: "instant" });
  }

  function refreshAll() {
    if (currentView === "menu") renderCatalog();
    if (currentView === "checkout") renderCheckout();
    renderCartBar();
  }

  /* ---------------- Toast ---------------- */
  let toastT;
  function toast(msg, ok = true) {
    const el = $("#toast");
    el.innerHTML = `${ok ? `<span class="ok">${icon("check")}</span>` : "⚠️"} <span>${esc(msg)}</span>`;
    el.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* =========================================================
     EVENT BINDING
     ========================================================= */
  function bind() {
    // Katalog: buka sheet / tambah cepat
    $("#catalog").addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) { e.stopPropagation(); return quickAdd(add.dataset.add); }
      const card = e.target.closest("[data-open]");
      if (card) openSheet(card.dataset.open);
    });
    $("#cat-scroll").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (b) scrollToCat(b.dataset.cat);
    });
    $$("[data-scroll-to]").forEach((b) => b.addEventListener("click", () => scrollToCat(b.dataset.scrollTo)));
    window.addEventListener("scroll", () => requestAnimationFrame(updateSpy), { passive: true });

    // Pencarian
    $("#search-input").addEventListener("input", () => { renderCatalog(); });
    $("#search-clear").addEventListener("click", () => { $("#search-input").value = ""; renderCatalog(); $("#search-input").focus(); });

    // Cart bar
    const toCheckout = () => go("checkout");
    $("#cart-bar").addEventListener("click", toCheckout);
    $("#cart-bar").addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && toCheckout());

    // Bottom sheet
    $("#sheet-overlay").addEventListener("click", closeSheet);
    $("#sheet-close").addEventListener("click", closeSheet);
    $("#sheet-options").addEventListener("click", (e) => {
      const chip = e.target.closest(".spice-chip");
      if (chip) { syncSpice(+chip.dataset.spice); updateSheetPrice(); }
    });
    $("#sheet-options").addEventListener("change", (e) => {
      const t = e.target;
      if (!sheet) return;
      if (t.name === "spice") syncSpice(+t.value);
      if (t.name === "drink") { sheet.drink = t.value; const g = $('[data-group="drink"]'); g.classList.remove("invalid"); g.querySelector(".tag-required").classList.add("ok"); }
      if (t.name === "topping") t.checked ? sheet.toppings.add(t.value) : sheet.toppings.delete(t.value);
      if (t.name === "sugar") sheet.sugar = t.value;
      if (t.name === "ice") sheet.ice = t.value;
      updateSheetPrice();
    });
    $("#sheet-note").addEventListener("input", (e) => { if (sheet) sheet.note = e.target.value; $("#note-count").textContent = e.target.value.length; updateSheetPrice(); });
    $("#qty-minus").addEventListener("click", () => { if (sheet && sheet.qty > 1) { sheet.qty--; updateSheetPrice(); } });
    $("#qty-plus").addEventListener("click", () => { if (sheet && sheet.qty < 50) { sheet.qty++; updateSheetPrice(); } });
    $("#sheet-add-btn").addEventListener("click", submitSheet);

    // Navigasi umum
    document.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-nav]");
      if (!nav) return;
      e.preventDefault();
      go(nav.dataset.nav);
    });

    // Checkout
    $("#checkout-items").addEventListener("click", (e) => {
      const inc = e.target.closest("[data-inc]");
      const dec = e.target.closest("[data-dec]");
      const edit = e.target.closest("[data-edit]");
      if (inc) changeQty(inc.dataset.inc, 1);
      if (dec) changeQty(dec.dataset.dec, -1);
      if (edit) {
        const it = state.cart.find((i) => i.key === edit.dataset.edit);
        if (it) openSheet(it.productId, it.key);
      }
    });
    ["guest-name", "guest-phone"].forEach((id) =>
      $("#" + id).addEventListener("input", (e) => {
        if (id === "guest-phone") e.target.value = e.target.value.replace(/[^\d+]/g, "");
        state.guest[id === "guest-name" ? "name" : "phone"] = e.target.value.trim();
        e.target.closest(".field").classList.remove("invalid");
        persist();
      })
    );
    $("#guest-form").addEventListener("submit", (e) => { e.preventDefault(); $("#to-payment-btn").click(); });
    $("#to-payment-btn").addEventListener("click", () => {
      if (!state.cart.length) return;
      if (validateGuest()) go("payment");
    });

    // Payment
    $("#pay-methods").addEventListener("change", (e) => {
      if (e.target.name === "paymethod") { state.payMethod = e.target.value; persist(); }
    });
    $("#pay-now-btn").addEventListener("click", openPaySheet);
    $("#pay-overlay").addEventListener("click", closePaySheet);
    $("#pay-sheet-close").addEventListener("click", closePaySheet);
    $("#pay-sheet-body").addEventListener("click", (e) => {
      if (e.target.closest("#simulate-success")) completePayment();
      if (e.target.closest("#change-method")) closePaySheet();
      if (e.target.closest("#regen-qris")) { paySession.ref = "RR" + Date.now().toString().slice(-8); renderPaySheetBody(); startPayTimer(); }
      if (e.target.closest("#download-qris")) {
        const svg = $(".qris-code svg").outerHTML;
        downloadBlob(svg, `QRIS-RasaRuang-${rp(paySession.total).replace(/\D/g, "")}.svg`, "image/svg+xml");
        toast("QRIS berhasil diunduh");
      }
      const cp = e.target.closest("[data-copy]");
      if (cp) {
        (navigator.clipboard?.writeText(cp.dataset.copy) || Promise.reject()).then(
          () => toast("Nomor VA disalin"),
          () => toast("Nomor VA: " + cp.dataset.copy)
        );
      }
    });

    // Status
    $("#download-receipt-btn").addEventListener("click", downloadReceipt);
    $("#new-order-btn").addEventListener("click", () => {
      clearInterval(statusTimer);
      state.order = null;
      persist();
      go("menu");
    });

    // Keyboard: ESC menutup sheet
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (sheet) closeSheet();
      else if ($("#pay-sheet").classList.contains("show")) closePaySheet();
    });

    window.addEventListener("popstate", route);
    window.addEventListener("hashchange", route);
  }

  /* ---------------- Init ---------------- */
  hydrateIcons();
  renderGreeting();
  renderCategories();
  bind();
  route();
})();
