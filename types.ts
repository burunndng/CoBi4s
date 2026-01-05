
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
    type: 'Survival' | 'Social' | 'Neutral';
    description: string;
    verdict: 'Useful Heuristic' | 'Harmful Bias' | 'Neutral';
    explanation: string;
  }[];
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
