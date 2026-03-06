
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processLyricInput = async (prompt: string, imageData?: string, mimeType: string = 'image/jpeg') => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Ianao dia mpanampy manokana ho an'ny chorale STK Fanilon'ny FAMONJENA.
    Ny asanao dia ny maka ny tonon-kira avy amin'ny sary (OCR), PDF na lahatsoratra tsotra.
    
    Fitsipika arahina:
    1. Vaky tsara ny sary na lahatsoratra ary avoahy ny tonon-kira madio.
    2. Amboary ny endriny (couplets, refrain) mba ho mora vakiana.
    3. Manolora sokajy (category) mifanaraka amin'ny votoatin'ny hira. Ireto ny sokajy azo isafidianana: 
       'Fiderana', 'Fibebahana', 'Faneva', 'Fanahy Masina', 'Noely', 'Paska', 'Fanoloran-tena', 'Fitiavana', 'Fisaorana', na 'Hafa'.
    4. Hazavao fohy (indray fehezanteny) ny antony nifidiananao io sokajy io (categoryReasoning).
    5. Valio amin'ny teny malagasy hatrany.
    6. Omeo amin'ny endrika JSON ny valiny.
  `;

  try {
    const parts = [];
    
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: imageData
        }
      });
    }
    
    parts.push({ text: prompt || "Vakio ary amboary ity hira ity azafady." });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Ny lohatenin'ny hira.",
            },
            lyrics: {
              type: Type.STRING,
              description: "Ny tonon-kira voarindra tsara.",
            },
            category: {
              type: Type.STRING,
              description: "Ny sokajy mifanaraka amin'ilay hira.",
            },
            categoryReasoning: {
              type: Type.STRING,
              description: "Ny antony nifidianana ilay sokajy.",
            }
          },
          required: ["title", "lyrics", "category", "categoryReasoning"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Nisy fahadisoana teo am-pifandraisana amin'ny AI.");
  }
};
