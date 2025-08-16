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
