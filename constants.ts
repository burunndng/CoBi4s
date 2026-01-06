
import { Bias, Category, Difficulty, AppState } from './types';
import { FALLACIES } from './constants/fallacies';

export { FALLACIES };

export const BIASES: Bias[] = [
    { 
      id: 'confirmation-bias', 
      name: 'Confirmation Bias', 
      category: Category.BELIEF, 
      definition: 'The tendency to search for, interpret, and recall information that supports one\'s prior beliefs.', 
      example: 'A manager ignores successful reports from a remote worker but highlights a single missed email to prove remote work fails.', 
      counterStrategy: 'Actively seek out "disconfirming" evidence. Play devil\'s advocate against your own ideas.', 
      relatedBiases: ['anchoring', 'belief-perseverance'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"I knew it!"', '"Exactly what I expected."', 'Ignoring contradictory data', 'Seeking only validating sources']
    },
    { 
      id: 'anchoring-bias', 
      name: 'Anchoring Bias', 
      category: Category.DECISION_MAKING, 
      definition: 'Relying too heavily on the first piece of information offered (the "anchor") when making decisions.', 
      example: 'Seeing a shirt for $100 makes a $50 shirt seem cheap, even if $50 is expensive for that shirt.', 
      counterStrategy: 'Establish your own criteria/value before looking at the provided numbers.', 
      relatedBiases: ['framing-effect'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['The first price mentioned', '"It was originally $X"', 'Using a random starting point as a benchmark']
    },
    { 
      id: 'sunk-cost-fallacy', 
      name: 'Sunk Cost Fallacy', 
      category: Category.DECISION_MAKING, 
      definition: 'Continuing an endeavor because of previously invested resources (time, money), rather than future value.', 
      example: 'Finishing a boring book just because you read the first 100 pages.', 
      counterStrategy: 'Ask: "If I hadn\'t invested anything yet, would I start this today?"', 
      relatedBiases: ['loss-aversion'], 
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"We\'ve already spent too much to stop"', '"Can\'t let it go to waste"', 'Investment-based inertia']
    },
    { 
      id: 'fundamental-attribution-error', 
      name: 'Fundamental Attribution Error', 
      category: Category.SOCIAL, 
      definition: 'Overemphasizing personality-based explanations for others\' behavior while underemphasizing situational explanations.', 
      example: 'Thinking someone is lazy because they are late, rather than considering there might be traffic.', 
      counterStrategy: 'Look for situational factors first. Give others the benefit of the doubt.', 
      relatedBiases: ['self-serving-bias'], 
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"They are just that kind of person"', 'Ignoring the environment', 'Quick character judgments']
    },
    { 
      id: 'availability-heuristic', 
      name: 'Availability Heuristic', 
      category: Category.DECISION_MAKING, 
      definition: 'Overestimating the importance of information that is available (recent or emotional).', 
      example: 'Thinking plane crashes are more common than car crashes because they are reported more in the news.', 
      counterStrategy: 'Look for statistics and base rates rather than relying on examples that come to mind.', 
      relatedBiases: ['recency-bias', 'negativity-bias'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"I just saw this on the news"', 'Recent vivid memories', 'Emotional anecdotes']
    },
    { 
      id: 'dunning-kruger-effect', 
      name: 'Dunning-Kruger Effect', 
      category: Category.SOCIAL, 
      definition: 'People with low ability at a task overestimate their ability.', 
      example: 'An amateur chess player thinking they can beat a grandmaster because they know how the pieces move.', 
      counterStrategy: 'Seek feedback from others and be open to criticism. Keep learning.', 
      relatedBiases: ['overconfidence-effect'], 
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"It\'s actually quite simple"', 'Dismissing expert nuance', 'Overconfidence in new skills']
    },
    { 
      id: 'halo-effect', 
      name: 'Halo Effect', 
      category: Category.SOCIAL, 
      definition: 'The tendency for an impression created in one area to influence opinion in another area.', 
      example: 'Assuming a physically attractive person is also kind and intelligent.', 
      counterStrategy: 'Evaluate specific traits independently rather than forming a global impression.', 
      relatedBiases: ['horn-effect'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"They seem nice, so they must be right"', 'Global positive impressions', 'Attractiveness bias']
    },
    { 
      id: 'framing-effect', 
      name: 'Framing Effect', 
      category: Category.DECISION_MAKING, 
      definition: 'Drawing different conclusions from the same information, depending on how that information is presented.', 
      example: 'Preferring meat labeled "75% lean" over meat labeled "25% fat".', 
      counterStrategy: 'Restate the information in different ways (e.g., look at the loss frame if presented with a gain frame).', 
      relatedBiases: ['loss-aversion'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"90% success rate" vs "10% failure"', 'Highlighting gains over losses', 'Selective wording']
    },
    { 
      id: 'hindsight-bias', 
      name: 'Hindsight Bias', 
      category: Category.BELIEF, 
      definition: 'The tendency to perceive past events as having been more predictable than they actually were.', 
      example: 'Saying "I knew it all along" after a stock market crash.', 
      counterStrategy: 'Keep a decision journal to record your predictions and reasoning before events occur.', 
      relatedBiases: ['outcome-bias'], 
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"I knew it!" (after the fact)', '"It was so obvious"', 'Predicting the past']
    },
    { 
      id: 'gamblers-fallacy', 
      name: 'Gambler\'s Fallacy', 
      category: Category.DECISION_MAKING, 
      definition: 'Believing that if a particular event occurs more frequently than normal during the past, it is less likely to happen in the future.', 
      example: 'Thinking that after 5 heads in a row, the next coin toss must be tails.', 
      counterStrategy: 'Remember that independent events (like coin tosses) have no memory.', 
      relatedBiases: ['hot-hand-fallacy'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"It\'s due for a win"', 'Patterns in random noise', 'Streaks in independent events']
    },
    { 
      id: 'status-quo-bias', 
      name: 'Status Quo Bias', 
      category: Category.DECISION_MAKING, 
      definition: 'The preference for the current state of affairs; doing nothing or maintaining the current decision.', 
      example: 'Keeping a subscription you don\'t use simply because it\'s already set up.', 
      counterStrategy: 'Ask: "If I wasn\'t already in this situation, would I choose to enter it?"', 
      relatedBiases: ['loss-aversion'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"It\'s how we\'ve always done it"', 'Default options', 'Fear of change']
    },
    { 
      id: 'self-serving-bias', 
      name: 'Self-Serving Bias', 
      category: Category.SOCIAL, 
      definition: 'The tendency to attribute positive events to one\'s own character but attribute negative events to external factors.', 
      example: 'Getting an A is "I\'m smart," but getting an F is "The teacher hates me."', 
      counterStrategy: 'Accept responsibility for failures and look for external contributors to success.', 
      relatedBiases: ['fundamental-attribution-error'], 
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['Taking credit for luck', 'Blaming others for failure', 'Ego protection']
    },
    { 
      id: 'survivorship-bias', 
      name: 'Survivorship Bias', 
      category: Category.DECISION_MAKING, 
      definition: 'Concentrating on the people or things that made it past some selection process and overlooking those that did not.', 
      example: 'Looking at successful startups to find a formula for success, while ignoring failed startups that did the same things.', 
      counterStrategy: 'Ask: "What about the failures? What data is missing?"', 
      relatedBiases: ['availability-heuristic'], 
      difficulty: Difficulty.ADVANCED,
      transferCues: ['"I did it, so can you"', 'Ignoring the "silent graveyard"', 'Successful outliers']
    },
    { 
      id: 'loss-aversion', 
      name: 'Loss Aversion', 
      category: Category.DECISION_MAKING, 
      definition: 'The tendency to prefer avoiding losses to acquiring equivalent gains.', 
      example: 'Refusing to sell a losing stock because you don\'t want to realize the loss, hoping it bounces back.', 
      counterStrategy: 'Evaluate the decision as if you didn\'t own the item. Would you buy it today?', 
      relatedBiases: ['sunk-cost-fallacy', 'endowment-effect'], 
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"I can\'t afford to lose this"', 'Overvaluing what you own', 'Fear of regret']
    },
    { 
      id: 'bandwagon-effect', 
      name: 'Bandwagon Effect', 
      category: Category.SOCIAL, 
      definition: 'The tendency to do (or believe) things because many other people do (or believe) the same.', 
      example: 'Buying a specific brand of phone just because everyone else has one.', 
      counterStrategy: 'Pause and ask if you actually want/need the item or idea, independent of others.', 
      relatedBiases: ['groupthink'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"Everyone is doing it"', 'Viral trends', 'Social proof']
    },
    { 
      id: 'decoy-effect', 
      name: 'Decoy Effect', 
      category: Category.DECISION_MAKING, 
      definition: 'The phenomenon where consumers will tend to have a specific change in preference between two options when also presented with a third option that is asymmetrically dominated.', 
      example: 'Popcorn sizes: Small $3, Large $7. Adding a Medium for $6.50 makes the Large look like a steal.', 
      counterStrategy: 'Ignore the options you wouldn\'t choose. Compare items on their own merits.', 
      relatedBiases: ['anchoring-bias'], 
      difficulty: Difficulty.ADVANCED,
      transferCues: ['"For only $1 more..."', 'Useless middle options', 'Comparison traps']
    },
    { 
      id: 'planning-fallacy', 
      name: 'Planning Fallacy', 
      category: Category.DECISION_MAKING, 
      definition: 'The tendency to underestimate the time, costs, and risks of future actions and at the same time overestimate the benefits.', 
      example: 'Thinking you can write a term paper in one night.', 
      counterStrategy: 'Use "reference class forecasting": look at how long similar tasks took in the past.', 
      relatedBiases: ['optimism-bias'], 
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"It will only take a minute"', 'Ignoring past delays', 'Best-case scenario thinking']
    },
    { 
      id: 'zero-risk-bias', 
      name: 'Zero-Risk Bias', 
      category: Category.DECISION_MAKING, 
      definition: 'Preference for reducing a small risk to zero over a greater reduction in a larger risk.', 
      example: 'Paying a premium to eliminate the 1% risk of a minor issue rather than reducing a 10% risk of a major issue to 5%.', 
      counterStrategy: 'Calculate the total expected value/impact of risk reduction.', 
      relatedBiases: ['certainty-effect'], 
      difficulty: Difficulty.ADVANCED,
      transferCues: ['"Complete peace of mind"', 'Eliminating minor risks', 'Certainty premium']
    },
    { 
      id: 'parkinsons-law', 
      name: "Parkinson's Law", 
      category: Category.DECISION_MAKING, 
      definition: 'Work expands so as to fill the time available for its completion.', 
      example: 'Taking two weeks to finish a project that could be done in two days, just because the deadline is two weeks away.', 
      counterStrategy: 'Set artificial, aggressive deadlines for yourself.', 
      relatedBiases: ['planning-fallacy'], 
      difficulty: Difficulty.BEGINNER,
      transferCues: ['Filling the deadline', 'Busy-work', 'Inefficient time use']
    }
];

export const DEBATE_TOPICS = [
  "Artificial Intelligence will eventually replace all creative human endeavors.",
  "Social media is fundamentally incompatible with a healthy democracy.",
  "Remote work is a net negative for professional development and corporate culture.",
  "Universal Basic Income is the only solution to automation-driven unemployment.",
  "Space exploration is a waste of resources that should be spent on Earth.",
  "A meat-heavy diet is the most optimal for human evolution and performance.",
  "Nuclear energy is the only viable path to zero-carbon emissions by 2050."
];

export const INITIAL_STATE: AppState = {
  mode: 'psychology',
  progress: {},
  fallacyProgress: {},
  dailyStreak: 0,
  lastStudyDate: null,
  totalXp: 0,
  favorites: [],
  decisionLogs: [],
  algorithmTests: [],
  shadowBoxingHistory: [],
  chatHistory: [],
  transferLogs: [],
  dailyFocus: null,
  preferences: {
    flashcardsOnlyFavorites: false,
    learnTab: 'all'
  }
};
