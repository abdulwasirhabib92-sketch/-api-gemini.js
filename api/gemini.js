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

    // --- PASTE YOUR ACTUAL GROQ API KEY HERE ---
    const API_KEY = "PASTE_GROQ_API_KEY_HERE";
    const FINAL_API_KEY = process.env.GROQ_API_KEY || API_KEY;

    if (!FINAL_API_KEY || FINAL_API_KEY === "PASTE_GROQ_API_KEY_HERE") {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY setup inside the code or environment variable configuration."
      });
    }

    const prompt = `
You are an elite Agronomy AI assistant specializing in West African agriculture.
You are connected to a real-time smart farming dashboard.

Current live telemetry:
- Temperature: ${liveData?.temp}°C
- Humidity: ${liveData?.humidity}%
- Soil Moisture: ${liveData?.soil}%
- Light Intensity: ${liveData?.light}%

Rules:
- Be concise
- Be practical
- Give actionable farming advice
- Speak clearly for farmers
- Use live telemetry in your answers

User Question:
${message}
`;

    // Fetching the Groq API Chat Completion Endpoint directly
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
