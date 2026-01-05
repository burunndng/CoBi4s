
export enum Category {
  BELIEF = 'belief',
  DECISION_MAKING = 'decision-making',
  SOCIAL = 'social',
  MEMORY = 'memory'
}

export enum FallacyType {
  FORMAL = 'formal',
  INFORMAL = 'informal',
  RHETORICAL = 'rhetorical'
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface Bias {
  id: string;
  name: string;
  category: Category;
  definition: string;
  example: string;
  counterStrategy: string;
  relatedBiases: string[];
  difficulty: Difficulty;
}

export interface Fallacy {
  id: string;
  name: string;
  type: FallacyType;
  definition: string;
  structure?: string;
  example: string;
  counterStrategy: string;
  difficulty: Difficulty;
}

export interface ProgressState {
  biasId: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReviewDate: number;
  masteryLevel: number;
}

export interface DecisionLog {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  detectedBiases: {
    biasId: string;
    reasoning: string;
    challengingQuestion: string;
    cues?: string[];
  }[];
  userReflections: Record<string, string>; // biasId -> user answer
  finalConclusion: string;
  status: 'draft' | 'audited' | 'finalized';
}

export type LearningMode = 'psychology' | 'logic';

export interface AlgorithmTest {
  id: string;
  timestamp: number;
  biasId: string;
  pseudoCode: string;
  results: {
    testCase: string;
    scenario: string;
    isPass: boolean;
    error?: string;
    suggestion?: string;
  }[];
  overallAssessment: string;
  status: 'compiled' | 'buggy' | 'critical_failure';
}

export interface ContextScenario {
  action: string;
  contexts: {
    id: string;
    type: 'Survival' | 'Social' | 'Neutral';
    setting: string;
    description: string;
    range: { min: number; max: number }; // 0 = Harmful Bias, 100 = Useful Heuristic
    reasoning: string;
    cues: string[];
  }[];
}

  segments: {
    quote: string;
    biasId: string;
    explanation: string;
    cues?: string[];
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  relatedBiasId?: string; // If the AI detects a specific bias
}

export interface AppState {
  mode: LearningMode;
  progress: Record<string, ProgressState>;
  fallacyProgress: Record<string, ProgressState>;
  dailyStreak: number;
  lastStudyDate: string | null;
  totalXp: number;
  favorites: string[];
  decisionLogs: DecisionLog[];
  algorithmTests: AlgorithmTest[];
  chatHistory: ChatMessage[];
  preferences: {
    flashcardsOnlyFavorites: boolean;
    learnTab: string;
  };
}
