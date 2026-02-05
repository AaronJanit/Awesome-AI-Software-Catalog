import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// Allow frontend from same origin or different port (e.g. Live Server) to POST
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const softwarePath = path.join(__dirname, "data", "software.json");
const softwareData = JSON.parse(
  fs.readFileSync(softwarePath, "utf-8")
);

app.post("/search", async (req, res) => {
  const userQuery = req.body?.query || "";

  const prompt = `
You are a software recommendation assistant.

SOFTWARE DATA
${JSON.stringify(softwareData, null, 2)}

QUESTION
${userQuery}

Return only relevant software results.
`;

  try {
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "smollm2",
        prompt,
        stream: false
      })
    });

    const data = await ollamaResponse.json();
    const answer = data?.response ?? (data && JSON.stringify(data));
    res.json({ answer });
  } catch (err) {
    console.error("Ollama error:", err);
    res.status(502).json({
      answer: "Recommendation service is unavailable. Use the form above for instant client-side recommendations."
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
