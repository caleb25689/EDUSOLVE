import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

    res.json({ answer: reply });
  } catch (error) {
    console.error("Error reaching Gemini API:", error.message);
    res.status(500).json({ error: "Error reaching Gemini API. Check your network or API key." });
  }
});

// 🚀 IMPORTANT: Railway gives you PORT automatically
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 EduBot running on port ${PORT}`);
});

