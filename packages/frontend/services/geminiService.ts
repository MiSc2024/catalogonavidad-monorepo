import type { Product } from "../types";

// --- Constantes ---
const IDEAS_ENDPOINT = "/.netlify/functions/generate-ideas";
const AUDIO_ENDPOINT = "/.netlify/functions/generate-audio";
const DEFAULT_SAMPLE_RATE = 24000;
const DEFAULT_VOICE = "Zubenelgenubi";
const DEFAULT_MODEL = "gemini-2.5-flash-preview-tts";

// --- Funciones de Generación de Contenido ---

export const generateEventIdeas = async (
  productName: string,
  productDescription: string
): Promise<string> => {
  try {
    const response = await fetch(IDEAS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, productDescription }),
    });
    if (!response.ok)
      throw new Error(`Error en el servidor: ${response.statusText}`);
    const result = await response.json();
    return (
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "<p>No se pudieron generar ideas en este momento.</p>"
    );
  } catch (error) {
    console.error("Error al generar ideas:", error);
    throw new Error("No se pudo conectar con el servicio de IA.");
  }
};

// --- Funciones de Audio (TTS) ---

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  // Más eficiente usando Uint8Array.from si está disponible
  const binaryString = window.atob(base64);
  return Uint8Array.from(binaryString, (c) => c.charCodeAt(0)).buffer;
};

const pcmToWav = (pcmData: Int16Array, sampleRate: number): Blob => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const dataSize = pcmData.length * 2;

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const wavView = new DataView(wavBuffer);

  for (let i = 0; i < 44; i++) {
    wavView.setUint8(i, view.getUint8(i));
  }
  for (let i = 0; i < pcmData.length; i++) {
    wavView.setInt16(44 + i * 2, pcmData[i], true);
  }

  return new Blob([wavView], { type: "audio/wav" });
};

type TTSRequestParams = {
  payload: any;
  button: HTMLSpanElement;
  audioPlayer: HTMLAudioElement | null;
  setAudioPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  currentPlayingButton: HTMLSpanElement | null;
  setCurrentPlayingButton: React.Dispatch<
    React.SetStateAction<HTMLSpanElement | null>
  >;
};

