
import { QuizQuestion } from '../types';

export const QUIZ_VAULT: QuizQuestion[] = [
  // --- CONFIRMATION BIAS ---
  {
    id: 'cb-01',
    biasId: 'confirmation-bias',
    text: "You suspect your neighbor is stealing your newspaper. One morning, you see him walking near your driveway. You immediately think, 'I knew it!' forgetting the 10 times he walked by without stopping. What is this?",
    scenario: true,
    options: [
      "Confirmation Bias",
      "Fundamental Attribution Error",
      "Availability Heuristic",
      "Self-Serving Bias"
    ],
    correctAnswer: "Confirmation Bias",
    explanation: "You prioritized evidence that supported your suspicion (seeing him once) while ignoring evidence that disproved it (him walking by 10 times)."
  },
  {
    id: 'cb-02',
    biasId: 'confirmation-bias',
    text: "A trader believes 'Tech stocks always crash on Tuesdays.' He points to three recent Tuesdays where this happened, ignoring the 49 other Tuesdays where they went up. This is:",
    scenario: true,
    options: [
      "Confirmation Bias",
      "Gambler's Fallacy",
      "Hindsight Bias",
      "Texas Sharpshooter"
    ],
    correctAnswer: "Confirmation Bias",
    explanation: "The trader is selectively gathering data to support his pre-existing hypothesis."
  },
  
  // --- ANCHORING BIAS ---
  {
    id: 'ab-01',
    biasId: 'anchoring-bias',
    text: "A car dealer tells you a car is worth $20,000. You negotiate it down to $15,000 and feel like you won, even though the car is only worth $12,000. Why?",
    scenario: true,
    options: [
      "Anchoring Bias",
      "Sunk Cost Fallacy",
      "Decoy Effect",
      "Endowment Effect"
    ],
    correctAnswer: "Anchoring Bias",
    explanation: "The initial $20k price set an 'anchor' that distorted your perception of value, making $15k feel cheap."
  },

  // --- SUNK COST ---
  {
    id: 'sc-01',
    biasId: 'sunk-cost-fallacy',
    text: "You hate the movie you're watching, but you stay for the last hour because 'I already paid $15 for the ticket.' This reasoning is:",
    scenario: true,
    options: [
      "Sunk Cost Fallacy",
      "Status Quo Bias",
      "Loss Aversion",
      "Commitment Bias"
    ],
    correctAnswer: "Sunk Cost Fallacy",
    explanation: "The $15 is gone regardless. Staying just costs you time (a new cost) for no benefit."
  },

  // --- FUNDAMENTAL ATTRIBUTION ERROR ---
  {
    id: 'fae-01',
    biasId: 'fundamental-attribution-error',
    text: "A colleague is late to a meeting. You assume they are disorganized and lazy. When YOU are late the next day, you blame the heavy traffic. You just committed:",
    scenario: true,
    options: [
      "Fundamental Attribution Error",
      "Self-Serving Bias",
      "Halo Effect",
      "Projection Bias"
    ],
    correctAnswer: "Fundamental Attribution Error",
    explanation: "You attributed their action to character (internal) but your own to the situation (external)."
  },

  // --- STRAW MAN ---
  {
    id: 'sm-01',
    biasId: 'straw-man',
    text: "Person A: 'We should improve bike lanes.' Person B: 'So you want to ban all cars and destroy the economy?!' Person B is using:",
    scenario: true,
    options: [
      "Straw Man",
      "Slippery Slope",
      "False Dilemma",
      "Red Herring"
    ],
    correctAnswer: "Straw Man",
    explanation: "Person B distorted A's reasonable argument into an extreme version to make it easier to attack."
  },

  // --- AD HOMINEM ---
  {
    id: 'ah-01',
    biasId: 'ad-hominem',
    text: "'You can't trust Dr. Smith's research on climate change; he drives a diesel truck and got divorced twice.' This argument is:",
    scenario: true,
    options: [
      "Ad Hominem",
      "Tu Quoque",
      "Genetic Fallacy",
      "Poisoning the Well"
    ],
    correctAnswer: "Ad Hominem",
    explanation: "The attack focuses on Dr. Smith's personal traits/actions rather than the validity of his research data."
  },

  // --- FALSE DILEMMA ---
  {
    id: 'fd-01',
    biasId: 'false-dilemma',
    text: "'You're either with us, or you're against us.' This statement ignores neutrality or nuance. It is a:",
    scenario: true,
    options: [
      "False Dilemma",
      "Hasty Generalization",
      "Begging the Question",
      "No True Scotsman"
    ],
    correctAnswer: "False Dilemma",
    explanation: "It presents two extremes as the only possibilities, ignoring the middle ground."
  },

  // --- SLIPPERY SLOPE ---
  {
    id: 'ss-01',
    biasId: 'slippery-slope',
    text: "'If we let students have 5 extra minutes for lunch, they'll stop studying entirely, fail their exams, and society will collapse.' This is:",
    scenario: true,
    options: [
      "Slippery Slope",
      "Appeal to Fear",
      "Non Sequitur",
      "Post Hoc"
    ],
    correctAnswer: "Slippery Slope",
    explanation: "It assumes a catastrophic chain reaction without providing evidence for the causal links."
  },

  // --- AVAILABILITY HEURISTIC ---
  {
    id: 'ah-02',
    biasId: 'availability-heuristic',
    text: "After seeing a news report about a shark attack, you refuse to swim in the ocean, believing attacks are common. In reality, they are incredibly rare. You fell for:",
    scenario: true,
    options: [
      "Availability Heuristic",
      "Negativity Bias",
      "Affect Heuristic",
      "Base Rate Neglect"
    ],
    correctAnswer: "Availability Heuristic",
    explanation: "You judged probability based on how easily the vivid memory came to mind, not on statistics."
  }
];
