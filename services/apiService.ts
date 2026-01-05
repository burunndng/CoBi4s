
import { Bias, QuizQuestion, BiasedSnippet, Fallacy } from "../types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "x-ai/grok-4.1-fast"; 
const DEFAULT_TEMP = 0.6;

export const callOpenRouter = async (messages: any[], config: { temperature?: number, response_format?: any } = {}) => {
  // Try to get from localStorage first (User Override), then fallback to environment variable (Build time)
  const apiKey = localStorage.getItem('cognibias-openrouter-key') || import.meta.env.VITE_OPENROUTER_API_KEY;
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
      temperature: config.temperature ?? DEFAULT_TEMP,
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
        "correctAnswer": "string",
        "explanation": "string"
      }
    `;

    const content = await callOpenRouter([
      { role: "system", content: "You are a rigorous assessment developer. JSON only." },
      { role: "user", content: prompt }
    ], { 
      response_format: { type: "json_object" } 
    });

    const data = JSON.parse(content);
    
    return {
      biasId: targetBias.id,
      isScenario: true,
      content: `${data.scenario}\n\n${data.question}`,
      correctAnswer: data.correctAnswer,
      options: data.options.sort(() => 0.5 - Math.random()), 
      explanation: data.explanation
    };
  } catch (error) {
    console.warn("Falling back to static quiz generation:", error);
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

export const generateSimulatorStep = async (bias: Bias, phase: 'pre' | 'teach' | 'post'): Promise<any> => {
  let prompt = "";
  if (phase === 'pre') {
    prompt = `Create a diagnostic scenario for "${bias.name}" (${bias.definition}). 
    Provide 2 plausible options. 
    Output JSON: { "scenario": string, "question": string, "options": [string, string], "correctIndex": number, "explanation": string }.`;
  } else {
    prompt = `Create an advanced application scenario for "${bias.name}" (${bias.definition}). 
    Provide 3 plausible options. 
    Output JSON: { "scenario": string, "question": string, "options": [string, string, string], "correctIndex": number, "explanation": string }.`;
  }

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a cognitive bias simulator. JSON only." },
      { role: "user", content: prompt }
    ], { 
      response_format: { type: "json_object" } 
    });
    return JSON.parse(content);
  } catch (error) {
    console.error("Simulator step generation failed:", error);
    throw error;
  }
};

export const generateHint = async (biasName: string): Promise<string> => {
  try {
    const content = await callOpenRouter([
      { 
        role: "user", 
        content: `Short, 1-sentence cryptic hint for: "${biasName}". No spoilers. Max 10 words.` 
      }
    ]);
    return content.trim();
  } catch {
    return "Think about the core concept.";
  }
};

export const generateBiasScenario = async (targetBiases: Bias[], context: string): Promise<BiasedSnippet> => {
  const biasesList = targetBiases.map(b => `- ${b.name} (ID: ${b.id}): ${b.definition}`).join('\n');
  
  const prompt = `
    Write a realistic '${context}' of about 150-200 words. 
    Embed exactly these ${targetBiases.length} cognitive biases into the text:
    ${biasesList}
    
    The writing should sound natural, not like a textbook example.
    
    Output strictly valid JSON:
    {
      "text": "Full text here...",
      "segments": [
        {
          "quote": "Exact substring from text",
          "biasId": "id from list above",
          "explanation": "Brief explanation",
          "cues": ["Specific trigger 1", "Trigger 2"]
        }
      ]
    }
  `;

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a cognitive psychology expert. JSON only." },
      { role: "user", content: prompt }
    ], { 
      response_format: { type: "json_object" } 
    });
    return JSON.parse(content);
  } catch (error) {
    console.error("Bias scenario generation failed:", error);
    throw error;
  }
};

export const auditDecision = async (title: string, description: string): Promise<any> => {
  const prompt = `
    Act as a rationality coach. Analyze this decision:
    Title: "${title}"
    Context: "${description}"
    
    Identify the top 3 cognitive biases that might be influencing this decision.
    For each, provide:
    1. The bias name (try to map to standard biases).
    2. A brief explanation of why it applies here.
    3. A single, hard-hitting "Killer Question" to help the user test if they are falling for it.
    4. A list of 2-3 observable "cues" (feelings, phrases, situations) to watch for in the future.
    
    Output strictly valid JSON:
    {
      "detectedBiases": [
        {
          "biasName": "string",
          "reasoning": "string",
          "challengingQuestion": "string",
          "cues": ["cue 1", "cue 2"]
        }
      ]
    }
  `;

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a critical thinking coach. JSON only." },
      { role: "user", content: prompt }
    ], { 
      response_format: { type: "json_object" } 
    });
    return JSON.parse(content);
  } catch (error) {
    console.error("Decision audit failed:", error);
    throw error;
  }
};

export const generateFallacyScenario = async (targetFallacies: Fallacy[], context: string): Promise<BiasedSnippet> => {
  const fallaciesList = targetFallacies.map(f => `- ${f.name} (ID: ${f.id}): ${f.definition}`).join('\n');
  
  const prompt = `
    Write a realistic dialogue between two or more people in the context of '${context}'.
    The dialogue should be about 200 words long.
    Embed exactly these ${targetFallacies.length} logical fallacies into the lines of the dialogue:
    ${fallaciesList}
    
    The writing should sound like a natural debate or conversation, not a textbook.
    
    Output strictly valid JSON:
    {
      "text": "Full dialogue text here...",
      "segments": [
        {
          "quote": "Exact substring from the dialogue line",
          "biasId": "id from list above",
          "explanation": "Brief explanation of why this specific line is fallacious",
          "cues": ["Verbal cue", "Tone cue", "Logical trigger"]
        }
      ]
    }
  `;

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a logic and rhetoric expert. JSON only." },
      { role: "user", content: prompt }
    ], { 
      response_format: { type: "json_object" } 
    });
    return JSON.parse(content);
  } catch (error) {
    console.error("Fallacy scenario generation failed:", error);
    throw error;
  }
};

export const generateLabStatement = async (targetFallacy: Fallacy): Promise<BiasedSnippet> => {
  const prompt = `
    Generate a single, realistic fallacious statement that clearly demonstrates the "${targetFallacy.name}" fallacy.
    Definition: ${targetFallacy.definition}
    
    The topic should be a common debate (technology, work, lifestyle).
    Make it sound like a real comment one might find online or in a meeting.
    
    Output strictly valid JSON:
    { 
      "text": "The full statement here",
      "segments": [
        {
          "quote": "The exact fallacious part",
          "biasId": "${targetFallacy.id}",
          "explanation": "Why this is fallacious",
          "cues": ["Verbal cue", "Logical trigger"]
        }
      ]
    }
  `;

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a logic instructor. JSON only." },
      { role: "user", content: prompt }
    ], { response_format: { type: "json_object" } });
    return JSON.parse(content);
  } catch (error) {
    console.error("Lab statement generation failed:", error);
    return { 
      text: targetFallacy.example,
      segments: [{
        quote: targetFallacy.example,
        biasId: targetFallacy.id,
        explanation: targetFallacy.definition
      }]
    };
  }
};

export const evaluateRepair = async (original: string, fallacy: string, repair: string): Promise<any> => {
  const prompt = `
    Evaluate this 'Argument Repair'. 
    
    Original Statement (Fallacious): "${original}"
    Fallacy used: "${fallacy}"
    User's Attempt to Repair: "${repair}"
    
    CRITERIA:
    1. Did they successfully remove the fallacy?
    2. Did they preserve the core point or concern of the original statement? (The "Steel Man" approach)
    3. Is the resulting argument logically sound and clear?
    
    Output strictly valid JSON:
    {
      "isSuccess": boolean,
      "score": number (weighted average 0-100),
      "breakdown": {
        "logic": number (0-100, success in removing fallacy),
        "intent": number (0-100, success in preserving core concern),
        "clarity": number (0-100, effectiveness of the new phrasing)
      },
      "feedback": "Constructive critique of their repair",
      "improvedVersion": "An even better, more rigorous version of the repair",
      "cues": ["What to listen for next time", "Situational trigger"]
    }
  `;

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a rigorous logic professor and debate coach. JSON only." },
      { role: "user", content: prompt }
    ], { response_format: { type: "json_object" } });
    return JSON.parse(content);
  } catch (error) {
    console.error("Repair evaluation failed:", error);
    throw error;
  }
};

export const runAlgorithmTest = async (biasName: string, definition: string, pseudoCode: string): Promise<any> => {
  const prompt = `
    Act as a "Logic Compiler" and Adversarial Unit Tester for cognitive psychology concepts.
    
    TARGET CONCEPT: "${biasName}"
    DEFINITION: "${definition}"
    USER'S PSEUDO-CODE LOGIC:
    \`\`\`
    ${pseudoCode}
    \`\`\`
    
    TASK:
    Run exactly 3 "Unit Tests" against the user's pseudo-code.
    1. Test Case 1: A standard scenario (Happy Path).
    2. Test Case 2: A subtle edge case where the logic might be too simple.
    3. Test Case 3: A counter-example where the logic shouldn't trigger, or triggers incorrectly.
    
    For each test case, determine if the logic "Passes" or "Throws an Error".
    Do not explain the bias itself. Be a literal-minded compiler.
    
    Output strictly valid JSON:
    {
      "results": [
        {
          "testCase": "string (name of test)",
          "scenario": "string (brief scenario description)",
          "isPass": boolean,
          "error": "string (Logic Error message if isPass is false)",
          "suggestion": "string (how to refine the code if isPass is false)"
        }
      ],
      "overallAssessment": "string (Brief conclusion on the logic's robustness)",
      "status": "compiled | buggy | critical_failure"
    }
  `;

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a literal-minded logic compiler. JSON only." },
      { role: "user", content: prompt }
    ], { response_format: { type: "json_object" } });
    return JSON.parse(content);
  } catch (error) {
    console.error("Algorithm test failed:", error);
    throw error;
  }
};