const processTTSRequest = async ({
  payload,
  button,
  audioPlayer,
  setAudioPlayer,
  currentPlayingButton,
  setCurrentPlayingButton,
}: TTSRequestParams): Promise<void> => {
  if (currentPlayingButton && currentPlayingButton !== button) {
    currentPlayingButton.innerText = "🔊";
  }
  if (audioPlayer && !audioPlayer.paused) {
    audioPlayer.pause();
  }
  if (currentPlayingButton === button) {
    setCurrentPlayingButton(null);
    return;
  }
  button.innerText = "⏳";
  setCurrentPlayingButton(button);
  try {
    const response = await fetch(AUDIO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const result = await response.json();
    const audioData =
      result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType =
      result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType;
    if (audioData && mimeType && mimeType.startsWith("audio/")) {
      const sampleRateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = sampleRateMatch
        ? parseInt(sampleRateMatch[1], 10)
        : DEFAULT_SAMPLE_RATE;
      const pcmData = base64ToArrayBuffer(audioData);
      const pcm16 = new Int16Array(pcmData);
      const wavBlob = pcmToWav(pcm16, sampleRate);
      const audioUrl = URL.createObjectURL(wavBlob);
      let player = audioPlayer;
      if (!player) {
        player = new Audio();
        setAudioPlayer(player);
      }
      player.src = audioUrl;
      player.play();
      button.innerText = "⏸️";
      player.onended = () => {
        if (currentPlayingButton === button) {
          button.innerText = "🔊";
          setCurrentPlayingButton(null);
        }
      };
    } else {
      throw new Error("No se recibió audio en la respuesta.");
    }
  } catch (error) {
    console.error("Error al generar audio:", error);
    alert("No se pudo generar el audio. Inténtalo de nuevo.");
    button.innerText = "�";
    setCurrentPlayingButton(null);
  }
};

export const generateAndPlayAudio = (
  button: HTMLSpanElement,
  elementId: string,
  audioPlayer: HTMLAudioElement | null,
  setAudioPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>,
  currentPlayingButton: HTMLSpanElement | null,
  setCurrentPlayingButton: React.Dispatch<
    React.SetStateAction<HTMLSpanElement | null>
  >
) => {
  const textElement = document.getElementById(elementId);
  if (!textElement || !textElement.firstChild) return;
  const textToSpeak = textElement.childNodes[0].nodeValue?.trim() || "";

  // Personalización por atracción, integrando el texto del catálogo
  let payload;
  if (elementId.includes("reindeer")) {
    // Flecha y Bailarina leen la descripción como si discutieran
    payload = buildMultiCharacterPayload([
      { speaker: "Flecha", voice: "Puck", text: `¡Mi voz es la mejor para contar esto! ${textToSpeak}` },
      { speaker: "Bailarina", voice: "Leda", text: `¡No, la mía es más melodiosa! Escucha: ${textToSpeak}` }
    ]);
  } else if (elementId.includes("sleigh")) {
    // Cometa, Cupido y Papá Noel leen la descripción en formato diálogo
    payload = buildMultiCharacterPayload([
      { speaker: "Cometa", voice: "Puck", text: `Papá Noel, ¿puedes contarnos sobre el trineo VR?` },
      { speaker: "Papá Noel", voice: "Santa", text: `${textToSpeak}` },
      { speaker: "Cupido", voice: "Leda", text: `¡Qué emocionante! Quiero probarlo ya.` }
    ]);
  } else if (elementId.includes("elevator")) {
    // Duendes leen la descripción invitando a los niños
    payload = buildMultiCharacterPayload([
      { speaker: "Duende1", voice: "Zubenelgenubi", text: `¡Niños, escuchen esto! ${textToSpeak}` },
      { speaker: "Duende2", voice: "Leda", text: `¡Vamos al Polo Norte! ${textToSpeak}` }
    ]);
  } else {
    // Por defecto, voz elegante
    payload = buildAudioPayload(textToSpeak);
  }

  processTTSRequest({
    payload,
    button,
    audioPlayer,
    setAudioPlayer,
    currentPlayingButton,
    setCurrentPlayingButton,
  });
};

// Utilidad para payload de varios personajes
const buildMultiCharacterPayload = (dialogues: { speaker: string; voice: string; text: string }[]) => ({
  contents: [
    {
      parts: [
        {
          text: dialogues.map(d => `${d.speaker}: ${d.text}`).join("\n")
        }
      ]
    }
  ],
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: dialogues.map(d => ({
          speaker: d.speaker,
          voiceConfig: { prebuiltVoiceConfig: { voiceName: d.voice } }
        }))
      }
    }
  },
  model: DEFAULT_MODEL,
});
const buildAudioPayload = (text: string) => ({
  contents: [
    {
      parts: [{ text: `Di con un tono profesional y elegante: ${text}` }],
    },
  ],
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: {
      voiceConfig: { prebuiltVoiceConfig: { voiceName: DEFAULT_VOICE } },
    },
  },
  model: DEFAULT_MODEL,
});

export const generateReindeerDialogue = (
  button: HTMLSpanElement,
  audioPlayer: HTMLAudioElement | null,
  setAudioPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>,
  currentPlayingButton: HTMLSpanElement | null,
  setCurrentPlayingButton: React.Dispatch<
    React.SetStateAction<HTMLSpanElement | null>
  >
) => {
  const script = `Genera un diálogo entre dos personajes.
    Flecha: ¡Con mi voz, este coro de Navidad será el mejor de todos!
    Bailarina: ¿Tu voz? ¡La mía es mucho más melodiosa! ¡Escucha esto!`;
  const payload = buildDialoguePayload(script);
  processTTSRequest({
    payload,
    button,
    audioPlayer,
    setAudioPlayer,
    currentPlayingButton,
    setCurrentPlayingButton,
  });
};

const buildDialoguePayload = (script: string) => ({
  contents: [{ parts: [{ text: script }] }],
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          {
            speaker: "Flecha",
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
          },
          {
            speaker: "Bailarina",
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Leda" } },
          },
        ],
      },
    },
  },
  model: DEFAULT_MODEL,
});
