module.exports = async (req, res) => {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests allowed"
    });
  }

  try {
    // Get message from frontend
    const { message } = req.body || {};

    // Validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key missing"
      });
    }

    // AI Prompt
    const prompt = `
You are an elite Agronomy AI assistant specializing in West African agriculture.
Be concise, practical, and field-ready.

User question:
${message}
`;

    // Send request to Gemini
    const geminiResponse = await fetch(
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

    // Parse Gemini response
    const data = await geminiResponse.json();

    console.log("Gemini Response:", data);

    // Check for Gemini API errors
    if (!geminiResponse.ok) {
      return res.status(500).json({
        error: "Gemini API Error",
        details: data
      });
    }

    // Extract AI reply
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Handle empty response
    if (!reply) {
      return res.status(500).json({
        error: "No reply from Gemini",
        data
      });
    }

    // Send response back to frontend
    return res.status(200).json({
      reply
    });

  } catch (err) {
    console.error("Server Error:", err);

    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
  }
};
