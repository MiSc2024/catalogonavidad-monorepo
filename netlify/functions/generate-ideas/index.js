const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { productName, productDescription } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "API Key no configurada en el servidor." });
  }

  const prompt = `Eres un organizador de eventos experto y muy creativo. Para la atracción de Navidad llamada '${productName}', que consiste en '${productDescription}', genera 3 ideas de evento distintas y detalladas exclusivamente para un centro comercial. Para cada idea, proporciona un Título, un Tema, y sugerencias de Decoración y Actividades Complementarias. Formatea tu respuesta en HTML, usando <h4> para los títulos de las ideas y <strong> para 'Tema', 'Decoración' y 'Actividades'.`;

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await geminiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error en la función de Gemini:", error);
    res.status(500).json({ error: "Error al contactar la API de Gemini." });
  }
};
