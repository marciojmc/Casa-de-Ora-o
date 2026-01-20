
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const CACHE_PREFIX = 'bible_cache_v1_';

const safeLocalStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch (e) { return false; }
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch (e) { }
  }
};

export const generateDailyPause = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Gere uma "Pausa Diária" cristã em Português Brasil. Inclua 1 versículo curto, uma reflexão de 1 minuto e uma pergunta prática. Retorne estritamente em JSON.',
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
    contents: `Gere um devocional cristão edificante sobre o tema: ${theme}. Inclua título, versículo base e conteúdo. Resposta em JSON.`,
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
  
  const cachedData = safeLocalStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      safeLocalStorage.removeItem(cacheKey);
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Retorne o texto de ${book} capítulo ${chapter} na versão ${version}. Responda apenas com um array JSON de objetos contendo "verse" (int) e "text" (string).`,
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
  
  if (result && result.length > 0) {
    const success = safeLocalStorage.setItem(cacheKey, JSON.stringify(result));
    if (!success) {
      // Limpeza agressiva se falhar
      Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => safeLocalStorage.removeItem(k));
    }
  }

  return result;
};
