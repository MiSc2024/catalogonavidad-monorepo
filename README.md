# Catálogo de Navidad — Monorepo (guía en español)

Aplicación de catálogo navideño (Vite + React + TypeScript) con funciones serverless en Netlify integradas con Gemini (Google Generative Language) para generar ideas de eventos y audio por TTS.

## Qué se implementó

- Monorepo listo para `netlify dev` (funciones y frontend detectados).
- Migración a Netlify Functions 2.0 (ESM): `export default async (request, context)`.
- Funciones activas:
  - `generate-ideas`: devuelve HTML con ideas de activación.
  - `generate-audio`: devuelve audio (AUDIO inlineData) desde el modelo TTS.
- Lectura robusta de la clave: `context.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY`.
- Frontend:
  - Genera ideas desde la función.
  - Reproduce audio TTS (PCM L16 → WAV → `<audio>`), con voces y soporte multi‑locutor.
- Función opcional de diagnóstico `env-check` para validar variables de entorno en local.

## Estructura relevante

- `netlify/functions/generate-ideas/index.js` → Llama a Gemini (texto/HTML).
- `netlify/functions/generate-audio/index.js` → Llama a Gemini TTS (modalidad AUDIO).
- `packages/frontend/services/geminiService.ts` → Cliente para ideas y TTS (decodifica PCM y reproduce).
- `packages/frontend/components/ProductSection.tsx` → Botón de altavoz y disparo de TTS.
- `netlify.toml` → Config de monorepo (base del frontend y carpeta de funciones).

## Requisitos

- Node.js (LTS)
- Netlify CLI
- Clave de API de Gemini (`GEMINI_API_KEY`)

## Variables de entorno

Configúrala en uno de estos archivos (en local, Netlify CLI prioriza `.env.local` del frontend):

- `packages/frontend/.env.local`
- o `.env` en la raíz del repo

Contenido:

```env
GEMINI_API_KEY=tu_clave_de_gemini
```

Nota: No publiques claves en el repositorio (añádelo a `.gitignore` si aplica).

## Ejecutar en local

1) Instalar dependencias del frontend

```bash
cd packages/frontend
npm install
```

1) Levantar Netlify Dev desde la raíz

```bash
cd ../..
netlify dev
```

- UI local: <http://localhost:8888>
- Funciones: `/.netlify/functions/*`

## Endpoints

- Generar ideas (POST): `/.netlify/functions/generate-ideas`
  - Body:

```json
{ "productName": "Cometa", "productDescription": "Atracción navideña para niños" }
```

- Generar audio TTS (POST): `/.netlify/functions/generate-audio`
  - Body mínimo (el frontend construye payloads más ricos):

```json
{
  "payload": {
    "contents": [{ "parts": [{ "text": "Hola desde TTS" }]}],
    "generationConfig": { "responseModalities": ["AUDIO"] },
    "model": "gemini-2.5-flash-preview-tts"
  }
}
```

Respuesta: `candidates[0].content.parts[0].inlineData` (con `mimeType` y `data` base64).

## Reproducción de audio en el frontend

`geminiService.ts` decodifica `inlineData.data` (base64) a PCM 16‑bit, empaqueta WAV (cabecera de 44 bytes con sample rate del MIME) y reproduce con `Audio()`.

## Modelos usados

- Ideas: `gemini-2.5-flash-preview-05-20`
- TTS: `gemini-2.5-flash-preview-tts`

## Pruebas rápidas

- Ideas

```bash
curl -s -X POST http://localhost:8888/.netlify/functions/generate-ideas \
  -H "Content-Type: application/json" \
  -d '{"productName":"Cometa","productDescription":"Atracción navideña para niños"}' | jq .
```

- Audio

```bash
curl -s -X POST http://localhost:8888/.netlify/functions/generate-audio \
  -H "Content-Type: application/json" \
  -d '{"payload":{"contents":[{"parts":[{"text":"Hola desde TTS"}]}]}}' | jq .
```

## Solución de problemas

- Puerto 8888 ocupado:

```bash
lsof -ti:8888 | xargs kill -9 2>/dev/null || true
```

- La API key no se inyecta en funciones:
  - Verifica `packages/frontend/.env.local` o `.env` en la raíz.
  - Usa `/.netlify/functions/env-check` si está disponible.
  - Reinicia `netlify dev` o elimina la carpeta `.netlify/`.
- Error de modalidad (TEXT no soportado por TTS):
  - Envía `generationConfig.responseModalities: ["AUDIO"]`.

## Notas

- Functions 2.0 (ESM) + fallback a `process.env` para mayor compatibilidad en local.
- El frontend no expone la clave: todas las llamadas a Gemini se realizan desde funciones serverless.
