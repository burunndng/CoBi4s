
export enum Category {
  BELIEF = 'belief',
  DECISION_MAKING = 'decision-making',
  SOCIAL = 'social',
  MEMORY = 'memory'
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
  }[];
  userReflections: Record<string, string>; // biasId -> user answer
  finalConclusion: string;
  status: 'draft' | 'audited' | 'finalized';
}

export interface AppState {
  progress: Record<string, ProgressState>;
  dailyStreak: number;
  lastStudyDate: string | null;
  totalXp: number;
  favorites: string[];
  decisionLogs: DecisionLog[];
  preferences: {
    flashcardsOnlyFavorites: boolean;
    learnTab: string;
  };
}

export interface BiasedSnippet {
  text: string;
  segments: {
    quote: string;
    biasId: string;
    explanation: string;
  }[];
}
