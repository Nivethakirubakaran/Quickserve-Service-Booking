// =============================================
//  DATA
// =============================================
let PROVIDERS = [];

const PER_PAGE = 5;

// =============================================
//  STATE
// =============================================
let state = {
  search: '',
  cat: 'All',
  maxPrice: 3000,
  minRating: 0,
  maxDist: 20,
  avail: 'any',
  sort: 'rating',
  page: 1
};

// =============================================
//  FILTER + SORT
// =============================================
function getFiltered() {
  return PROVIDERS.filter(p => {
    if (state.search) {
      const q = state.search.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.skills.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (state.cat !== 'All' && p.cat !== state.cat) return false;
    if (p.price > state.maxPrice) return false;
    if (p.rating < state.minRating) return false;
    if (p.dist > state.maxDist) return false;
    if (state.avail === 'now' && p.avail !== 'now') return false;
    if (state.avail === 'today' && p.avail !== 'now' && p.avail !== 'today') return false;
    return true;
  });
}

function getSorted(arr) {
  const a = [...arr];
  if (state.sort === 'rating') a.sort((x, y) => y.rating - x.rating);
  if (state.sort === 'price_low') a.sort((x, y) => x.price - y.price);
  if (state.sort === 'price_high') a.sort((x, y) => y.price - x.price);
  if (state.sort === 'distance') a.sort((x, y) => x.dist - y.dist);
  if (state.sort === 'jobs') a.sort((x, y) => y.jobs - x.jobs);
  return a;
}

// =============================================
//  RENDER
// =============================================
function render() {
  const filtered = getSorted(getFiltered());
  const total = filtered.length;
  const start = (state.page - 1) * PER_PAGE;
  const paged = filtered.slice(start, start + PER_PAGE);

  document.getElementById('resultCount').textContent = total;

  const plist = document.getElementById('plist');
  const noRes = document.getElementById('noResults');
  const pagDiv = document.getElementById('pagination');

  if (total === 0) {
    plist.innerHTML = '';
    pagDiv.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  // ---- Cards ----
  plist.innerHTML = paged.map((p, i) => `
    <div class="pcard" style="--accent:${p.accent}; animation-delay:${i * 0.06}s;">
      <div class="p-avatar" style="background:${p.catBg};">
        ${p.icon}
        <div class="online-dot" style="background:${p.avail === 'now' ? '#22c55e' : '#fbbf24'};"></div>
      </div>
      <div>
        <div class="p-top">
          <div class="p-name">${p.name}</div>
          <div class="p-cat" style="background:${p.catBg};color:${p.catColor};">${p.cat}</div>
          <div class="p-verified">✅ Verified</div>
        </div>
        <div class="p-desc">${p.descr}</div>
        <div class="p-meta">
          <div class="meta-chip">📍 <strong>${p.dist} km</strong></div>
          <div class="meta-chip">✅ <strong>${p.jobs}</strong> jobs</div>
          <div class="meta-chip">${p.avail === 'now'
      ? '<strong style="color:#22c55e;">🟢 Available Now</strong>'
      : '<strong style="color:#fbbf24;">🟡 Available Today</strong>'}</div>
        </div>
        <div class="skill-tags">${p.skills.map(s => `<span class="stag">${s}</span>`).join('')}</div>
      </div>
      <div class="p-right">
        <div class="rating-box"><span>⭐</span><span class="rn">${p.rating}</span><span class="rv">(${p.reviews})</span></div>
        <div class="price-box">
          <div class="price-lbl">Starting from</div>
          <div class="price-val">₹${p.price}<span class="price-unit">${p.unit}</span></div>
        </div>
        <button class="btn-book" onclick="openBooking(${p.id})">Book Now</button>
      </div>
    </div>
  `).join('');

  // ---- Pagination ----
  const totalPages = Math.ceil(total / PER_PAGE);
  if (totalPages <= 1) { pagDiv.innerHTML = ''; return; }

  let html = `<button class="pg-btn" ${state.page === 1 ? 'disabled' : ''} onclick="goPage(${state.page - 1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="pg-btn ${i === state.page ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button class="pg-btn" ${state.page === totalPages ? 'disabled' : ''} onclick="goPage(${state.page + 1})">›</button>`;
  pagDiv.innerHTML = html;
}

function goPage(p) {
  const total = Math.ceil(getFiltered().length / PER_PAGE);
  if (p < 1 || p > total) return;
  state.page = p;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
// =============================================
//  SLIDER FILL HELPER
// =============================================
function fillSlider(el, color) {
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}

// =============================================
//  WIRE UP CONTROLS
// =============================================

// ---- Search ----
document.getElementById('searchBtn').addEventListener('click', () => {
  state.search = document.getElementById('searchInput').value.trim();
  state.page = 1;
  render();
});
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});
document.getElementById('searchInput').addEventListener('input', function () {
  if (!this.value) { state.search = ''; state.page = 1; render(); }
});

// ---- Sort ----
document.getElementById('sortSel').addEventListener('change', function () {
  state.sort = this.value;
  state.page = 1;
  render();
});

// ---- Category (sidebar) ----
document.getElementById('catItems').addEventListener('click', function (e) {
  const item = e.target.closest('.cat-item');
  if (!item) return;
  document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
  item.classList.add('active');
  state.cat = item.dataset.cat;
  state.page = 1;
  syncQuickTabs();
  render();
});

// ---- Quick tabs ----
document.getElementById('quickTabs').addEventListener('click', function (e) {
  const tab = e.target.closest('.qtab');
  if (!tab) return;
  document.querySelectorAll('.qtab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  state.cat = tab.dataset.cat;
  state.page = 1;
  syncSidebarCat();
  render();
});

function syncQuickTabs() {
  document.querySelectorAll('.qtab').forEach(t =>
    t.classList.toggle('active', t.dataset.cat === state.cat));
}
function syncSidebarCat() {
  document.querySelectorAll('.cat-item').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === state.cat));
}

