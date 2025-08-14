const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { productName, productDescription } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "API Key no configurada en el servidor." });
  }

  const prompt = `Eres un organizador de eventos navideños experto y creativo. Para la atracción llamada '${productName}', que consiste en '${productDescription}', genera 3 ideas de evento exclusivas para un centro comercial. Cada idea debe incluir:

  - Un Título atractivo
  - Un Tema navideño original
  - Sugerencias de Decoración específicas para la atracción (colores, materiales, elementos visuales, iluminación, etc.)
  - Actividades complementarias para familias y niños
  - Propuestas de cupones QR para activar el centro comercial y motivar a los operadores de las tiendas, siguiendo este funcionamiento:
    * Cada cupón QR está asociado a una atracción y franja horaria.
    * El usuario escanea el QR, accede a una landing de campaña y canjea el cupón con un PIN de tienda (sin datos personales).
    * KPIs a medir: scans, clics, canjes por tienda/franja/día, top-cupones, NPS.
    * Privacidad: no se piden datos personales, solo opt-in opcional con consentimiento.
    * Entregables: landing, QR, panel de canjes y reporte semanal.
    * OASIZ aporta el listado de tiendas adheridas.

Formatea la respuesta en HTML, usando <h4> para los títulos y <strong> para 'Tema', 'Decoración', 'Actividades' y 'Cupones QR'. Sé detallado y creativo, y adapta las ideas a la atracción presentada.`;

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
