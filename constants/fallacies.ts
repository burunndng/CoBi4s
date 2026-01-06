import { Fallacy, FallacyType, Difficulty } from '../types';

export const FALLACIES: Fallacy[] = [
  {
    id: 'straw-man',
    name: 'Straw Man',
    type: FallacyType.INFORMAL,
    definition: 'Misrepresenting someone\'s argument to make it easier to attack.',
    example: 'After Will said that we should put more money into health and education, Warren responded by saying that he was surprised that Will hates our country so much that he wants to leave it defenseless by cutting military spending.',
    counterStrategy: 'Steel man the opponent\'s argument first, then ask them if you\'ve represented it fairly before responding.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'ad-hominem',
    name: 'Ad Hominem',
    type: FallacyType.INFORMAL,
    definition: 'Attacking the character or personal traits of an opponent instead of their argument.',
    example: 'After Sally presents an eloquent and compelling case for a more equitable taxation system, Sam asks the audience whether we should believe anything from a woman who isn\'t married, was once arrested, and smells a bit weird.',
    counterStrategy: 'Point out that your character is irrelevant to the validity of the logic presented.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'false-dilemma',
    name: 'False Dilemma',
    type: FallacyType.INFORMAL,
    definition: 'Presenting two opposing options as the only possibilities when more exist.',
    example: 'Whilst rallying support for his plan to fundamentally undermine citizens\' rights, the Supreme Leader told the people they were either on his side, or they were on the side of the enemy.',
    counterStrategy: 'Identify the "middle ground" or alternative options that were omitted.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'slippery-slope',
    name: 'Slippery Slope',
    type: FallacyType.INFORMAL,
    definition: 'Asserting that if we allow A to happen, then Z will eventually happen too, therefore A should not happen.',
    example: 'Colin Closet asserts that if we allow same-sex couples to marry, then the next thing we know we\'ll be allowing people to marry their parents, their cars and even monkeys.',
    counterStrategy: 'Ask for the specific causal mechanism that makes Z inevitable if A occurs.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'circular-reasoning',
    name: 'Circular Reasoning',
    type: FallacyType.INFORMAL,
    definition: 'A type of reasoning in which the proposition is supported by the premises, which is supported by the proposition.',
    structure: 'A is true because B is true; B is true because A is true.',
    example: 'The word of Zorbo the Great is flawless and perfect. We know this because it says so in The Great and Infallible Book of Zorbo\'s Best and Most Truest Things that are Definitely True and Should Not Ever Be Questioned.',
    counterStrategy: 'Show that the conclusion is being used as its own premise.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'hasty-generalization',
    name: 'Hasty Generalization',
    type: FallacyType.INFORMAL,
    definition: 'Making a broad claim based on a sample size that is too small.',
    example: 'My grandfather smoked four packs of cigarettes a day since age fourteen and lived until age ninety-six. Therefore, smoking really can\'t be that bad for you.',
    counterStrategy: 'Cite larger sample sizes and statistical averages.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'red-herring',
    name: 'Red Herring',
    type: FallacyType.RHETORICAL,
    definition: 'Introducing an irrelevant topic to divert attention from the original issue.',
    example: 'When asked about his record on the environment, the candidate began talking about how his opponent\'s family was wealthy and out of touch.',
    counterStrategy: 'Acknowledge the new topic if necessary, but pivot back to the original question.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'post-hoc',
    name: 'Post Hoc Ergo Propter Hoc',
    type: FallacyType.INFORMAL,
    definition: 'Claiming that because one event followed another, it was caused by it.',
    structure: 'A happened, then B happened. Therefore A caused B.',
    example: 'I wore my lucky socks today and we won the game. Those socks are the reason we won!',
    counterStrategy: 'Point out that correlation does not equal causation.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'appeal-to-authority',
    name: 'Appeal to Authority',
    type: FallacyType.INFORMAL,
    definition: 'Claiming something is true because an \'authority\' figure said it, regardless of actual evidence.',
    example: 'A famous actor says that a certain diet is the best way to lose weight, so it must be true.',
    counterStrategy: 'Check if the authority is an expert in the specific field and ask for the underlying data.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'appeal-to-emotion',
    name: 'Appeal to Emotion',
    type: FallacyType.RHETORICAL,
    definition: 'Manipulating an emotional response in place of a valid or compelling argument.',
    example: 'Luke didn\'t want to eat his Brussels sprouts, but his father told him to think about the poor, starving children in a third world country who weren\'t fortunate enough to have any food at all.',
    counterStrategy: 'Validate the emotion but separate it from the logical validity of the claim.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'tu-quoque',
    name: 'Tu Quoque',
    type: FallacyType.INFORMAL,
    definition: 'Avoiding criticism by turning it back on the accuser.',
    example: 'Nicole identified that Hannah had committed a logical fallacy, but instead of addressing the substance of her claim, Hannah accused Nicole of committing a fallacy earlier in the conversation.',
    counterStrategy: 'Say \'Even if I am guilty of that, it doesn\'t make your current argument correct.\'',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'no-true-scotsman',
    name: 'No True Scotsman',
    type: FallacyType.INFORMAL,
    definition: 'An appeal to purity as a way to dismiss relevant criticisms or flaws of an argument.',
    example: 'Angus declares that Scotsmen do not put sugar on their porridge, to which Lachlan points out that he is a Scotsman and is currently putting sugar on his porridge. Furious, Angus yells that no true Scotsman puts sugar on his porridge.',
    counterStrategy: 'Define the original term strictly and show how the goalposts are being moved.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'genetic-fallacy',
    name: 'Genetic Fallacy',
    type: FallacyType.INFORMAL,
    definition: 'Judging something good or bad on the basis of where it comes from, or from whom it comes.',
    example: 'Accused on the 6 o\'clock news of corruption and taking bribes, the senator said that we should all be very wary of the things we hear in the media, because we all know how very unreliable the media can be.',
    counterStrategy: 'Remind the opponent that the origin of an idea is separate from its truth value.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'appeal-to-nature',
    name: 'Appeal to Nature',
    type: FallacyType.INFORMAL,
    definition: 'Arguing that because something is \'natural\' it is therefore valid, justified, inevitable, good, or ideal.',
    example: 'The medicine man rolled into town on his bandwagon offering various natural remedies, such as very special plain water. He said that it was only natural that people should be wary of \'artificial\' medicines such as antibiotics.',
    counterStrategy: 'Point out things that are natural but harmful (poison ivy, arsenic) and things that are artificial but helpful (surgery).',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'burden-of-proof',
    name: 'Burden of Proof',
    type: FallacyType.RHETORICAL,
    definition: 'Saying that the burden of proof lies not with the person making the claim, but with someone else to disprove.',
    example: 'Bertrand declares that a teapot is, at this very moment, in orbit around the Sun between the Earth and Mars, and that because no one can prove him wrong, his claim is therefore a valid one.',
    counterStrategy: 'State that the one making the claim must provide the evidence.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'anecdotal',
    name: 'Anecdotal',
    type: FallacyType.INFORMAL,
    definition: 'Using personal experience or an isolated example instead of a valid argument, especially to dismiss statistics.',
    example: 'Jason said that that was all well and good, but his grandfather smoked, like, 30 cigarettes a day and lived until 97 - so don\'t believe everything you read about meta-analyses of methodologically sound studies showing proven causal relationships.',
    counterStrategy: 'Explain the difference between a single data point and a trend.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'texas-sharpshooter',
    name: 'Texas Sharpshooter',
    type: FallacyType.INFORMAL,
    definition: 'Cherry-picking data clusters to suit an argument, or finding a pattern to fit a presumption.',
    example: 'The makers of Sugarette Candy Drinks point to research showing that of the five countries where Sugarette drinks sell the most units, three of them are in the top ten healthiest countries on Earth, therefore Sugarette drinks are healthy.',
    counterStrategy: 'Ask for the data on the countries that were excluded.',
    difficulty: Difficulty.ADVANCED
  },
  {
    id: 'middle-ground',
    name: 'Middle Ground',
    type: FallacyType.INFORMAL,
    definition: 'Claiming that a compromise, or middle point, between two extremes must be the truth.',
    example: 'Holly said that vaccinations caused autism in children, but her scientifically well-read friend Caleb said that this claim had been debunked and proven false. Their friend Alice offered a compromise that vaccinations must cause some autism, just not all autism.',
    counterStrategy: 'Point out that the truth is often not in the middle; one side can be completely wrong.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'personal-incredulity',
    name: 'Personal Incredulity',
    type: FallacyType.INFORMAL,
    definition: 'Saying that because one finds something difficult to understand, it\'s therefore not true.',
    example: 'Kirk drew a picture of a fish and a human and with effusive disdain asked Richard if he really thought we were stupid enough to believe that a fish somehow turned into a human through just, like, random things happening over time.',
    counterStrategy: 'Offer to explain the concept or point to expert consensus.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'ambiguity',
    name: 'Ambiguity',
    type: FallacyType.INFORMAL,
    definition: 'Using double meanings or ambiguities of language to mislead or misrepresent the truth.',
    example: 'When the judge asked the defendant why he hadn\'t paid his parking fines, he said that he shouldn\'t have to pay them because the sign said \'Fine for parking here\' and so he naturally presumed that it would be fine to park there.',
    counterStrategy: 'Define the terms of the argument strictly.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'non-sequitur',
    name: 'Non Sequitur',
    type: FallacyType.FORMAL,
    definition: 'A conclusion or statement that does not logically follow from the previous argument or statement.',
    structure: 'A is true. Therefore C is true (skipping B).',
    example: 'If I am in Tokyo, I am in Japan. I am in Japan. Therefore, I am in Tokyo.',
    counterStrategy: 'Demonstrate that the premise can be true while the conclusion is false.',
    difficulty: Difficulty.ADVANCED
  },
  {
    id: 'equivocation',
    name: 'Equivocation',
    type: FallacyType.INFORMAL,
    definition: 'Using a particular word in different senses within an argument.',
    example: 'The priest told me I should have faith. I have faith that my son will do well in school this year. Therefore, the priest should be happy with me.',
    counterStrategy: 'Clarify the two different meanings of the word being used.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'moving-the-goalposts',
    name: 'Moving the Goalposts',
    type: FallacyType.RHETORICAL,
    definition: 'Demanding from an opponent new evidence after the first piece of evidence has been provided.',
    example: 'After the scientist proved that the Earth was round, the flat-earther demanded that he also prove that gravity exists before he would accept the round Earth.',
    counterStrategy: 'Identify that the original condition for acceptance has been met.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'fallacy-fallacy',
    name: 'The Fallacy Fallacy',
    type: FallacyType.INFORMAL,
    definition: 'Presuming that because a claim has been poorly argued, or a fallacy has been made, that it is necessarily wrong.',
    example: 'Recognising that Amanda had committed a fallacy in her argument that we should eat healthy food because a nutritionist said it was popular, Alyse said we should therefore eat bacon double cheeseburgers every day.',
    counterStrategy: 'Acknowledge the fallacy but re-examine the core claim independently.',
    difficulty: Difficulty.ADVANCED
  },
  {
    id: 'special-pleading',
    name: 'Special Pleading',
    type: FallacyType.INFORMAL,
    definition: 'Moving the goalposts or making up exceptions when a claim is shown to be false.',
    example: 'Edward Johns claimed to be psychic, but when his \'abilities\' were tested under proper scientific conditions, they magically disappeared. Edward explained this saying that one had to have faith in his abilities for them to work.',
    counterStrategy: 'Ask for a principled reason why the rule doesn\'t apply in this case.',
    difficulty: Difficulty.INTERMEDIATE
  }
];

