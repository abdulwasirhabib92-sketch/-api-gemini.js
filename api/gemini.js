const fetch = require("node-fetch");

module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests allowed"
    });
  }

  try {
    const { message, liveData, image } = req.body || {};

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

    // Base core context system configurations
    const systemInstruction = `You are an elite, comprehensive Agronomy AI assistant specializing in general farming, crop science, visual crop leaf disease diagnostics, pest control, and West African agriculture. 
You are connected to a real-time smart farming dashboard.

Here is the current dashboard live telemetry context for environmental matching:
- Temperature: ${liveData?.temp || 24}°C
- Humidity: ${liveData?.humidity || 55}%
- Soil Moisture: ${liveData?.soil || 42}%
- Light Intensity: ${liveData?.light || 67}%

Rules:
1. If an image is provided, thoroughly scan and visually analyze it for crop damage, fungal patterns, pests, nutritional deficiencies, or wilting. Provide a clear diagnosis, risk assessment level, and biological or chemical mitigation strategies.
2. Answer any comprehensive or general farming questions alternative text asks (crop rotation, planting cycles, soil test parsing, etc).
3. Do not restrict text generation purely to parameter scopes unless explicitly prompted.
4. Keep all replies actionable, crisp, and direct for easy operational field reading.`;

    // Initialize content structure array compliant with Groq vision/text format requirements
    let contentPayload = [];

    // Switch model dynamically if visual diagnostic image array objects are detected inside wire payloads
    let selectedModel = "llama-3.3-70b-versatile"; // Default high capacity model

    if (image) {
      // Use Groq's high-performance multi-modal vision flagship model
      selectedModel = "llama-3.2-90b-vision-preview";

      // Append image reference parameters parsed clean of default headers format if passed intact
      // Extract structure: "data:image/jpeg;base64,..."
      contentPayload.push({
        type: "image_url",
        image_url: {
          url: image
        }
      });
    }

    // Append primary descriptive user textual prompt strings inside array contents
    contentPayload.push({
      type: "text",
      text: `${systemInstruction}\n\nUser Input/Question: ${message}`
    });

    // Make post call structure targeting the uniform completions endpoint
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FINAL_API_KEY}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: "user",
            content: contentPayload
          }
        ],
        temperature: 0.2
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
