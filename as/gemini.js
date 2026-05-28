const fetch = require("node-fetch");

module.exports = async (req, res) => {

  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests allowed"
    });
  }

  try {

    // Read incoming data
    const { message, liveData } = req.body || {};

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // --- API KEY CONFIGURATION ---
    // PLACEHOLDER OPTION (As requested):
    const API_KEY = "PASTE_GROQ_API_KEY_HERE";

    // PRODUCTION BACKUP: Prioritize server environment variables for total safety on GitHub/Vercel
    const FINAL_API_KEY = process.env.GROQ_API_KEY || API_KEY;

    if (!FINAL_API_KEY || FINAL_API_KEY === "PASTE_GROQ_API_KEY_HERE") {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY. Please provide it via Vercel Environment Variables or the API_KEY constant."
      });
    }

    // Build intelligent prompt
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

    // --- REMOVED GEMINI ENDPOINT LOGIC ---
    // URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
    
    // --- ADDED GROQ ENDPOINT LOGIC ---
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

    // Parse response
    const data = await response.json();

    // Debug logs
    console.log("Groq Response:", JSON.stringify(data, null, 2));

    // Groq API failure
    if (!response.ok) {
      return res.status(500).json({
        error: "Groq API Error",
        details: data
      });
    }

    // Extract AI text from standard OpenAI/Groq Chat format
    const reply = data?.choices?.[0]?.message?.content;

    // Empty AI response
    if (!reply) {
      return res.status(500).json({
        error: "No AI reply returned",
        details: data
      });
    }

    // Send successful response
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
