
import { Bias, QuizQuestion } from "../types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "x-ai/grok-4.1-fast"; // Fast, high reasoning model

export const callOpenRouter = async (messages: any[], config: { temperature?: number, response_format?: any } = {}) => {
  const apiKey = localStorage.getItem('cognibias-openrouter-key');
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "CogniBias Architect",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      temperature: config.temperature ?? 0.5, // Lower temperature for more structured/logical outputs
      response_format: config.response_format
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "API_REQUEST_FAILED");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateAIPoweredScenario = async (bias: Bias): Promise<string> => {
  try {
    const content = await callOpenRouter([
      { 
        role: "system", 
        content: "You are an expert in cognitive science and instructional design." 
      },
      { 
        role: "user", 
        content: `Generate a subtle, realistic workplace or daily life scenario demonstrating "${bias.name}" (${bias.definition}). 
        Do not mention the bias name. Max 250 characters.` 
      }
    ]);
    return content.trim();
  } catch (error) {
    console.error("Scenario generation failed:", error);
    return bias.example;
  }
};

export const generateQuizQuestion = async (biases: Bias[]): Promise<QuizQuestion> => {
  const targetBias = biases[Math.floor(Math.random() * biases.length)];
  const distractors = biases
    .filter(b => b.id !== targetBias.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  try {
    const prompt = `
      Create a multiple-choice question to test understanding of "${targetBias.name}".
      Definition: "${targetBias.definition}".
      
      RULES FOR LEARNING DESIGN:
      1. Scenario: A realistic situation where someone might commit this bias.
      2. Question: Ask what bias is at play OR what the best mitigation strategy is.
      3. Options: 4 total (1 Correct, 3 Distractors).
      4. Distractors: Must be PLAUSIBLE. Use related cognitive biases or common logical errors.
      5. Constraint: All options must be of similar length and grammatical structure.
      6. No "All of the above" or "None of the above".
      
      Output strictly valid JSON:
      {
        "scenario": "string",
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": "string (must match one option exactly)",
        "explanation": "string (briefly explain why the answer is correct and why distractors are wrong)"
      }
    `;

    const content = await callOpenRouter([
      { role: "system", content: "You are a rigorous assessment developer. JSON only." },
      { role: "user", content: prompt }
    ], { 
      response_format: { type: "json_object" } 
    });

    const data = JSON.parse(content);
    
    // Fallback validation
    if (!data.options || !data.correctAnswer) throw new Error("Invalid format");

    return {
      biasId: targetBias.id,
      isScenario: true,
      content: `${data.scenario}\n\n${data.question}`,
      correctAnswer: data.correctAnswer,
      options: data.options.sort(() => 0.5 - Math.random()), // Shuffle locally to ensure randomness
      explanation: data.explanation
    };
  } catch (error) {
    console.warn("Falling back to static quiz generation due to error:", error);
    return {
      biasId: targetBias.id,
      isScenario: false,
      content: `Which concept matches this definition: "${targetBias.definition}"?`,
      correctAnswer: targetBias.name,
      options: [targetBias.name, ...distractors.map(d => d.name)].sort(() => 0.5 - Math.random()),
      explanation: targetBias.definition
    };
  }
};
