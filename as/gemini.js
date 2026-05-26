export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, liveData } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Context string required" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    
    // Injecting live metrics data safely as an assistant context profile
    let contextualSystemPrompt = "You are an intelligent automated agricultural asset manager for Smart Farm. ";
    if (liveData) {
      contextualSystemPrompt += `Current system telemetry points right now are: 
      - Temperature: ${liveData.temp}°C
      - Relative Humidity: ${liveData.humidity}%
      - Current Soil Moisture content: ${liveData.soil}%
      - Light Intensity: ${liveData.light}%. 
      Incorporate these values precisely if the operator asks about current status or diagnostic summaries. Keep statements succinct.`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${contextualSystemPrompt}\n\nOperator Question: ${message}` }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response trace recovered.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({
      error: "Server connection failure",
      details: error.message
    });
  }
}