// ---- Price range ----
const priceRange = document.getElementById('priceRange');
priceRange.addEventListener('input', function () {
  document.getElementById('priceDisplay').textContent = '₹' + Number(this.value).toLocaleString('en-IN');
  fillSlider(this, 'var(--coral)');
});
fillSlider(priceRange, 'var(--coral)');

// ---- Distance range ----
const distRange = document.getElementById('distRange');
distRange.addEventListener('input', function () {
  document.getElementById('distDisplay').textContent = this.value + ' km';
  fillSlider(this, 'var(--purple)');
});
fillSlider(distRange, 'var(--purple)');

document.getElementById('applyBtn').addEventListener('click', function () {

  state.maxPrice = parseInt(priceRange.value);
  state.maxDist = parseInt(distRange.value);
  state.page = 1;

  render();

  this.textContent = '✓ Filters Applied!';
  this.style.background = 'linear-gradient(135deg,#10b981,#059669)';

  setTimeout(() => {
    this.textContent = 'Apply Filters';
    this.style.background = '';
  }, 1600);

  showToast('✅', 'Filters applied!');
});

// ---- Clear Filters ----
document.getElementById('clearBtn').addEventListener('click', () => {
  state = { search: '', cat: 'All', maxPrice: 3000, minRating: 0, maxDist: 20, avail: 'any', sort: 'rating', page: 1 };

  document.getElementById('searchInput').value = '';
  document.getElementById('sortSel').value = 'rating';

  priceRange.value = 3000;
  document.getElementById('priceDisplay').textContent = '₹3,000';
  fillSlider(priceRange, 'var(--coral)');

  distRange.value = 20;
  document.getElementById('distDisplay').textContent = '20 km';
  fillSlider(distRange, 'var(--purple)');

  document.querySelectorAll('.cat-item').forEach((el, i) => el.classList.toggle('active', i === 0));
  syncQuickTabs();

  render();
  showToast('🔄', 'All filters cleared.');
});

// ---- Reset (no results panel) ----
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('clearBtn').click();
});
// =============================================
//  TOAST
// =============================================
function showToast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('tIcon').textContent = icon;
  document.getElementById('tMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

// =============================================
//  BOOKING REDIRECT (NO MODAL)
// =============================================
function openBooking(id) {
  const p = PROVIDERS.find(x => x.id === id);
  if (!p) return;

  const params = new URLSearchParams({
    id: p.id,
    name: p.name,
    icon: p.icon,
    price: p.price,
    unit: p.unit,
    cat: p.cat
  });

  window.location.href = 'booking.html?' + params.toString();
}

// =============================================
//  INIT
// =============================================
async function init() {
  try {
    const res = await fetch('http://localhost:8080/api/electrical');
    PROVIDERS = await res.json();
  } catch (err) {
    console.error('Failed to load providers:', err);
  }
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const search = params.get('search');
  if (cat) { state.cat = decodeURIComponent(cat); syncSidebarCat(); syncQuickTabs(); }
  if (search) { state.search = decodeURIComponent(search); document.getElementById('searchInput').value = state.search; }
  render();
}
init();