const promptEl = document.getElementById("prompt");
const resultsEl = document.getElementById("results");
const askBtn = document.getElementById("ask");

const freeEl = document.getElementById("free");
const browserEl = document.getElementById("browser");
const openEl = document.getElementById("open");

let software = [];

if (askBtn) {
  askBtn.disabled = true;
  askBtn.textContent = "Loading…";
}
if (resultsEl) resultsEl.innerHTML = "<p>Loading software data…</p>";

fetch("./software.json")
  .then(res => {
    if (!res.ok) throw new Error(res.statusText || 'Failed to load');
    return res.json();
  })
  .then(data => {
    software = data || [];
    if (askBtn) {
      askBtn.disabled = false;
      askBtn.textContent = "🤖 Recommend software";
    }
    if (resultsEl) resultsEl.innerHTML = "";
  })
  .catch(err => {
    console.error('Error loading software.json:', err);
    if (resultsEl) resultsEl.innerHTML = "<p>Failed to load software data.</p>";
    if (askBtn) {
      askBtn.disabled = true;
      askBtn.textContent = "Unavailable";
    }
  });

if (askBtn) {
  askBtn.onclick = () => {
    const query = (promptEl && promptEl.value || '').trim().toLowerCase();
    if (!query) return;

    const keywords = extractKeywords(query);
    const scored = (software || []).map(s => ({
      item: s,
      score: scoreItem(s, keywords)
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 7);

    render(scored);
  };
}

/* ---------- Scoring ---------- */

function scoreItem(item, keywords) {
  let score = 0;
  const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();

  keywords.forEach(k => {
    if (text.includes(k)) score += 3;
  });

  // Guard against missing checkbox elements
  if (freeEl && freeEl.checked && item.description.toLowerCase().includes("free")) score += 2;
  if (browserEl && browserEl.checked && text.includes("browser")) score += 2;
  if (openEl && openEl.checked && text.includes("open")) score += 2;

  return score;
}

/* ---------- Keywords ---------- */

function extractKeywords(text) {
  return text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w));
}

const STOPWORDS = new Set([
  "that","with","this","from","they","would","there","their",
  "about","which","could","should","want","need","looking",
  "prefer","using","tool","software"
]);

/* ---------- Render ---------- */

function render(items) {
  if (!resultsEl) return;
  resultsEl.innerHTML = "";

  if (!items.length) {
    resultsEl.innerHTML = "<p>No strong matches found.</p>";
    return;
  }

  items.forEach(({ item, score }) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${item.name}</strong>
      <p>${item.description}</p>
      <small>Match score: ${score}</small><br>
      <a href="${item.url}" target="_blank">Visit</a>
    `;
    resultsEl.appendChild(div);
  });
}
