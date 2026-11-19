
require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json({ limit: "10kb" }));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
    try {
        if (req.headers["x-game-secret"] !== process.env.GAME_SECRET) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const message = req.body.message;

        if (typeof message !== "string" || message.length > 1000 || !message.trim()) {
            return res.status(400).json({ error: "Invalid message" });
        }

        const response = await openai.responses.create({
            model: "gpt-4.1-mini",
            instructions: "Ты дружелюбный NPC в игре Roblox. Отвечай кратко и интересно.",
            input: message
        });

        res.json({ reply: response.output_text });
    } catch (error) {
        console.error("AI error:", error.message);
        res.status(500).json({ error: "AI request failed" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Roblox AI server started on port " + PORT);
});
});