// ⚡️ NEW FALLACIES
export const NEW_FALLACIES: Fallacy[] = [
  {
    id: 'appeal-to-ignorance',
    name: 'Appeal to Ignorance',
    type: FallacyType.INFORMAL,
    definition: 'Asserting that a proposition is true because it has not yet been proven false (or vice versa).',
    example: 'You can\'t prove that ghosts don\'t exist, so they must be real.',
    counterStrategy: 'Remind them that the inability to disprove a claim does not make it true.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'false-cause',
    name: 'False Cause',
    type: FallacyType.INFORMAL,
    definition: 'Presuming that a real or perceived relationship between things means that one is the cause of the other.',
    example: 'Pointing to a fancy chart, Roger shows how temperatures have been rising over the past few centuries, whilst at the same time the numbers of pirates have been decreasing; thus pirates cool the world and global warming is a hoax.',
    counterStrategy: 'Explain that correlation does not imply causation.',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'loaded-question',
    name: 'Loaded Question',
    type: FallacyType.RHETORICAL,
    definition: 'Asking a question that has an assumption built into it so that it can\'t be answered without appearing guilty.',
    example: 'Grace and Helen were both romantically interested in Brad. One day, with Brad sitting within earshot, Grace asked in an inquisitive tone whether Helen was having any problems with a fungal infection.',
    counterStrategy: 'Identify the implicit assumption and refuse to answer the question as framed.',
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    id: 'bandwagon',
    name: 'Bandwagon Fallacy',
    type: FallacyType.SOCIAL,
    definition: 'Appealing to popularity or the fact that many people do something as an attempted form of validation.',
    example: 'Shamus pointed a drunken finger at Sean and asked him to explain how so many people could believe in leprechauns if they\'re only a silly old superstition.',
    counterStrategy: 'Point out that popularity has no bearing on truth (e.g., people once believed the earth was flat).',
    difficulty: Difficulty.BEGINNER
  },
  {
    id: 'begging-the-question',
    name: 'Begging the Question',
    type: FallacyType.FORMAL,
    definition: 'A circular argument in which the conclusion is included in the premise.',
    example: 'The word of Zorbo the Great is flawless and perfect. We know this because it says so in The Great and Infallible Book of Zorbo\'s Best and Most Truest Things that are Definitely True and Should Not Ever Be Questioned.',
    counterStrategy: 'Show that the premise assumes the truth of the conclusion.',
    difficulty: Difficulty.INTERMEDIATE
  }
];