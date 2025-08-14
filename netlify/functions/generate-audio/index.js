const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { payload } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "API Key no configurada en el servidor." });
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await geminiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error en la función de TTS:", error);
    res.status(500).json({ error: "Error al contactar la API de TTS." });
  }
};
