import { GoogleGenAI } from "@google/genai";

export const getPrintAdvice = async (query: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Assistant is currently offline (Missing API Key).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: `You are an expert printing consultant for a premium printing press in Abu Dhabi called 'Abu Dhabi Print Pro'. 
        Your goal is to help customers choose the best paper, finish, and printing techniques for their needs.
        Keep answers concise, professional, and helpful. 
        If asked about delivery, mention we offer Same-Day printing and delivery across Abu Dhabi.
        If asked about prices, give general estimates but refer them to the price calculator.
        Tone: Helpful, Professional, Knowledgeable.`,
      },
    });

    return response.text || "I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the print knowledge base right now.";
  }
};
