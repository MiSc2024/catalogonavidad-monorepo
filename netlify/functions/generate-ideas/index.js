export default async function (request, context) {
  try {
    const body = await request.json();
    const productName = body?.productName;
    const productDescription = body?.productDescription;

    if (!productName || !productDescription) {
      return new Response(JSON.stringify({ error: "Payload inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY =
      context?.env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API Key no configurada en el servidor." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = `Para la atracción navideña '${productName}' (${productDescription}), genera 2 ideas de eventos para centro comercial.

Para cada idea incluye:
- **Título** atractivo
- **Tema** navideño 
- **Decoración** específica
- **Actividades** para familias
- **Cupones QR** promocionales

Responde en HTML con <h4> para títulos y <strong> para secciones. Máximo 200 palabras por idea.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await geminiResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la función de Gemini:", error);
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
