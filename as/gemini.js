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
    // You can paste your API key below or set it as a Vercel environment variable named GROQ_API_KEY
    const API_KEY = "PASTE_GROQ_API_KEY_HERE";
    const FINAL_API_KEY = process.env.GROQ_API_KEY || API_KEY;

    if (!FINAL_API_KEY || FINAL_API_KEY === "PASTE_GROQ_API_KEY_HERE") {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY. Please provide your Groq API key inside /api/gemini.js or via your Vercel Dashboard."
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

    // --- REMOVED OLD GEMINI API LOGIC ---
    // --- ADDED REPLACEMENT GROQ API LOGIC ---
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

    // Parse incoming response data
    const data = await response.json();

    // Debug logs in Vercel console
    console.log("Groq Response Status:", response.status);

    // Groq API failure catch
    if (!response.ok) {
      return res.status(500).json({
        error: "Groq API Error",
        details: data
      });
    }

    // Extract AI text response cleanly
    const reply = data?.choices?.[0]?.message?.content;

    // Empty AI response handling
    if (!reply) {
      return res.status(500).json({
        error: "No AI reply returned",
        details: data
      });
    }

    // Send valid JSON payload back to frontend
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
