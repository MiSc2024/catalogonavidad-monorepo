const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Evita problemas de CORS desde la app Vite o Netlify App
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export default async function (request, context) {
  // Manejo de Preflight CORS
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const productName = body?.productName;
    const productDescription = body?.productDescription;

    if (!productName || !productDescription) {
      return new Response(JSON.stringify({ error: "Payload inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const GEMINI_API_KEY = context?.env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    console.log("--- AUDITORÍA DE BACKEND ---");
    console.log("¿GEMINI_API_KEY cargada?:", !!GEMINI_API_KEY);
    if (GEMINI_API_KEY) console.log("Primer carácter de la Key:", GEMINI_API_KEY.charAt(0));
    console.log("Destino de API: Google Gemini (NO Stackbit)");
    console.log("----------------------------");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API Key no configurada en el servidor." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const prompt = `Genera 2 ideas simples para eventos navideños con ${productName}:

1. [Título corto]: [Descripción de 1-2 líneas]
2. [Título corto]: [Descripción de 1-2 líneas]

Formato HTML básico.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9500); // Cortar a los 9.5s para no llegar a los 10s límite
    
    let geminiResponse;
    try {
      geminiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.warn("⚠️ TIMEOUT: La API de Google tardó más de 9.5s. Sirviendo Idea de Reserva.");
        const fallbackData = {
          candidates: [{
            content: { parts: [{ text: "<h4>Idea de Reserva 1: Evento Fotográfico</h4><p>Organiza un concurso de selfies en Instagram. La red de IA está saturada ahora mismo.</p><br/><h4>Idea de Reserva 2: Oferta Flash</h4><p>Atrae miradas ofreciendo un regalo lindo y misterioso a los 10 primeros visitantes de la atracción.</p>" }] }
          }]
        };
        return new Response(JSON.stringify(fallbackData), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      throw fetchError;
    }

    const data = await geminiResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error en la función de Gemini:", error);
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
