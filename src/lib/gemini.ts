import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function auditCode(code: string, filename: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `
        Analyze the following code for security vulnerabilities, malware patterns, or dangerous operations.
        Filename: ${filename}
        
        Code:
        ${code}
        
        Provide your audit in JSON format with the following structure:
        {
          "status": "safe" | "warning" | "dangerous",
          "score": number (0-100, 100 is perfectly safe),
          "findings": string[],
          "summary": string
        }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["safe", "warning", "dangerous"] },
            score: { type: Type.NUMBER },
            findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["status", "score", "findings", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Audit failed:", error);
    throw error;
  }
}
