
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { getSystemInstruction } from '../constants';
import { Language } from "../types";
import { locales } from "../i18n/locales";

// The API key is injected via Vite environment variables.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Falta la clave API en entorno: VITE_GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Maintain a single, language-specific error message to avoid complexity.
const getGeminiConnectionError = () => {
    // Default to English if language detection fails.
    const lang = (document.documentElement.lang as Language) || 'en';
    return locales.geminiConnectionError[lang];
}

export const geminiService = {
  /**
   * Creates and returns a new chat session with the Gemini model.
   * @param history - An initial array of content to seed the chat history.
   * @param lang - The selected language for the system instruction.
   * @param name - The user's name to personalize the system instruction.
   * @returns A Chat instance.
   */
  startChat: (history: Content[], lang: Language, name: string): Chat => {
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(lang, name),
      },
      history: history,
    });
  },

  /**
   * Sends a message to the provided chat session and gets the model's response.
   * @param chat - The active Chat instance.
   * @param message - The user's message text.
   * @returns The bot's response text.
   */
  sendMessage: async (chat: Chat, message: string): Promise<string> => {
    try {
      const result: GenerateContentResponse = await chat.sendMessage({ message });
      const text = result.text ?? getGeminiConnectionError();
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Provide a user-friendly error message
      return getGeminiConnectionError();
    }
  },
};