export const generateContextScenario = async (action: string): Promise<any> => {
  const prompt = `
    Analyze this specific action: "${action}"
    
    Generate 3 distinct contexts where this action might occur:
    1. Survival/High-Stakes (Where it's useful).
    2. Social/Professional (Where it's dangerous).
    3. Neutral/Noise (Where it's mixed).
    
    For each, define a "Utility Range" (0 to 100).
    - 0 = Pure Harmful Bias (Irrational error).
    - 100 = Pure Useful Heuristic (Smart shortcut).
    - Example: Running from a lion is 90-100. Judging a book by cover in a library is 40-60.
    
    Output strictly valid JSON:
    {
      "action": "${action}",
      "contexts": [
        {
          "id": "uuid-1",
          "type": "Survival",
          "setting": "Short descriptive title (e.g. Dark Alley)",
          "description": "Narrative of the situation...",
          "range": { "min": 80, "max": 100 },
          "reasoning": "Why this range is correct...",
          "cues": ["Specific visual/auditory cue 1", "Cue 2"]
        },
        {
          "id": "uuid-2",
          "type": "Social",
          "setting": "Short descriptive title",
          "description": "...",
          "range": { "min": 0, "max": 30 },
          "reasoning": "...",
          "cues": ["..."]
        },
        {
          "id": "uuid-3",
          "type": "Neutral",
          "setting": "Short descriptive title",
          "description": "...",
          "range": { "min": 40, "max": 60 },
          "reasoning": "...",
          "cues": ["..."]
        }
      ]
    }
  `;

  try {
    const content = await callOpenRouter([
      { role: "system", content: "You are a Cognitive Calibration Engine. JSON only." },
      { role: "user", content: prompt }
    ], { response_format: { type: "json_object" } });
    return JSON.parse(content);
  } catch (error) {
    console.error("Context scenario generation failed:", error);
    throw error;
  }
};

