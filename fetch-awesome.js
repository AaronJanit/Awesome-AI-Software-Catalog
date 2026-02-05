process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const fs = require("fs");

fetch("./data/software.json")

async function run() {
  const res = await fetch("./data/software.json", {
    headers: {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "software-catalog"
    }
  });

  // 1. Check HTTP status
  if (!res.ok) {
    console.error("GitHub API error:", res.status, res.statusText);
    const text = await res.text();
    console.error(text);
    return;
  }

  const data = await res.json();

  // 2. Validate README payload
  if (!data.content) {
    console.error("No README content found.");
    console.error("Full response:", data);
    return;
  }

  // 3. Decode Base64 safely
  const markdown = Buffer
    .from(data.content, "base64")
    .toString("utf8");

  const lines = markdown.split("\n");

  let currentCategory = "Uncategorized";
  const results = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentCategory = line.replace("## ", "").trim();
      continue;
    }

    const match = line.match(/^- \[(.+?)\]\((.+?)\)\s*[–-]\s*(.+)/);

    if (match) {
      const [, name, url, description] = match;

      results.push({
        name,
        url,
        description,
        category: currentCategory,
        source: `${OWNER}/${REPO}`
      });
    }
  }

fs.writeFileSync(
  `awesome-ai.json`,
  JSON.stringify(results, null, 2),
  "utf8"
);

console.log(`Saved ${results.length} tools to awesome-ai.json`);

}

run().catch(err => {
  console.error("Fatal error:", err);
});
