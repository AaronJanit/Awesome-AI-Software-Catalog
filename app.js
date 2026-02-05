const content = document.getElementById("content");
const breadcrumbs = document.getElementById("breadcrumbs");
const search = document.getElementById("search");
const wildcardBtn = document.getElementById("wildcard");

let software = [];
let byCategory = new Map();
let bySource = new Map();

let state = {
  level: "home",
  category: null,
  item: null
};

/* ---------- LOAD & INDEX ---------- */

fetch("./software.json")
  .then(res => res.json())
  .then(data => {
    software = data;
    indexData();
    renderHome();
  });

function indexData() {
  software.forEach(item => {
    if (item.category) {
      if (!byCategory.has(item.category)) {
        byCategory.set(item.category, []);
      }
      byCategory.get(item.category).push(item);
    }

    if (item.source) {
      if (!bySource.has(item.source)) {
        bySource.set(item.source, []);
      }
      bySource.get(item.source).push(item);
    }
  });
}

/* ---------- BREADCRUMBS ---------- */

function renderBreadcrumbs() {
  breadcrumbs.innerHTML = "";

  addCrumb("Home", renderHome);

  if (state.level !== "home") {
    addSep();
    addCrumb(state.category, () => renderCategory(state.category));
  }

  if (state.level === "item") {
    addSep();
    addCrumb(state.item.name, null, true);
  }
}

function addCrumb(label, fn, isCurrent) {
  const span = document.createElement("span");
  span.textContent = label;
  if (isCurrent) span.className = "breadcrumb-current";
  else if (fn) span.onclick = fn;
  breadcrumbs.appendChild(span);
}

function addSep() {
  breadcrumbs.append(" > ");
}

/* ---------- VIEWS ---------- */

function renderHome() {
  state = { level: "home" };
  renderBreadcrumbs();
  content.classList.remove("item-detail-view");
  content.innerHTML = "";

  [...byCategory.keys()].sort().forEach(cat => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `${cat} (${byCategory.get(cat).length})`;
    div.onclick = () => renderCategory(cat);
    content.appendChild(div);
  });
}

function renderCategory(category) {
  state = { level: "category", category };
  renderBreadcrumbs();
  content.classList.remove("item-detail-view");
  content.innerHTML = "";

  byCategory.get(category).forEach(item => {
    renderCard(item);
  });
}

function renderItem(item) {
  state = { level: "item", category: item.category, item };
  renderBreadcrumbs();

  content.classList.add("item-detail-view");
  content.innerHTML = `
    <article class="item-detail">
      <div class="item-detail-card">
        <h1 class="item-name">${escapeHtml(item.name)}</h1>
        <p class="item-description">${escapeHtml(item.description)}</p>
        <div class="item-meta">
          <span class="item-meta-item"><strong>Category</strong> ${escapeHtml(item.category || "—")}</span>
          <span class="item-meta-item"><strong>Source</strong> ${escapeHtml(item.source || "—")}</span>
        </div>
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="item-cta">Visit website →</a>
      </div>
      <section class="item-related-section" aria-label="Related tools">
        <h2 class="item-related-title">Related tools</h2>
        <div id="related" class="related-tools-grid"></div>
      </section>
    </article>
  `;

  renderRelated(item);
}

function renderCard(item) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<strong>${item.name}</strong><br>${item.description}`;
  div.onclick = () => renderItem(item);
  content.appendChild(div);
}

/* ---------- RELATED TOOLS ---------- */

function renderRelated(item) {
  const container = document.getElementById("related");
  if (!container) return;
  const seen = new Set([item.name]);
  let related = [];

  // 1. Same category (best signal)
  if (byCategory.has(item.category)) {
    related.push(
      ...byCategory
        .get(item.category)
        .filter(i => i.name !== item.name)
    );
  }

  // 2. Same source (fallback)
  if (related.length < 6 && bySource.has(item.source)) {
    related.push(
      ...bySource
        .get(item.source)
        .filter(i => i.name !== item.name)
    );
  }

  // Deduplicate + limit
  related = related.filter(i => {
    if (seen.has(i.name)) return false;
    seen.add(i.name);
    return true;
  }).slice(0, 6);

  if (!related.length) {
    container.innerHTML = '<p class="related-empty">No related tools found.</p>';
    return;
  }

  related.forEach(relatedItem => {
    const div = document.createElement("div");
    div.className = "card related-card";
    div.innerHTML = `<strong>${escapeHtml(relatedItem.name)}</strong>`;
    div.onclick = () => renderItem(relatedItem);
    container.appendChild(div);
  });
}

/* ---------- WILDCARD SOFTWARE ---------- */

if (wildcardBtn) {
  wildcardBtn.onclick = () => {
    // Prefer categories with more tools (better discovery)
    const weightedPool = [];

    byCategory.forEach(items => {
      if (items.length > 3) {
        weightedPool.push(
          ...items.slice(0, Math.min(items.length, 5))
        );
      }
    });

    const pool = weightedPool.length ? weightedPool : software;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    renderItem(pick);
  };
}

/* ---------- SEARCH (OPTIMIZED) ---------- */

function renderSearchResults(query) {
  const q = query.toLowerCase().trim();
  content.innerHTML = "";
  content.classList.remove("search-results-empty", "item-detail-view");

  if (!q) {
    renderHome();
    return;
  }

  const matches = software.filter(
    s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );
  const capped = matches.slice(0, 100);

  if (capped.length === 0) {
    content.classList.add("search-results-empty");
    content.innerHTML = `
      <div class="search-results-header">
        <span class="search-results-count">No results for “${escapeHtml(q)}”</span>
      </div>
      <div class="search-empty-state">
        <p>Try different keywords, or browse categories above.</p>
      </div>
    `;
    return;
  }

  content.classList.remove("search-results-empty");
  const header = document.createElement("div");
  header.className = "search-results-header";
  header.innerHTML = `
    <span class="search-results-count">${capped.length} ${capped.length === 1 ? "result" : "results"} for “${escapeHtml(q)}”</span>
  `;
  content.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "search-results-grid";
  capped.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.description)}`;
    card.onclick = () => renderItem(item);
    grid.appendChild(card);
  });
  content.appendChild(grid);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

search.addEventListener("input", e => {
  renderSearchResults(e.target.value);
});
