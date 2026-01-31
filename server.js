import express from "express";
import dotenv from "dotenv";
//import fetch from "node-fetch"; // for Node v16 or older; if using Node 18+, can skip this

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const payload = {
      model: "openai/gpt-4o-mini",  // or "openai/gpt-oss-20b:free"
      messages: [{ role: "user", content: message }]
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MyLocalChatbot"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply received.";
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
