
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_PREFIX = 'bible_cache_v1_';

export const generateDailyPause = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Gere uma "Pausa Diária" cristã em Português Brasil. Inclua 1 versículo curto, uma reflexão de 1 minuto e uma pergunta prática. Retorne em formato JSON estrito.',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verse: { type: Type.STRING },
          reference: { type: Type.STRING },
          reflection: { type: Type.STRING },
          question: { type: Type.STRING },
        },
        required: ["verse", "reference", "reflection", "question"],
      },
    },
  });
  return JSON.parse(response.text || '{}');
};

export const generateDevotional = async (theme: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Gere um devocional cristão edificante em Português Brasil sobre o tema: ${theme}. Inclua título, versículo base e conteúdo. Resposta em JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          verse: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ["title", "verse", "content"],
      },
    },
  });
  return JSON.parse(response.text || '{}');
};

export const fetchBibleText = async (book: string, chapter: number, version: string) => {
  const cacheKey = `${CACHE_PREFIX}${version}_${book}_${chapter}`.replace(/\s+/g, '_');
  
  // 1. Tenta recuperar do Cache Local (Persistente)
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.warn("Erro ao ler cache, buscando via API...", e);
    }
  }

  // 2. Busca via API se não houver no cache
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `JSON: ${book} ${chapter} (${version}) PT-BR. Formato: [{verse:int, text:string}].`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            verse: { type: Type.INTEGER },
            text: { type: Type.STRING },
          },
          required: ["verse", "text"],
        },
      },
    },
  });

  const result = JSON.parse(response.text || '[]');
  
  // 3. Salva no cache se o resultado for válido
  if (result && result.length > 0) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (e) {
      // Se o localStorage estiver cheio, limpa caches antigos
      console.warn("LocalStorage cheio, limpando caches antigos...");
      Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
    }
  }

  return result;
};
