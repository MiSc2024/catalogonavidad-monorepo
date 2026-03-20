import fs from 'fs/promises';
import path from 'path';

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
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } 
    });
  }

  try {
    const body = await request.json();
    const { slug, description } = body;

    if (!slug || !description) {
      return new Response(JSON.stringify({ error: "Faltan parámetros 'slug' y 'description'" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Directorio de productos locales
    const filePath = path.join(process.cwd(), 'packages', 'frontend', 'content', 'productos', `${slug}.md`);

    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      return new Response(JSON.stringify({ error: `Archivo Markdown no encontrado para el producto: ${slug}` }), { 
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }

    // Escapar dobles comillas para YAML
    const safeDescription = description.replace(/"/g, '\\"').replace(/\n/g, ' ');

    let newContent;
    const regex = /^description:\s*.*$/m;
    if (regex.test(fileContent)) {
      // Reemplazar el campo exitente, manteniendo el resto de fileContent intacto
      newContent = fileContent.replace(regex, `description: "${safeDescription}"`);
    } else {
      // Insertar el campo justo antes de cerrar el frontmatter
      newContent = fileContent.replace(/---([\s\S]*?)---/, (match, p1) => {
        return `---${p1}description: "${safeDescription}"\n---`;
      });
    }

    // Escribir el nuevo archivo manteniendo los demás datos frontmatter intactos
    await fs.writeFile(filePath, newContent, 'utf-8');

    return new Response(JSON.stringify({ success: true, message: "Frontmatter description update success." }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error al sobrescribir archivo markdown:", error);
    return new Response(
      JSON.stringify({ error: "Server Error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
