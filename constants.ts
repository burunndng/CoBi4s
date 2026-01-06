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
      example: 'Getting an A is "I\'m smart," but getting an F is "The teacher hates me." ',
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
    },
    // ⚡️ NEW BIASES
    {
      id: 'negativity-bias',
      name: 'Negativity Bias',
      category: Category.BELIEF,
      definition: 'The tendency to give more weight to negative experiences than positive ones.',
      example: 'Dwelling on one critical comment in a performance review while ignoring ten compliments.',
      counterStrategy: 'Keep a "Success Journal" to actively track positive outcomes.',
      relatedBiases: ['loss-aversion', 'availability-heuristic'],
      difficulty: Difficulty.BEGINNER,
      transferCues: ['Dwelling on criticism', 'Remembering only the bad', 'Assuming the worst']
    },
    {
      id: 'outcome-bias',
      name: 'Outcome Bias',
      category: Category.DECISION_MAKING,
      definition: 'Judging a decision based on its outcome rather than the quality of the decision at the time it was made.',
      example: 'Winning a lottery ticket and thinking "I made a smart financial investment." ',
      counterStrategy: 'Evaluate decisions based on the information available at the time, not the result.',
      relatedBiases: ['hindsight-bias'],
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"It worked out, so I was right"', 'Judging by results only', 'Ignoring process']
    },
    {
      id: 'spotlight-effect',
      name: 'Spotlight Effect',
      category: Category.SOCIAL,
      definition: 'Overestimating the extent to which others notice and evaluate our appearance and behavior.',
      example: 'Thinking everyone is staring at a small stain on your shirt.',
      counterStrategy: 'Remind yourself that people are generally focused on themselves, not you.',
      relatedBiases: ['egocentric-bias'],
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"Everyone is looking at me"', 'Self-consciousness', 'Overestimating visibility']
    },
    {
      id: 'recency-bias',
      name: 'Recency Bias',
      category: Category.MEMORY,
      definition: 'The tendency to weigh the latest information more heavily than older data.',
      example: 'Judging an employee solely on their performance in the last week before a review.',
      counterStrategy: 'Look at the full history of data, not just the last few points.',
      relatedBiases: ['availability-heuristic'],
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"But lately..."', 'Ignoring long-term trends', 'Overvaluing the present']
    },
    {
      id: 'optimism-bias',
      name: 'Optimism Bias',
      category: Category.BELIEF,
      definition: 'Believing that you are less likely to experience a negative event than others.',
      example: 'Thinking "I won\'t get into a car accident" while texting and driving.',
      counterStrategy: 'Look at base rates for negative events and assume you are average.',
      relatedBiases: ['overconfidence-effect'],
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"That won\'t happen to me"', 'Ignoring risks', 'It\'ll be fine']
    },
    {
      id: 'belief-perseverance',
      name: 'Belief Perseverance',
      category: Category.BELIEF,
      definition: 'Clinging to one\'s initial belief even after receiving new information that contradicts it.',
      example: 'Still believing a news story is true even after it has been retracted.',
      counterStrategy: 'Ask: "What would it take for me to change my mind?"',
      relatedBiases: ['confirmation-bias'],
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"I don\'t care what the facts say"', 'Doubling down', 'Refusing to update']
    },
    {
      id: 'groupthink',
      name: 'Groupthink',
      category: Category.SOCIAL,
      definition: 'The practice of thinking or making decisions as a group in a way that discourages creativity or individual responsibility.',
      example: 'A board of directors agreeing to a bad plan because no one wants to rock the boat.',
      counterStrategy: 'Assign a "Devil\'s Advocate" to challenge the group\'s consensus.',
      relatedBiases: ['bandwagon-effect', 'conformity-bias'],
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"Let\'s just agree"', 'Silence in meetings', 'Fear of dissent']
    },
    {
      id: 'curse-of-knowledge',
      name: 'Curse of Knowledge',
      category: Category.SOCIAL,
      definition: 'When better-informed people find it extremely difficult to think about problems from the perspective of lesser-informed people.',
      example: 'A professor explaining a complex concept using jargon that students don\'t understand.',
      counterStrategy: 'Explain it like you\'re talking to a 5-year-old.',
      relatedBiases: ['hindsight-bias'],
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"It\'s obvious"', 'Using jargon', 'Frustration with beginners']
    },
    {
      id: 'endowment-effect',
      name: 'Endowment Effect',
      category: Category.DECISION_MAKING,
      definition: 'People ascribe more value to things merely because they own them.',
      example: 'Refusing to sell a mug for $5 that you wouldn\'t pay $2 to buy.',
      counterStrategy: 'Ask: "If I didn\'t own this, how much would I pay for it?"',
      relatedBiases: ['loss-aversion', 'sunk-cost-fallacy'],
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"It\'s mine, so it\'s worth more"', 'Overpricing used goods', 'Emotional attachment to stuff']
    },
    {
      id: 'information-bias',
      name: 'Information Bias',
      category: Category.DECISION_MAKING,
      definition: 'The tendency to seek information even when it cannot affect action.',
      example: 'Ordering more medical tests when the treatment plan would be the same regardless of the results.',
      counterStrategy: 'Ask: "Will this information change my decision?"',
      relatedBiases: ['analysis-paralysis'],
      difficulty: Difficulty.ADVANCED,
      transferCues: ['"Just one more report"', 'Data for data\'s sake', 'Procrastinating with research']
    },
    {
      id: 'mere-exposure-effect',
      name: 'Mere Exposure Effect',
      category: Category.BELIEF,
      definition: 'The tendency to develop a preference for things merely because they are familiar with them.',
      example: 'Voting for a candidate just because you recognize their name.',
      counterStrategy: 'Evaluate the option on its merits, not its familiarity.',
      relatedBiases: ['availability-heuristic', 'status-quo-bias'],
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"I know this one"', 'Comfort in familiarity', 'Repeating choices']
    },
    {
      id: 'false-consensus-effect',
      name: 'False Consensus Effect',
      category: Category.SOCIAL,
      definition: 'Overestimating the extent to which their opinions, beliefs, preferences, values, and habits are normal and typical of those of others.',
      example: 'Thinking "everyone likes pizza" and being shocked when someone doesn\'t.',
      counterStrategy: 'Remember that your experience is not universal.',
      relatedBiases: ['projection-bias'],
      difficulty: Difficulty.INTERMEDIATE,
      transferCues: ['"Everyone agrees with me"', 'Shock at dissent', 'Assuming shared values']
    },
    {
      id: 'authority-bias',
      name: 'Authority Bias',
      category: Category.SOCIAL,
      definition: 'The tendency to attribute greater accuracy to the opinion of an authority figure and be more influenced by that opinion.',
      example: 'Buying a product because a doctor endorsed it, even if they aren\'t a specialist.',
      counterStrategy: 'Evaluate the evidence, not the person.',
      relatedBiases: ['halo-effect'],
      difficulty: Difficulty.BEGINNER,
      transferCues: ['"The expert said so"', 'Blind trust', 'Ignoring evidence for status']
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
  roadmap: [],
  userProfile: {
    longTermMemory: [],
    archivedSessions: 0
  },
  preferences: {
    flashcardsOnlyFavorites: false,
    learnTab: 'all'
  }
};