export const sendChatMessage = async (history: { role: string, content: string }[], weakBiases: string[]): Promise<string> => {
  const biasContext = weakBiases.length > 0 
    ? `The user struggles with: ${weakBiases.join(', ')}. Watch for these specifically.`
    : "";

  const systemPrompt = `
    ROLE: You are a Socratic Rationality Coach. You help users debug their own cognition.
    
    PRIME DIRECTIVE: 
    - NEVER lecture. 
    - NEVER give answers immediately. 
    - ONLY ask probing questions (Street Epistemology style).
    - Your goal is to help the user self-identify their cognitive distortions.
    
    PROTOCOL:
    1. Listen: Identify emotional charge and logical claims.
    2. Diagnose: Internally match their statement to a Cognitive Bias or Logical Fallacy.
    3. Probe: Ask a question that targets the EVIDENCE for their claim.
       - Bad: "That is attribution error."
       - Good: "What evidence do you have that this is his character, rather than his situation?"
    4. Naming: Only suggest the technical term if the user is stuck or has realized the error.
    
    CONTEXT:
    ${biasContext}
    
    TONE:
    Empathetic but rigorous. Like a kind physics professor or a wise mentor.
    Keep responses short (under 3 sentences usually).
  `;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...history
    ];

    const content = await callOpenRouter(messages); // Standard call, not streaming yet to keep it simple
    return content;
  } catch (error) {
    console.error("Chat message failed:", error);
    throw error;
  }
};
