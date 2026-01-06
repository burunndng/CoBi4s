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
  {
    id: 'ab-02',
    biasId: 'anchoring-bias',
    text: "During a salary negotiation, the recruiter mentions a range starting at $50k. You struggle to ask for $80k because the first number mentioned has mentally tethered you. This is:",
    scenario: true,
    options: [
      "Anchoring Bias",
      "Framing Effect",
      "Status Quo Bias",
      "Loss Aversion"
    ],
    correctAnswer: "Anchoring Bias",
    explanation: "The first number mentioned (the anchor) disproportionately influences all subsequent negotiations."
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
  {
    id: 'sc-02',
    biasId: 'sunk-cost-fallacy',
    text: "A project manager refuses to cancel a failing software project because 'we've already spent six months coding it.' This is classic:",
    scenario: true,
    options: [
      "Sunk Cost Fallacy",
      "Planning Fallacy",
      "Escalation of Commitment",
      "Endowment Effect"
    ],
    correctAnswer: "Sunk Cost Fallacy",
    explanation: "Past investment (time/money) should not dictate future action if the future value is negative."
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
  },

  // --- Dunning-Kruger ---
  {
    id: 'dk-01',
    biasId: 'dunning-kruger-effect',
    text: "A beginner chess player watches one tutorial and thinks, 'This game is easy, I could beat a master.' This overconfidence in low competence is:",
    scenario: true,
    options: [
      "Dunning-Kruger Effect",
      "Overconfidence Bias",
      "Self-Serving Bias",
      "Illusory Superiority"
    ],
    correctAnswer: "Dunning-Kruger Effect",
    explanation: "Low ability individuals often lack the meta-cognition to realize how much they don't know."
  },

  // --- Halo Effect ---
  {
    id: 'he-01',
    biasId: 'halo-effect',
    text: "You assume a well-dressed, attractive CEO must also be honest and kind, despite having no evidence of their character. This is:",
    scenario: true,
    options: [
      "Halo Effect",
      "Horn Effect",
      "Authority Bias",
      "Stereotyping"
    ],
    correctAnswer: "Halo Effect",
    explanation: "A positive impression in one area (appearance) influenced your opinion in an unrelated area (character)."
  },

  // --- Hindsight Bias ---
  {
    id: 'hb-01',
    biasId: 'hindsight-bias',
    text: "After the stock market crashes, an analyst claims, 'It was obvious! All the signs were there!' despite never predicting it beforehand. This is:",
    scenario: true,
    options: [
      "Hindsight Bias",
      "Outcome Bias",
      "Confirmation Bias",
      "Self-Serving Bias"
    ],
    correctAnswer: "Hindsight Bias",
    explanation: "They are reconstructing the past to make the event seem predictable, ignoring the uncertainty that existed at the time."
  },

  // --- Gambler's Fallacy ---
  {
    id: 'gf-01',
    biasId: 'gamblers-fallacy',
    text: "A roulette wheel has hit red 5 times in a row. You bet heavily on black because 'it's due.' You are committing:",
    scenario: true,
    options: [
      "Gambler's Fallacy",
      "Hot Hand Fallacy",
      "Sunk Cost Fallacy",
      "Clustering Illusion"
    ],
    correctAnswer: "Gambler's Fallacy",
    explanation: "Independent random events (like roulette spins) have no memory; previous results do not influence future odds."
  },

  // --- Survivorship Bias ---
  {
    id: 'sb-01',
    biasId: 'survivorship-bias',
    text: "You read biographies of college dropouts who became billionaires and conclude that dropping out causes success. You are ignoring the millions who dropped out and failed. This is:",
    scenario: true,
    options: [
      "Survivorship Bias",
      "Selection Bias",
      "Confirmation Bias",
      "Base Rate Neglect"
    ],
    correctAnswer: "Survivorship Bias",
    explanation: "You are focusing only on the 'survivors' of the process and ignoring the data from those who didn't make it."
  },

  // --- Authority Bias ---
  {
    id: 'aut-01',
    biasId: 'authority-bias',
    text: "You buy a brand of toothpaste because a famous actor plays a dentist in a commercial and recommends it. This is:",
    scenario: true,
    options: [
      "Authority Bias",
      "Halo Effect",
      "Social Proof",
      "Framing Effect"
    ],
    correctAnswer: "Authority Bias",
    explanation: "You are attributing accuracy to an opinion based on the figure's perceived status/role, not their actual expertise."
  },

  // --- Groupthink ---
  {
    id: 'gt-01',
    biasId: 'groupthink',
    text: "In a meeting, everyone agrees to a risky plan because they don't want to cause conflict, even though many have silent doubts. This phenomenon is:",
    scenario: true,
    options: [
      "Groupthink",
      "Bandwagon Effect",
      "False Consensus Effect",
      "Pluralistic Ignorance"
    ],
    correctAnswer: "Groupthink",
    explanation: " The desire for harmony/conformity in the group resulted in an irrational decision-making outcome."
  },

  // --- Bandwagon Effect ---
  {
    id: 'bw-01',
    biasId: 'bandwagon-effect',
    text: "You vote for a candidate primarily because you see they are leading in the polls and 'everyone else is voting for them.' This is:",
    scenario: true,
    options: [
      "Bandwagon Effect",
      "Groupthink",
      "Social Proof",
      "Authority Bias"
    ],
    correctAnswer: "Bandwagon Effect",
    explanation: "The probability of adopting a belief increases with the number of people who already hold that belief."
  },

  // --- Negativity Bias ---
  {
    id: 'nb-01',
    biasId: 'negativity-bias',
    text: "You receive 10 compliments and 1 critique on your work. You spend all night obsessing over the critique. This is:",
    scenario: true,
    options: [
      "Negativity Bias",
      "Loss Aversion",
      "Pessimism Bias",
      "Spotlight Effect"
    ],
    correctAnswer: "Negativity Bias",
    explanation: "Your brain gives more psychological weight to negative experiences than positive ones of equal intensity."
  },

  // --- Recency Bias ---
  {
    id: 'rb-01',
    biasId: 'recency-bias',
    text: "When evaluating an employee for a yearly review, you focus entirely on a mistake they made last week, ignoring 11 months of excellent work. This is:",
    scenario: true,
    options: [
      "Recency Bias",
      "Availability Heuristic",
      "Fundamental Attribution Error",
      "Anchoring Bias"
    ],
    correctAnswer: "Recency Bias",
    explanation: "You are giving disproportionate weight to the most recent information simply because it is fresh."
  },

  // --- Spotlight Effect ---
  {
    id: 'se-01',
    biasId: 'spotlight-effect',
    text: "You spill a drop of coffee on your shirt and spend the whole day convinced everyone is staring at it. In reality, no one noticed. This is:",
    scenario: true,
    options: [
      "Spotlight Effect",
      "Egocentric Bias",
      "Transparency Illusion",
      "Self-Consciousness"
    ],
    correctAnswer: "Spotlight Effect",
    explanation: "You are overestimating the extent to which your actions/appearance are noticed by others."
  },

  // --- Outcome Bias ---
  {
    id: 'ob-01',
    biasId: 'outcome-bias',
    text: "A surgeon performs a risky, unnecessary surgery. The patient survives, so the hospital board praises the surgeon's 'bold decision.' This ignores the bad logic because of the good result. This is:",
    scenario: true,
    options: [
      "Outcome Bias",
      "Hindsight Bias",
      "Survivorship Bias",
      "Resulting"
    ],
    correctAnswer: "Outcome Bias",
    explanation: "Judging the quality of a decision based on its outcome rather than the quality of the decision-making process."
  },

  // --- Zero-Risk Bias ---
  {
    id: 'zrb-01',
    biasId: 'zero-risk-bias',
    text: "You pay $50 to reduce a 1% risk of package theft to 0%, but refuse to pay $50 to reduce a 20% risk of car theft to 10%. You prefer the absolute certainty. This is:",
    scenario: true,
    options: [
      "Zero-Risk Bias",
      "Certainty Effect",
      "Loss Aversion",
      "Neglect of Probability"
    ],
    correctAnswer: "Zero-Risk Bias",
    explanation: "We prefer reducing a small risk to zero over a greater reduction in a larger risk, because we crave certainty."
  },

  // --- Parkinson's Law ---
  {
    id: 'pl-01',
    biasId: 'parkinsons-law',
    text: "You have 2 weeks to write a report that takes 4 hours. You end up dragging it out over the full 2 weeks. This phenomenon is:",
    scenario: true,
    options: [
      "Parkinson's Law",
      "Procrastination",
      "Planning Fallacy",
      "Student Syndrome"
    ],
    correctAnswer: "Parkinson's Law",
    explanation: "Work expands to fill the time available for its completion."
  },

  // --- False Cause ---
  {
    id: 'fc-01',
    biasId: 'false-cause',
    text: "Every time I wash my car, it rains. Therefore, washing my car causes rain. This logic commits:",
    scenario: true,
    options: [
      "False Cause",
      "Post Hoc",
      "Correlation Illusion",
      "Texas Sharpshooter"
    ],
    correctAnswer: "False Cause",
    explanation: "It presumes a causal relationship between two events just because they are correlated or sequential."
  },

  // --- Appeal to Ignorance ---
  {
    id: 'ati-01',
    biasId: 'appeal-to-ignorance',
    text: "No one has proven that aliens don't exist, so they must exist. This argument is an:",
    scenario: true,
    options: [
      "Appeal to Ignorance",
      "God of the Gaps",
      "Burden of Proof",
      "Non Sequitur"
    ],
    correctAnswer: "Appeal to Ignorance",
    explanation: "It argues that a proposition is true simply because it has not yet been proven false."
  },

  // --- Loaded Question ---
  {
    id: 'lq-01',
    biasId: 'loaded-question',
    text: "A lawyer asks a defendant: 'Have you stopped beating your wife?' If the defendant answers yes or no, they admit guilt. This is a:",
    scenario: true,
    options: [
      "Loaded Question",
      "Leading Question",
      "Complex Question",
      "Begging the Question"
    ],
    correctAnswer: "Loaded Question",
    explanation: "The question contains a controversial assumption (that he beat his wife) built into it."
  },

  // --- Begging the Question ---
  {
    id: 'btq-01',
    biasId: 'begging-the-question',
    text: "'Paranormal phenomena are real because I have had experiences that can only be described as paranormal.' This reasoning is:",
    scenario: true,
    options: [
      "Begging the Question",
      "Circular Reasoning",
      "Tautology",
      "Appeal to Faith"
    ],
    correctAnswer: "Begging the Question",
    explanation: "The conclusion ('paranormal is real') is assumed in the premise ('experiences described as paranormal')."
  },

  // --- Red Herring ---
  {
    id: 'rh-01',
    biasId: 'red-herring',
    text: "Mom: 'It's time to do your homework.' Child: 'Did you know that penguins can't fly?' The child is using:",
    scenario: true,
    options: [
      "Red Herring",
      "Non Sequitur",
      "Topic Avoidance",
      "Straw Man"
    ],
    correctAnswer: "Red Herring",
    explanation: "Introducing an irrelevant topic to divert attention from the original issue (homework)."
  },

  // --- Tu Quoque ---
  {
    id: 'tq-01',
    biasId: 'tu-quoque',
    text: "Person A: 'Smoking is bad for your health.' Person B: 'But you smoke a pack a day!' Person B is using:",
    scenario: true,
    options: [
      "Tu Quoque",
      "Ad Hominem",
      "Appeal to Hypocrisy",
      "Red Herring"
    ],
    correctAnswer: "Tu Quoque",
    explanation: "Dismissing an argument by pointing out that the arguer fails to act consistently with their own claim."
  },

  // --- No True Scotsman ---
  {
    id: 'nts-01',
    biasId: 'no-true-scotsman',
    text: "A: 'No vegan eats meat.' B: 'But John is vegan and he eats chicken.' A: 'Then John is not a TRUE vegan.' This is:",
    scenario: true,
    options: [
      "No True Scotsman",
      "Moving the Goalposts",
      "Special Pleading",
      "Appeal to Purity"
    ],
    correctAnswer: "No True Scotsman",
    explanation: "Modifying the definition of a category to exclude a specific counter-example."
  }
];