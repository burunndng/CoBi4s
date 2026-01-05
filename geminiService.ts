
import { GoogleGenAI, Type } from "@google/genai";
import { Bias, QuizQuestion } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIPoweredScenario = async (bias: Bias): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Task: Generate a realistic, subtle workplace or social scenario demonstrating the cognitive bias "${bias.name}".
      Definition: ${bias.definition}
      Constraint: Max 250 characters. Do not use the bias name in the scenario.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text.trim() || bias.example;
  } catch (error) {
    console.error("Scenario generation failed:", error);
    return bias.example;
  }
};

export const generateQuizQuestion = async (biases: Bias[]): Promise<QuizQuestion> => {
  const targetBias = biases[Math.floor(Math.random() * biases.length)];
  
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are an expert in cognitive science and professional assessment design.
      
      Create a high-quality Multiple Choice Question (MCQ) for the bias: "${targetBias.name}".
      Definition: "${targetBias.definition}"
      
      RIGOROUS ASSESSMENT RULES:
      1. SCENARIO: A subtle, realistic situation (max 250 chars). No obvious keywords.
      2. QUESTION: Ask which specific bias is demonstrated OR the most effective mitigation strategy.
      3. OPTIONS: Provide 4 options total.
      4. DISTRACTORS: Must be plausible but incorrect. Use related biases or common cognitive misconceptions.
      5. HOMOGENEITY: All 4 options must be of nearly identical length and grammatical structure.
      6. EXPLANATION: Concise reasoning for the correct answer and why the distractors are incorrect.
      
      Format: JSON.`,
      config: {
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Exactly 4 options"
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["scenario", "question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return {
      biasId: targetBias.id,
      isScenario: true,
      content: `${data.scenario}\n\n${data.question}`,
      correctAnswer: data.correctAnswer,
      options: data.options.sort(() => 0.5 - Math.random()),
      explanation: data.explanation
    };
  } catch (error) {
    console.error("AI MCQ generation failed:", error);
    // Safe fallback
    const distractors = biases
      .filter(b => b.id !== targetBias.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    return {
      biasId: targetBias.id,
      isScenario: false,
      content: `Which concept refers to: ${targetBias.definition}?`,
      correctAnswer: targetBias.name,
      options: [targetBias.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random()),
      explanation: targetBias.definition,
    };
  }
};

/**
 * Teaching Simulator Logic
 */
export const generateSimulatorStep = async (bias: Bias, phase: 'pre' | 'teach' | 'post'): Promise<any> => {
  const ai = getAI();
  let prompt = "";
  
  if (phase === 'pre') {
    prompt = `Generate a subtle diagnostic scenario for "${bias.name}". Present a situation and ask the user how they would react or what they observe. Provide 2 plausible options. Output JSON: { scenario, question, options: [str, str], correctIndex, explanation }. Options must be similar length.`;
  } else if (phase === 'post') {
    prompt = `Generate a complex application scenario for "${bias.name}". Focus on selecting the correct counter-strategy. Provide 3 plausible options of similar length. Output JSON: { scenario, question, options: [str, str, str], correctIndex, explanation }.`;
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      temperature: 0.5,
      responseMimeType: "application/json",
    }
  });
  
  return JSON.parse(response.text.trim());
};
