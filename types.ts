
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
  transferCues: string[]; // ⚡️ Lens: Real-world linguistic/situational markers
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
  transferCues: string[]; // ⚡️ Lens: Real-world linguistic/situational markers
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
    severity?: number; // 1-10 User Rating
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
  ast?: {
    root: {
      type: string;
      value: string;
      children?: any[];
    }
  };
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

export interface BiasedSnippet {
  text: string;
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

export interface ShadowBoxingTurn {
  id: string;
  role: 'adversary' | 'user';
  content: string;
  timestamp: number;
  fallacyInjected?: string; // Fallacy ID if role === 'adversary'
  calloutDetected?: {
    fallacyId: string;
    isCorrect: boolean;
    explanation: string;
  };
}

export interface ShadowBoxingSession {
  id: string;
  topic: string;
  integrityPoints: number; // Start at 100
  history: ShadowBoxingTurn[];
  status: 'active' | 'defeated' | 'victory';
  startTime: number;
}

export interface TransferLog {
  id: string;
  timestamp: number;
  biasId: string;
  context: 'work' | 'social' | 'internal' | 'news';
  note: string; // Max 150 chars (Sentinel constraint)
  impact: number; // 1-5 (Critique Agent constraint)
}

export interface CustomMilestone {

  id: string;

  timestamp: number;

  label: string;

  completed: boolean;

  type: 'study' | 'practice' | 'real-world';

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

  shadowBoxingHistory: ShadowBoxingSession[];

  chatHistory: ChatMessage[];

  transferLogs: TransferLog[];

  dailyFocus: {

    biasId: string;

    lastUpdated: string;

    observedToday: boolean;

  } | null;

    roadmap: CustomMilestone[];

    userProfile: {

      longTermMemory: string[];

      archivedSessions: number;

    };

    preferences: {
    flashcardsOnlyFavorites: boolean;
    learnTab: string;
  };
}
