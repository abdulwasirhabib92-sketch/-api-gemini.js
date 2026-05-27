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

    // Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Missing GEMINI_API_KEY"
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

    // Send request to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    // Parse response
    const data = await response.json();

    // Debug logs
    console.log("Gemini Response:", JSON.stringify(data, null, 2));

    // Gemini API failure
    if (!response.ok) {
      return res.status(500).json({
        error: "Gemini API Error",
        details: data
      });
    }

    // Extract AI text
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

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
