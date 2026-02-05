const content = document.getElementById("content");
const again = document.getElementById("again");

let software = [];
let byCategory = new Map();

fetch("./software.json")
  .then(res => res.json())
  .then(data => {
    software = data;
    index();
    pick();
  });

function index() {
  software.forEach(s => {
    if (!byCategory.has(s.category)) {
      byCategory.set(s.category, []);
    }
    byCategory.get(s.category).push(s);
  });
}

function pick() {
  const categories = [...byCategory.values()].filter(c => c.length > 3);
  const pool = categories.length
    ? categories.flat()
    : software;

  const item = pool[Math.floor(Math.random() * pool.length)];
  render(item);
}

function render(item) {
  content.innerHTML = `
    <div class="card detail">
      <h2>${item.name}</h2>
      <p>${item.description}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Source:</strong> ${item.source}</p>
      <p><a href="${item.url}" target="_blank">Visit website</a></p>
    </div>
  `;
}

again.onclick = pick;
