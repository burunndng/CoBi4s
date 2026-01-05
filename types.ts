
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

export interface AppState {
  progress: Record<string, ProgressState>;
  dailyStreak: number;
  lastStudyDate: string | null;
  totalXp: number;
  favorites: string[];
  preferences: {
    flashcardsOnlyFavorites: boolean;
    learnTab: string;
  };
}

export interface QuizQuestion {
  biasId: string;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  isScenario: boolean;
}

export interface BiasedSnippet {
  text: string;
  segments: {
    quote: string;
    biasId: string;
    explanation: string;
  }[];
}
