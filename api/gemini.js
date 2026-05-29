const fetch = require("node-fetch");

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests allowed"
    });
  }

  try {
    const { message, liveData } = req.body || {};

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // --- CONFIGURATION ---
    const API_KEY = "PASTE_GROQ_API_KEY_HERE";
    const FINAL_API_KEY = process.env.GROQ_API_KEY || API_KEY;

    if (!FINAL_API_KEY || FINAL_API_KEY === "PASTE_GROQ_API_KEY_HERE") {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY setup inside the code or environment variable configuration."
      });
    }

    // UPDATED PROMPT: Instructs the AI to act as a general farming/agronomy expert, not limiting it to just parameter monitoring.
    const prompt = `
You are an elite, comprehensive Agronomy AI assistant specializing in general farming, crop science, pest control, livestock, and West African agriculture. 
You are connected to a real-time smart farming dashboard.

Here is the current dashboard live telemetry for context (use this when relevant, but don't limit your knowledge to it):
- Temperature: ${liveData?.temp}°C
- Humidity: ${liveData?.humidity}%
- Soil Moisture: ${liveData?.soil}%
- Light Intensity: ${liveData?.light}%

Rules:
1. Answer ANY and ALL general farming questions the user asks (e.g., crop rotation, fertilizer application, fighting plant pests, irrigation planning, livestock care, soil testing, or weather guidance).
2. Do NOT restrict your answers to the dashboard metrics. If a user asks about how to plant maize, cure a tomato disease, or manage cassava, provide complete professional agricultural guidance.
3. If the user asks specifically about their current metrics, use the telemetry listed above to diagnose their farm situation.
4. Keep answers clear, practical, concise, and highly actionable for farmers.

User Question:
${message}
`;

    // Fetching Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FINAL_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Groq API Error",
        details: data
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "No AI reply returned",
        details: data
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
};
